import {Component} from '@angular/core';
import {latLng, tileLayer} from "leaflet";
import {MapService} from "./map.service";
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    standalone: true,
    imports: [LeafletModule]
})
export class MapComponent {
    options = {
        layers: [
            tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                attribution: 'Google',
            }),
        ],
        zoom: 14,
        zoomControl: false,
        disableDefaultUI: true,
        formatNum: 8,
        center: latLng({
            lat: -13.063074702990018,
            lng: -55.75501098841532
        }),
    };

    constructor(
        private mapService: MapService) {
    }

    onMapReady(basemap: any) {
        this.mapService.map = basemap;
        this.mapService.insertDemoField()
    }
}
