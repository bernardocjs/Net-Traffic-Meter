import { Component, Input, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { TrafficInfo } from '../interfaces/traffic-info';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
})
export class RankingComponent implements OnInit {
  constructor(private socket: SocketService) {}

  podium!: TrafficInfo[];

  ngOnInit(): void {
    this.socket.getRanking().subscribe((data: TrafficInfo[]) => {
      this.podium = data;
    });
  }
}
