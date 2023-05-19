import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-plan-usage',
  templateUrl: './plan-usage.component.html',
  styleUrls: ['./plan-usage.component.scss'],
})
export class PlanUsageComponent implements OnInit {
  internetUsedPercentage: number = 89;
  planEvent!: any;
  plan: any = '500KB';
  email!: any;
  internetUsage!: string;
  constructor(private socket: SocketService) {}
  ngOnInit() {
    this.socket.getInternetUsageInPorcentage().subscribe((data: number) => {
      this.internetUsedPercentage = data;
    });

    this.socket.getInternetUsage().subscribe((data: string) => {
      this.internetUsage = data;
    });
  }

  onPlanChange() {
    if (!this.planEvent) return;
    this.plan = this.planEvent;
    this.socket.setPlanSize(this.plan);

    // Perform any other desired actions
  }

  onEmailChange() {
    if (!this.email) return;
    console.log('Email:', this.email);
    this.socket.updateEmail(this.email);
    // Perform any other desired actions
  }

  sendEmail() {
    if (!this.email) return;
    this.socket.sendEmail();
  }
}
