import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { CenteredContentLayoutComponent } from './layouts/centered-content-layout/centered-content-layout.component';
import { RankingComponent } from './ranking/ranking.component';
import { PlanUsageComponent } from './plan-usage/plan-usage.component';

export enum Pages {
  Home = 'home',
  Ranking = 'ranking',
  PlanUsage = 'planUsage',
}

const routes: Routes = [
  {
    path: '',
    redirectTo: Pages.Home,
    pathMatch: 'full',
  },

  {
    path: '',
    component: DashboardLayoutComponent,
    //canActivate: [authGuard],
    children: [
      { path: Pages.Home, component: HomePageComponent },
      {
        path: Pages.Ranking,
        component: RankingComponent,
      },
      {
        path: Pages.PlanUsage,
        component: PlanUsageComponent,
      },
    ],
  },
  // {
  //   path: '',
  //   component: CenteredContentLayoutComponent,
  //   children: [
  //     { path: 'login', component: LoginComponent },
  //     { path: 'register', component: RegisterComponent },
  //   ],
  // },
  {
    path: Pages.Home,
    loadChildren: () =>
      import('./home-page/home-page.module').then((m) => m.HomePageModule),
  },
  {
    path: Pages.Ranking,
    loadChildren: () =>
      import('./ranking/ranking.module').then((m) => m.RankingModule),
  },
  {
    path: Pages.PlanUsage,
    loadChildren: () =>
      import('./plan-usage/plan-usage.module').then((m) => m.PlanUsageModule),
  },
  // {
  //   path: 'login',
  //   loadChildren: () =>
  //     import('./login/login.module').then((m) => m.LoginModule),
  // },
  // {
  //   path: 'register',
  //   loadChildren: () =>
  //     import('./register/register.module').then((m) => m.RegisterModule),
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
