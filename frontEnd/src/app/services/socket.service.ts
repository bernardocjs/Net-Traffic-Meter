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
  private mostExpensiveApp: Subject<string> = new Subject<string>();
  private appRanking: Subject<TrafficInfo[]> = new Subject<TrafficInfo[]>();
  private key: Subject<string> = new Subject<string>();
  private plan: Subject<string> = new Subject<string>();
  private totalDownload: Subject<string> = new Subject<string>();

  public internetFromApp: number = 0;

  sizePlan!: number;

  public downloadFromApp: number = 0;

  private planAux!: string;

  public email!: string;
  public warningEmailSent = false;
  public endEmailSent = false;
  public planSize!: string;
  public sortKey!: string;

  getSortKey(): Observable<string> {
    return this.key.asObservable();
  }

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
    if (!this.warningEmailSent && percentage >= 80) {
      this.sendEmail('warning');
      this.warningEmailSent = true;
    } else if (!this.endEmailSent && percentage >= 100) {
      this.sendEmail('end');
      this.endEmailSent = true;
    }
    return percentage;
  }

  sendEmail(type: string) {
    let emailTry = {
      to: '',
      subject: '',
      text: '',
    };
    if (type === 'warning') {
      emailTry = {
        to: this.email,
        subject: 'Important: Exceeded Internet Data Usage Alert',
        text: "We wanted to notify you that your current Internet plan's data usage has nearly reached its limit. please checkout our platform",
      };
    } else {
      emailTry = {
        to: this.email,
        subject: 'Important: Data Max Usage Reached',
        text: "We wanted to notify you that your current Internet plan's data usage has reached reached its limit. please checkout our platform",
      };
    }

    const emailData = emailTry;
    console.log(this.email, emailTry);
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
    this.planAux = plan;
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
    this.plan.next(this.planAux);

    this.mostExpensiveApp.next(this.mostExpensiveAppName(data));
    this.trafficInfoSubject.next(this.sort(this.sortKey, data));
    this.key.next(this.sortKey);
  }

  sort(sortType: string, data: TrafficInfo[]): TrafficInfo[] {
    data.sort((a: TrafficInfo, b: TrafficInfo) => {
      if (sortType === 'name') {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      } else if (sortType === 'create_time') {
        if (a.create_time < b.create_time) return -1;
        if (a.create_time > b.create_time) return 1;
      } else if (sortType === 'last_time_update') {
        if (a.last_time_update < b.last_time_update) return 1;
        if (a.last_time_update > b.last_time_update) return -1;
      } else if (sortType === 'upload') {
        if (
          this.parseDataFromFormat(a.upload) <
          this.parseDataFromFormat(b.upload)
        )
          return 1;
        if (
          this.parseDataFromFormat(a.upload) >
          this.parseDataFromFormat(b.upload)
        )
          return -1;
      } else if (sortType === 'download') {
        if (
          this.parseDataFromFormat(a.download) <
          this.parseDataFromFormat(b.download)
        )
          return 1;
        if (
          this.parseDataFromFormat(a.download) >
          this.parseDataFromFormat(b.download)
        )
          return -1;
      } else if (sortType === 'upload_speed') {
        if (
          this.parseDataFromFormat(a.upload_speed) <
          this.parseDataFromFormat(b.upload_speed)
        )
          return 1;
        if (
          this.parseDataFromFormat(a.upload_speed) >
          this.parseDataFromFormat(b.upload_speed)
        )
          return -1;
      } else if (sortType === 'download_speed') {
        if (
          this.parseDataFromFormat(a.download_speed) <
          this.parseDataFromFormat(b.download_speed)
        )
          return 1;
        if (
          this.parseDataFromFormat(a.download_speed) >
          this.parseDataFromFormat(b.download_speed)
        )
          return -1;
      }
      return 0;
    });
    return data;
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
        this.parseDataFromFormat(a.download) +
        this.parseDataFromFormat(a.upload);
      const costB =
        this.parseDataFromFormat(b.download) +
        this.parseDataFromFormat(b.upload);

      return costB - costA; // Sort in descending order
    });
    console.log(sortedTrafficInfos.slice(0, 5));
    return sortedTrafficInfos.slice(0, 5);
  }
}
