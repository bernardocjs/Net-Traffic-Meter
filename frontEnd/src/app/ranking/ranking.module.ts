import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingComponent } from './ranking.component';
import { RankCardComponent } from './rank-card/rank-card.component';
import { SocketService } from '../services/socket.service';

@NgModule({
  declarations: [RankingComponent, RankCardComponent],
  imports: [CommonModule],
  providers: [SocketService],
})
export class RankingModule {}
