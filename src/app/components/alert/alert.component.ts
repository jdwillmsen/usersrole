import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Alert } from 'src/app/models/alert.model';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription;
  alert: Alert | null = null;
  
  constructor(private alertService: AlertService) {
    
  }

  ngOnInit() {
    this.subscription = this.alertService.getAlert().subscribe(alert => {
      this.alert = alert;
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
