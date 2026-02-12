import {Component, OnInit} from '@angular/core';
import {DialogAuthService} from "../main/dialogs/dialog-auth/services/dialog-auth.service";
import {AuthService} from "@auth/auth.service";

@Component({
    selector: 'app-application',
    templateUrl: './application.component.html',
    styleUrls: ['./application.component.scss']
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
