import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingComponent } from './ranking.component';
import { RankCardComponent } from './rank-card/rank-card.component';



@NgModule({
  declarations: [
    RankingComponent,
    RankCardComponent
  ],
  imports: [
    CommonModule
  ]
})
export class RankingModule { }
