import {Component} from '@angular/core';
import {MapService} from '@map/map.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-menu-actions',
    templateUrl: './menu-actions.component.html',
    styleUrls: ['./menu-actions.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule]
})
export class MenuActionsComponent {

    constructor(private mapService: MapService) {
    }

    openDashboard() {
        console.log('Open Dashboard');
        console.log(`idField: ${this.mapService.activeField}`);
    }

    deleteField() {
        console.log('Delete Field');
        console.log(`idField: ${this.mapService.activeField}`);
    }
}
