import {Component, OnInit} from '@angular/core';
import {DialogAuthService} from "../main/dialogs/dialog-auth/services/dialog-auth.service";
import {AuthService} from "@auth/auth.service";
import { HeaderComponent } from '../main/components/header/header.component';
import { MenuActionsComponent } from '../main/components/menu-actions/menu-actions.component';
import { MapComponent } from '../map/map.component';

@Component({
    selector: 'app-application',
    templateUrl: './application.component.html',
    styleUrls: ['./application.component.scss'],
    standalone: true,
    imports: [HeaderComponent, MenuActionsComponent, MapComponent]
})
export class ApplicationComponent implements OnInit{
    constructor(
        private dialogAuthService: DialogAuthService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        if (!this.authService.code) {
            this.dialogAuthService.open();
        }
    }
}
