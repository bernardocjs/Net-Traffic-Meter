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
  private totalDownload: Subject<number> = new Subject<number>();
  public downloadFromApplication: number = 0;
  public downloadUsage: number = 0;

  getTrafficInfo(): Observable<TrafficInfo[]> {
    return this.trafficInfoSubject.asObservable();
  }

  parseDownloadUsage(download: string): number {
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

  getDownloadUsage(data: any): number {
    if (!data) return 0;

    const download = data.map((info: any) => {
      this.downloadFromApplication += this.parseDownloadUsage(info.download);

      return this.parseDownloadUsage(info.download);
    });
    return download;
  }

  formatDownloadSize(sizeInBytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = sizeInBytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return size.toFixed(2) + units[unitIndex];
  }

  deserializeInfo(data: any) {
    if (!data) return;
    this.totalDownload.next(this.getDownloadUsage(data));
    console.log(this.downloadFromApplication);
    console.log(this.formatDownloadSize(this.downloadFromApplication));
    this.downloadFromApplication = 0;
    this.trafficInfoSubject.next(data);
  }
}
