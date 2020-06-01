import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTMLMarkerComponent } from './html-marker.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent, HTMLMarkerComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatButtonModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  entryComponents: [HTMLMarkerComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
