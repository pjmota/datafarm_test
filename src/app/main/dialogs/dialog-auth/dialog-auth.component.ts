import {Component} from '@angular/core';
import {MatDialogRef, MatDialogModule} from "@angular/material/dialog";
import {FormControl, Validators, ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "@auth/auth.service";
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-dialog-auth',
    templateUrl: './dialog-auth.component.html',
    styleUrls: ['./dialog-auth.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatDialogModule]
})
export class DialogAuthComponent {

    formControl = new FormControl('', [Validators.required]);

    constructor(
        public dialogRef: MatDialogRef<DialogAuthComponent>,
        private authService: AuthService,
    ) {
    }

    onSubmit() {
        if (!this.formControl.hasError('required')) {
            this.authService.setCode(this.formControl.value)
            this.dialogRef.close();
        }
    }
}
