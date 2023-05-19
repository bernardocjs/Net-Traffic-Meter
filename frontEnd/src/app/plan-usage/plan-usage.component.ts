import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { HttpClient } from '@angular/common/http';

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
  constructor(private socket: SocketService, private http: HttpClient) {}
  ngOnInit() {
    this.socket.getInternetUsageInPorcentage().subscribe((data: number) => {
      this.internetUsedPercentage = data;
    });

    this.socket.getInternetUsage().subscribe((data: string) => {
      this.internetUsage = data;
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

  sendEmail() {
    const emailTry = {
      to: 'hackthon2023viasat@gmail.com',
      subject: 'Email Subject',
      text: 'Email Text',
    };
    const emailData = emailTry;
    console.log(this.email);
    this.http.post('http://localhost:8000/send-email', emailData).subscribe(
      () => {
        console.log('Email sent successfully!');
        // Handle success
      },
      (error) => {
        console.error('An error occurred while sending the email:', error);
        // Handle error
      }
    );
  }
}
