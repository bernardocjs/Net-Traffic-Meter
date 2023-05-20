import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CenteredContentLayoutComponent } from './centered-content-layout/centered-content-layout.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CenteredContentLayoutComponent, DashboardLayoutComponent],
  imports: [CommonModule, RouterModule.forChild([])],
  exports: [CenteredContentLayoutComponent, DashboardLayoutComponent],
})
export class LayoutsModule {}
