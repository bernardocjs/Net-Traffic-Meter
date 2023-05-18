import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { TrafficInfo } from '../interfaces/traffic-info';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  constructor(private socket: SocketService) {}
  trafficData!: TrafficInfo[];
  internetUsed!: string;
  downloadUsage!: string;
  mostExpensiveApp!: string;

  ngOnInit(): void {
    this.socket.getTrafficInfo().subscribe((data: TrafficInfo[]) => {
      this.trafficData = data;
    });
    this.socket.getInternetUsage().subscribe((data: string) => {
      this.internetUsed = data;
    });
    this.socket.getDownloadUsage().subscribe((data: string) => {
      this.downloadUsage = data;
    });
    this.socket.getMostExpensiveApp().subscribe((data: string) => {
      this.mostExpensiveApp = data;
    });
  }
}
