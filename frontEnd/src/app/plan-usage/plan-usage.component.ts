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
      console.log(this.internetUsedPercentage);
    });

    this.socket.getInternetUsage().subscribe((data: string) => {
      this.internetUsage = data;
      console.log(this.internetUsage);
    });
  }

  onPlanChange() {
    console.log('Plan:', this.plan);
    this.plan = this.planEvent;
    this.socket.setPlanSize(this.plan);

    // Perform any other desired actions
  }

  onEmailChange() {
    console.log('Email:', this.email);
    // Perform any other desired actions
  }
}
