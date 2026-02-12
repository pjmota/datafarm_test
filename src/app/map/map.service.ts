
import {Injectable, NgZone} from '@angular/core';
import {DemoFeature, MapData} from "./map.model";
import {Feature} from "geojson";
import * as L from 'leaflet';
import {PathOptions} from "leaflet";
import {MatDialog} from "@angular/material/dialog";
import {DialogFeatureComponent} from "../main/dialogs/dialog-feature/dialog-feature.component";

@Injectable({
    providedIn: 'root'
})
export class MapService {

    // @ts-ignore
    private _map: MapData;

    public activeField: string | undefined;

    private pointsLayerGroup: L.LayerGroup | undefined;
    private hoverButtonMarker: L.Marker | undefined;
    private visiblePointsFeatureId: string | undefined;
    private hoverTimeout: any;
    private lockedFeature: { id: string, layer: any, marker: L.Marker } | undefined;

    constructor(
        private dialog: MatDialog,
        private zone: NgZone
    ) {
    }

    public get map(): MapData {
        if (this._map == null) {throw 'map is undefined'}
        return this._map;
    }

    public set map(basemap: MapData) {
        this._map = basemap;
        this.pointsLayerGroup = L.layerGroup().addTo(this._map);
    }

    /**
     * The feature is a geometry with properties, this geometry can be polygons or points.
     */
    insertFeature(feature: Feature | Feature[], style?: PathOptions): void {

        if (!Array.isArray(feature)) {
            feature = [feature];
        }

        if (style == undefined) {
            style = {
                stroke: true,
                color: '#ffffff',
                opacity: 0,
                fillColor: '#000000',
                fillOpacity: 0}
        }

        L.geoJSON(feature, {
            style: style,
            onEachFeature: (feature, layer: any) => {
                layer.on({
                    mouseover: (e: any) => {
                        this.clearHoverTimeout();
                        
                        // If this feature is already locked, do not modify style or recreate button
                        if (this.lockedFeature && this.lockedFeature.id === feature.properties?.idField) {
                            return;
                        }

                        const layer = e.target;
                        layer.setStyle({
                            fillOpacity: 0.2,
                            opacity: 1
                        });
                        this.addHoverButton(feature, layer);
                    },
                    mouseout: (e: any) => {
                        const layer = e.target;
                        // Don't reset style immediately, wait for timeout
                        // layer.setStyle({
                        //    fillOpacity: 0,
                        //    opacity: 0
                        // });
                        this.startHoverTimeout(layer, feature); 
                    },
                    click: (e: any) => {
                        this.zone.run(() => {
                            this.dialog.open(DialogFeatureComponent, {
                                data: feature,
                                width: '400px'
                            });
                        });
                    }
                });
            }
        }).addTo(this._map)
    }

    insertDemoField() {
        this.insertFeature(DemoFeature);
        this.activeField = DemoFeature.properties?.['idField'];
    }

