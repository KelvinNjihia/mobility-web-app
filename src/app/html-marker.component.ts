import { DataService, Marker } from './services/data.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'html-marker',
  template: `
    <h3>{{ data.name }}</h3>
    <table>
      <thead>
        {{ data.description }}
      </thead>
      <tbody *ngFor="let d of data.schedule">
        {{ d }}
      </tbody>
    </table>
    `
})
export class HTMLMarkerComponent {
  @Input() data: Marker;
}
