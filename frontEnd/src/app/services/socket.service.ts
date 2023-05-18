import { Injectable, OnInit } from '@angular/core';
import { io } from 'socket.io-client';
import { TrafficInfo } from '../interfaces/traffic-info';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor() {}

  private trafficInfoSubject: Subject<TrafficInfo[]> = new Subject<
    TrafficInfo[]
  >();
  private totalInternet: Subject<string> = new Subject<string>();
  public internetFromApp: number = 0;

  private totalDownload: Subject<string> = new Subject<string>();
  public downloadFromApp: number = 0;

  private mostExpensiveApp: Subject<string> = new Subject<string>();

  getTrafficInfo(): Observable<TrafficInfo[]> {
    return this.trafficInfoSubject.asObservable();
  }

  getInternetUsage(): Observable<string> {
    return this.totalInternet.asObservable();
  }

  getDownloadUsage(): Observable<string> {
    return this.totalDownload.asObservable();
  }

  getMostExpensiveApp(): Observable<string> {
    return this.mostExpensiveApp.asObservable();
  }

  deserializeInfo(data: TrafficInfo[]) {
    if (!data) return;
    this.internetSum(data);
    this.totalInternet.next(this.formatData(this.internetFromApp));
    this.internetFromApp = 0;

    this.downloadSum(data);
    this.totalDownload.next(this.formatData(this.downloadFromApp));
    this.downloadFromApp = 0;

    this.mostExpensiveApp.next(this.mostExpensiveAppName(data));
    this.trafficInfoSubject.next(data);
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
}
