import { Injectable, OnInit } from '@angular/core';
import { io } from 'socket.io-client';
import { TrafficInfo } from '../interfaces/traffic-info';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService implements OnInit {
  constructor() {}

  private trafficInfoSubject: Subject<TrafficInfo[]> = new Subject<
    TrafficInfo[]
  >();

  getTrafficInfo(): Observable<TrafficInfo[]> {
    return this.trafficInfoSubject.asObservable();
  }

  ngOnInit() {
    // Connect to each port
    // Para utilizar o traffic_analyzer_v2.py com esse exemplo, remova os números 50001 e 50002 do array abaixo:
    // const ports = [8000];
    // ports.forEach((port) => {
    //   this.createSocketConnection(port);
    // });
  }

  deserializeInfo(data: any) {
    if (!data) return;
    this.trafficInfoSubject.next(data);
  }

  // createSocketConnection(port: number) {
  //   const socket = io(`http://localhost:${port}`);

  //   socket.on('connect', () => {
  //     console.log(`Connected to localhost:${port}`);
  //     // You can send data through the socket here
  //     socket.emit('message', `Hello from port ${port}`);
  //   });

  //   socket.on('data', (data: any) => {
  //     console.log(JSON.stringify(data, null, 2));
  //     // Handle received data
  //   });

  //   socket.on('hostnameTraffic', (data: any) => {
  //     console.log(JSON.stringify(data, null, 2));
  //     // Handle received data
  //   });

  //   socket.on('protocolTraffic', (data: any) => {
  //     console.log('aloo2');
  //     console.log(JSON.stringify(data, null, 2));
  //     // Handle received data
  //   });

  //   socket.on('networkTraffic', (data: any) => {
  //     console.log(JSON.stringify(data, null, 2));
  //     // Handle received data
  //   });

  //   socket.on('disconnect', () => {
  //     console.log(`Connection closed on localhost:${port}`);
  //   });

  //   socket.on('error', (err: any) => {
  //     console.error(`Socket error on localhost:${port}:`, err);
  //   });
  // }
}
