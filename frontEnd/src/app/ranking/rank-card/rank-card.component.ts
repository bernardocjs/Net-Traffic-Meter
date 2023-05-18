import { Component, Input, OnInit } from '@angular/core';
import { TrafficInfo } from 'src/app/interfaces/traffic-info';

@Component({
  selector: 'app-rank-card',
  templateUrl: './rank-card.component.html',
  styleUrls: ['./rank-card.component.scss'],
})
export class RankCardComponent {
  @Input()
  ranking!: number;

  @Input()
  app!: TrafficInfo;
}
