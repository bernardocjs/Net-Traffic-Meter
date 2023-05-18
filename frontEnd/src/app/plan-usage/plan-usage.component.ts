import { Component } from '@angular/core';

@Component({
  selector: 'app-plan-usage',
  templateUrl: './plan-usage.component.html',
  styleUrls: ['./plan-usage.component.scss'],
})
export class PlanUsageComponent {
  plan!: any;
  email!: any;

  onPlanChange() {
    console.log('Plan:', this.plan);
    // Perform any other desired actions
  }

  onEmailChange() {
    console.log('Email:', this.email);
    // Perform any other desired actions
  }
}
