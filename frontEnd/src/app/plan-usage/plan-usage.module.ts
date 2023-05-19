import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../services/socket.service';
import { PlanUsageComponent } from './plan-usage.component';

@NgModule({
  declarations: [PlanUsageComponent],
  imports: [CommonModule, FormsModule],
  providers: [SocketService],
})
export class PlanUsageModule {}
