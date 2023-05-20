export interface TrafficInfo {
  name: string;
  create_time: string;
  last_time_update: string;
  upload: string;
  download: string;
  upload_speed: string;
  download_speed: string;
  protocol_traffic: ProtocolTraffic[];
  host_traffic: HostTraffic[];
}

export interface HostTraffic {
  host: string;
  download: string;
  upload: string;
}

export interface ProtocolTraffic {
  protocol: string;
  download: string;
  upload: string;
}
