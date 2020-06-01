import { Injectable } from '@angular/core';
import { LatLngExpression } from 'leaflet';
import * as data from './../../assets/StopsDetails.json';

export class Marker {
  id: number;
  name: string;
  description: string;
  schedule: any;
  position: LatLngExpression;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  markers: Marker[] = (data as any).default;

  getMarkers() {
    return this.markers;
  }

  constructor() { }
}