    private addHoverButton(feature: Feature, layer: L.Polygon) {
        if (this.hoverButtonMarker) {
            this.hoverButtonMarker.remove();
        }

        if (layer.getCenter) {
            const center = layer.getCenter();
            // Create a small circular button with an icon
            const btnIcon = L.divIcon({
                className: 'custom-hover-btn',
                html: `<div style="
                    background: transparent; 
                    width: 30px; 
                    height: 30px; 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    cursor: pointer;
                    pointer-events: auto;
                ">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 2px rgba(0,0,0,0.5));">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                </div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            this.hoverButtonMarker = L.marker(center, { icon: btnIcon }).addTo(this._map);

            // Bind tooltip for hover text
            this.hoverButtonMarker.bindTooltip("Ver/Ocultar Vértices", { 
                direction: 'top',
                offset: [0, -15],
                opacity: 0.9
            });

            // Prevent flicker by clearing timeout on marker hover
            this.hoverButtonMarker.on('mouseover', () => {
                this.clearHoverTimeout();
            });

            // Restart timeout when leaving marker
            this.hoverButtonMarker.on('mouseout', () => {
                this.startHoverTimeout(layer, feature);
            });

            this.hoverButtonMarker.on('click', (e) => {
                L.DomEvent.stopPropagation(e);
                this.togglePoints(feature, layer);
            });
            
        }
    }

    private clearHoverTimeout() {
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }
    }

    private startHoverTimeout(layer?: any, feature?: any) {
        this.clearHoverTimeout();
        this.hoverTimeout = setTimeout(() => {
            // Check if points are visible/locked for this feature
            if (this.lockedFeature && feature && this.lockedFeature.id === feature.properties?.idField) {
                // If points are visible, do NOT hide anything
                return;
            }

            if (layer) {
                layer.setStyle({
                    fillOpacity: 0,
                    opacity: 0
                });
            }
            this.removeHoverButton();
        }, 100); // Small delay to allow moving between polygon and button
    }

    private removeHoverButton() {
        if (this.hoverButtonMarker) {
            // Do not remove if it is the locked marker (shouldn't happen if logic is correct, but safe check)
            if (this.lockedFeature && this.hoverButtonMarker === this.lockedFeature.marker) {
                return;
            }
            this.hoverButtonMarker.remove();
            this.hoverButtonMarker = undefined;
        }
    }

    private togglePoints(feature: any, layer: any) {
        const featureId = feature.properties?.idField;

        // If toggling OFF the currently locked feature
        if (this.lockedFeature && this.lockedFeature.id === featureId) {
            this.pointsLayerGroup?.clearLayers();
            
            // We need to properly cleanup the locked state
            // The marker is currently in lockedFeature.marker.
            // Since we are turning off, we can let it be removed by normal hover logic or remove it now if we want strict toggle behavior.
            // But usually toggle OFF means "go back to normal hover state".
            // So we restore it to hoverButtonMarker so it behaves like a normal hover button.
            this.hoverButtonMarker = this.lockedFeature.marker;
            
            // Re-bind mouseout event to the marker so it can be removed properly
            const layerToReset = this.lockedFeature.layer; // Capture layer before resetting lockedFeature
            this.hoverButtonMarker.on('mouseout', () => {
                 this.startHoverTimeout(layerToReset, feature);
            });

            this.lockedFeature = undefined;
            this.visiblePointsFeatureId = undefined;
            
            // If the mouse is not over the button, we should trigger the removal logic immediately
            // But we don't know the mouse position here easily without an event.
            // However, since this is triggered by a CLICK, the mouse IS over the button.
            // So we just rely on the mouseout event we just re-bound.
            
            return;
        }

        // If switching from another locked feature
        if (this.lockedFeature) {
            // Clean up the old locked feature
            this.lockedFeature.marker.remove();
            this.lockedFeature.layer.setStyle({
                fillOpacity: 0,
                opacity: 0
            });
            this.pointsLayerGroup?.clearLayers();
            this.lockedFeature = undefined;
        }

        // Turning ON for new feature
        if (feature.geometry && feature.geometry.coordinates) {
            const coords = feature.geometry.coordinates[0]; // Assuming Polygon
            coords.forEach((coord: any) => {
                // GeoJSON is [lng, lat], Leaflet is [lat, lng]
                const latLng = L.latLng(coord[1], coord[0]);
                const marker = L.circleMarker(latLng, {
                    radius: 4,
                    fillColor: '#00ffff',
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).addTo(this.pointsLayerGroup!);

                marker.bindTooltip(`Lat: ${coord[1]}<br>Lng: ${coord[0]}`, {
                    direction: 'top',
                    opacity: 0.9
                });
            });
            
            this.visiblePointsFeatureId = featureId;

            // Lock the current feature state
            // We promote the current hover marker to be the locked marker
            if (this.hoverButtonMarker) {
                this.lockedFeature = {
                    id: featureId,
                    layer: layer,
                    marker: this.hoverButtonMarker
                };
                // Clear the hover reference so it doesn't get removed by other hover events
                this.hoverButtonMarker = undefined;
            }
        }
    }
}
