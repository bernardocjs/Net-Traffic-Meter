import { Component, OnInit } from '@angular/core';
import { io } from 'socket.io-client';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'frontEnd';
  constructor(private socketService: SocketService) {}
  ngOnInit() {
    // Connect to each port
    // Para utilizar o traffic_analyzer_v2.py com esse exemplo, remova os números 50001 e 50002 do array abaixo:
    const ports = [8000];
    ports.forEach((port) => {
      this.createSocketConnection(port);
    });
  }

  createSocketConnection(port: number) {
    const socket = io(`http://localhost:${port}`);

    socket.on('connect', () => {
      console.log(`Connected to localhost:${port}`);
      // You can send data through the socket here
      socket.emit('message', `Hello from port ${port}`);
    });

    socket.on('data', (data: any) => {
      // console.log(JSON.stringify(data, null, 2));
      this.socketService.deserializeInfo(data);
      // Handle received data
    });

    socket.on('protocolTraffic', (data: any) => {
      console.log('aloo2');
      console.log(JSON.stringify(data, null, 2));
      // Handle received data
    });

    socket.on('networkTraffic', (data: any) => {
      console.log(JSON.stringify(data, null, 2));
      // Handle received data
    });

    socket.on('disconnect', () => {
      console.log(`Connection closed on localhost:${port}`);
    });

    socket.on('error', (err: any) => {
      console.error(`Socket error on localhost:${port}:`, err);
    });
  }
}
