import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TrafficInfo } from '../interfaces/traffic-info';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private http: HttpClient) {}

  private trafficInfoSubject: Subject<TrafficInfo[]> = new Subject<
    TrafficInfo[]
  >();
  private totalInternet: Subject<string> = new Subject<string>();
  private totalInternetInPorcentage: Subject<number> = new Subject<number>();
  public internetFromApp: number = 0;

  sizePlan!: number;

  private totalDownload: Subject<string> = new Subject<string>();
  public downloadFromApp: number = 0;

  private mostExpensiveApp: Subject<string> = new Subject<string>();
  private appRanking: Subject<TrafficInfo[]> = new Subject<TrafficInfo[]>();
  private plan: Subject<string> = new Subject<string>();

  public email!: string;
  public emailSent = false;
  public planSize!: string;

  getTrafficInfo(): Observable<TrafficInfo[]> {
    return this.trafficInfoSubject.asObservable();
  }

  getInternetUsage(): Observable<string> {
    return this.totalInternet.asObservable();
  }

  getInternetUsageInPorcentage(): Observable<number> {
    return this.totalInternetInPorcentage.asObservable();
  }

  getDownloadUsage(): Observable<string> {
    return this.totalDownload.asObservable();
  }

  getMostExpensiveApp(): Observable<string> {
    return this.mostExpensiveApp.asObservable();
  }

  getRanking(): Observable<TrafficInfo[]> {
    return this.appRanking.asObservable();
  }

  getPlan(): Observable<string> {
    return this.plan.asObservable();
  }

  getPlanPorcentage(): number {
    if (!this.sizePlan) return 0;
    const percentage = (this.internetFromApp / this.sizePlan) * 100;
    if (!this.emailSent && percentage >= 100) {
      this.sendEmail();
      this.emailSent = true;
    }
    return percentage;
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

  setPlanSize(plan: string) {
    this.sizePlan = this.parseDataFromFormat(plan);
    this.plan.next(plan);
  }

  deserializeInfo(data: TrafficInfo[]) {
    if (!data) return;
    this.internetSum(data);
    this.totalInternetInPorcentage.next(this.getPlanPorcentage());

    this.totalInternet.next(this.formatData(this.internetFromApp));
    this.internetFromApp = 0;

    this.downloadSum(data);
    this.totalDownload.next(this.formatData(this.downloadFromApp));
    this.downloadFromApp = 0;

    this.appRanking.next(this.sortMostExpensive(data));

    this.mostExpensiveApp.next(this.mostExpensiveAppName(data));
    this.trafficInfoSubject.next(data);
  }

  updatePlan(planSize: string) {
    this.planSize = planSize;
  }

  updateEmail(email: string) {
    this.email = email;
  }

  parseDataFromFormat(download: string): number {
    const valueWithUnit = download.match(/[0-9.]+|[A-Za-z]+/g);
    if (!valueWithUnit) return 0;
    const value = parseFloat(valueWithUnit[0]);
    const unit = valueWithUnit[1];
    const numericValue = value;
    if (isNaN(value)) return 0;
    if (unit === 'B') {
      return numericValue;
    } else if (unit === 'KB') {
      return numericValue * 1024;
    } else if (unit === 'MB') {
      return numericValue * 1024 * 1024;
    } else if (unit === 'GB') {
      return numericValue * 1024 * 1024 * 1024;
    } else {
      return 0; // Invalid unit or format
    }
  }

  downloadSum(data: TrafficInfo[]): void {
    if (!data) return;
    data.map((info: TrafficInfo) => {
      this.downloadFromApp += this.parseDataFromFormat(info.download_speed);
    });
  }

  internetSum(data: TrafficInfo[]): void {
    if (!data) return;

    data.map((info: TrafficInfo) => {
      this.internetFromApp += this.parseDataFromFormat(info.download);
    });
  }

  formatData(sizeInBytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = sizeInBytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return size.toFixed(2) + units[unitIndex];
  }

  mostExpensiveAppName(trafficInfos: TrafficInfo[]): string {
    let maxDownloadUsage = 0;
    let mostDownloadedName!: string;

    trafficInfos.map((info) => {
      const downloadUsage = this.parseDataFromFormat(info.download);

      if (downloadUsage >= maxDownloadUsage) {
        maxDownloadUsage = downloadUsage;
        mostDownloadedName = info.name;
      }
    });
    return mostDownloadedName;
  }

  sortMostExpensive(trafficInfos: TrafficInfo[]): TrafficInfo[] {
    const sortedTrafficInfos = [...trafficInfos].sort((a, b) => {
      const costA =
        this.parseDataFromFormat(a.download) *
        this.parseDataFromFormat(a.upload);
      const costB =
        this.parseDataFromFormat(b.download) *
        this.parseDataFromFormat(b.upload);

      return costB - costA; // Sort in descending order
    });
    return sortedTrafficInfos.slice(0, 5);
  }
}
