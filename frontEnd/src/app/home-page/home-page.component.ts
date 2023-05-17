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

  ngOnInit(): void {
    this.socket.getTrafficInfo().subscribe((data: TrafficInfo[]) => {
      this.trafficData = data;
    });
  }
}
