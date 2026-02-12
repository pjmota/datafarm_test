import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from "@angular/material/dialog";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {MapComponent} from '@map/map.component';
import {ApplicationComponent} from './application/application.component';
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {MenuActionsComponent} from './main/components/menu-actions/menu-actions.component';
import {HeaderComponent} from './main/components/header/header.component';
import {DialogAuthComponent} from './main/dialogs/dialog-auth/dialog-auth.component';
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {ApplicationInterceptor} from "./core/application/interceptor/application.interceptor";
import { SubmissionComponent } from './main/submission/submission.component';
import { DialogFeatureComponent } from './main/dialogs/dialog-feature/dialog-feature.component';

@NgModule({
    declarations: [
        AppComponent,
        MapComponent,
        ApplicationComponent,
        MenuActionsComponent,
        HeaderComponent,
        DialogAuthComponent,
        SubmissionComponent,
        DialogFeatureComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatButtonModule,
        LeafletModule,
        MatIconModule,
        MatDialogModule,
        MatInputModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: ApplicationInterceptor,
        multi: true,
    },],
    bootstrap: [AppComponent]
})
export class AppModule {
}
