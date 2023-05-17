import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { FormsModule } from '@angular/forms';
import { LayoutsModule } from './layouts/layouts.module';
import { SocketService } from './services/socket.service';

@NgModule({
  declarations: [AppComponent, HomePageComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, LayoutsModule],
  providers: [SocketService],
  bootstrap: [AppComponent],
})
export class AppModule {}
