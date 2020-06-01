import { Component, OnInit, ComponentRef, ComponentFactoryResolver, Injector,} from '@angular/core';
import {Map, point, tileLayer, marker, Marker, polyline } from 'leaflet';
import { antPath } from 'leaflet-ant-path';
import { DataService } from './services/data.service';
import { HTMLMarkerComponent } from './html-marker.component';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-shadow.png';

interface MarkerMetaData {
  name: string;
  markerInstance: Marker;
  componentInstance: ComponentRef<HTMLMarkerComponent>;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Mobility Web App';
  map: Map;
  markers: MarkerMetaData[] = [];
  // Define simulation points
  p = antPath(
    [
      [38.733673, -9.144632],
      [38.766711, -9.097088],
    ],
    {
      delay: 1000,
      dashArray: [76, 20],
      color: '#FF0000',
      weight: 5,
      opacity: 1,
    }
  );
  p1 = antPath(
    [
      [38.736945, -9.133716],
      [38.769316, -9.097523],
    ],
    {
      delay: 1000,
      dashArray: [76, 20],
      color: '#0000FF',
      weight: 5,
      opacity: 1,
    }
  );

  // Sidebar Variables

  // define base ayers so we can reference them mutipe times
  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution:
      '@copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  });
  wMaps = tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution:
      '@copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  });

  // Optional task 2. View rail/metro line network
  railMetro = tileLayer(
    'https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png',
    {
      maxZoom: 19,
      detectRetina: true,
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://www.OpenRailwayMap.org">OpenRailwayMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    }
  );

  // path for Line 1 from Rua Castilho 1 to Av. Pacifico

  route1 = polyline([
    [38.727589, -9.155902],
    [38.72418, -9.152913],
    [38.721079, -9.150147],
    [38.726307, -9.149263],
    [38.728778, -9.147759],
    [38.731401, -9.146114],
    [38.733673, -9.144632],
    [38.766711, -9.097088],
  ]);

  // path for Line 1 from Restauradores to Av. Pacifico
  route2 = polyline([
    [38.71577, -9.141432],
    [38.719733, -9.145011],
    [38.726217, -9.147409],
    [38.727924, -9.145152],
    [38.73074, -9.143763],
    [38.733673, -9.144632],
    [38.766711, -9.097088],
  ]);

  // path for Line 1 from Cais Sodré  to Av. D. João II
  route3 = polyline([
    [38.705445, -9.146394],
    [38.706983, -9.141638],
    [38.711025, -9.136889],
    [38.71604, -9.135708],
    [38.722127, -9.13526],
    [38.725572, -9.134928],
    [38.729074, -9.134563],
    [38.736945, -9.133716],
    [38.769316, -9.097523],
  ]);

  // path for Line 1 from Av. D. João II to Cais Sodré
  route4 = polyline([
    [38.769316, -9.097523],
    [38.736941, -9.13399],
    [38.728778, -9.13478],
    [38.725576, -9.135088],
    [38.721945, -9.135458],
    [38.715018, -9.137462],
    [38.709001, -9.135323],
    [38.706961, -9.141766],
    [38.70634, -9.145187],
  ]);

  // Layers control object with the 1 base street layer and the 4 overlay layers
  layersControl = {
    baseLayers: {
      'Street Maps': this.streetMaps,
    },
    overlays: {
      'Rail/Metro': this.railMetro, // show or hide metro
      'Line 1 path': this.route1,
      'Line 2 path': this.route2,
      'Line 3 path': this.route3,
      'Line 4 path': this.route4,
    },
  };

  // Displayed layers
  options = {
    layers: [
      this.streetMaps,
      this.route1,
      this.route2,
      this.route3,
      this.route4,
    ],
    zoom: 14,
    // center: ([38.766711, -9.097088])
  };

  constructor(
    private dataService: DataService,
    private resolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  ngOnInit() {}

  // fitBounds funtion
  onMapReady(map: Map) {
    this.map = map;
    map.locate({ setView: true, maxZoom: 20 });
    map.fitBounds(this.route1.getBounds(), {
      padding: point(24, 24),
      maxZoom: 20,
      animate: true,
    });
    this.addMarkers();
  }

  // Dynamically add markers
  public addMarkers() {
    for (const entry of this.dataService.getMarkers()) {
      const factory = this.resolver.resolveComponentFactory(
        HTMLMarkerComponent
      );
      const component = factory.create(this.injector);
      component.instance.data = entry;
      component.changeDetectorRef.detectChanges();

      let m = marker(entry.position);
      const popupContent = component.location.nativeElement;

      m.bindPopup(popupContent).openPopup();
      m.addTo(this.map);
      this.markers.push({
        name: entry.name,
        markerInstance: m,
        componentInstance: component,
      });
    }
  }

  // Add simulations
  public simulate() {
    this.p.addTo(this.map);
    this.p1.addTo(this.map);
  }

  // Stop and clear simulations
  stopSimulate() {
    this.map.removeLayer(this.p);
    this.map.removeLayer(this.p1);
  }
}
