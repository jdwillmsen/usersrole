#!/usr/bin/env python3
"""Redact captured evidence before it touches disk.

Reads stdin, writes stdout. Anything that identifies a real user or could be
replayed as a credential is replaced; only the throwaway walkthrough accounts
named in RETIREMENT_KEEP (comma-separated emails and UIDs) survive, so the
evidence still shows which account did what.

With --har the input is parsed as a HAR first, so user records inside API
response bodies can be scrubbed field by field rather than by pattern alone:
a display name has no recognisable shape.
"""
import json
import os
import re
import sys

KEEP = {k.strip().lower() for k in os.environ.get('RETIREMENT_KEEP', '').split(',') if k.strip()}

EMAIL = re.compile(r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}')
JWT = re.compile(r'eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]*')
GOOGLE_ACCESS_TOKEN = re.compile(r'ya29\.[A-Za-z0-9._-]+')
BEARER = re.compile(r'(?i)(bearer\s+)[A-Za-z0-9._~+/=-]+')
API_KEY = re.compile(r'AIza[0-9A-Za-z_-]{35}')
# Firebase Auth UIDs are 28 base62 characters; nothing else in these captures
# has that exact shape, so matching on it catches UIDs embedded in URLs too.
FIREBASE_UID = re.compile(r'(?<![A-Za-z0-9])[A-Za-z0-9]{28}(?![A-Za-z0-9])')
SECRET_FIELDS = re.compile(
    r'(?i)("?(?:signerKey|saltSeparator|clientSecret|client_secret|privateKey|private_key|privateKeyData|'
    r'refreshToken|refresh_token|idToken|id_token|accessToken|access_token|password|apiKey|secret)"?\s*[:=]\s*)'
    r'("[^"]*"|\'[^\']*\'|[^\s,}]+)'
)
BILLING_ACCOUNT = re.compile(r'\b([0-9A-F]{6})-([0-9A-F]{6})-([0-9A-F]{6})\b')


def keep(value):
    return value.lower() in KEEP


def scrub_text(text):
    text = SECRET_FIELDS.sub(lambda m: m.group(1) + '"<redacted>"', text)
    text = JWT.sub('<redacted-jwt>', text)
    text = GOOGLE_ACCESS_TOKEN.sub('<redacted-access-token>', text)
    text = BEARER.sub(lambda m: m.group(1) + '<redacted>', text)
    text = API_KEY.sub('<redacted-api-key>', text)
    text = EMAIL.sub(lambda m: m.group(0) if keep(m.group(0)) else '<redacted-email>', text)
    text = FIREBASE_UID.sub(lambda m: m.group(0) if keep(m.group(0)) else '<redacted-uid>', text)
    text = BILLING_ACCOUNT.sub(lambda m: 'XXXXXX-XXXXXX-' + m.group(3)[-4:].rjust(6, 'X'), text)
    return text


def is_foreign_user(obj):
    ident = [obj.get(k) for k in ('uid', 'email') if isinstance(obj.get(k), str) and obj.get(k)]
    return bool(ident) and not any(keep(i) for i in ident)


# Redacted wherever they appear as an object key, including inside a request or
# response body that is itself a JSON string (a form the text pass cannot see,
# because its quotes are escaped). Passwords are the reason: a sign-up body
# carries one in cleartext.
SENSITIVE_KEYS = {
    'password',
    'clientsecret',
    'client_secret',
    'privatekey',
    'private_key',
    'refreshtoken',
    'refresh_token',
    'idtoken',
    'id_token',
    'accesstoken',
    'access_token',
    'apikey',
    'signerkey',
    'saltseparator',
    'secret',
}


def scrub_json(node):
    if isinstance(node, dict):
        if is_foreign_user(node):
            return {k: (v if k == 'roles' else '<redacted>') for k, v in node.items()}
        return {
            k: ('<redacted>' if k.lower() in SENSITIVE_KEYS else scrub_json(v))
            for k, v in node.items()
        }
    if isinstance(node, list):
        return [scrub_json(v) for v in node]
    return node


def scrub_body(text):
    try:
        return json.dumps(scrub_json(json.loads(text)))
    except (ValueError, TypeError):
        return text


def scrub_har(har):
    for entry in har.get('log', {}).get('entries', []):
        for part in (entry.get('request', {}), entry.get('response', {})):
            for header in part.get('headers', []):
                if header.get('name', '').lower() in ('authorization', 'cookie', 'set-cookie', 'x-firebase-appcheck'):
                    header['value'] = '<redacted>'
        post = entry.get('request', {}).get('postData')
        if post and 'text' in post:
            post['text'] = scrub_body(post['text'])
        content = entry.get('response', {}).get('content', {})
        if content.get('text') and content.get('encoding') != 'base64':
            content['text'] = scrub_body(content['text'])
    return har


def main():
    raw = sys.stdin.read()
    if '--har' in sys.argv:
        raw = json.dumps(scrub_har(json.loads(raw)), indent=2)
    sys.stdout.write(scrub_text(raw))


if __name__ == '__main__':
    main()
