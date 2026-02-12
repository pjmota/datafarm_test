import {Component} from '@angular/core';
import {FormControl, Validators, ReactiveFormsModule} from "@angular/forms";
import {SubmissionService} from "./submission.service";
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-submission',
    templateUrl: './submission.component.html',
    styleUrls: ['./submission.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule]
})
export class SubmissionComponent {

    file: File | undefined;
    messageSubmit: string | undefined;
    formControl = new FormControl('', [Validators.required]);

    constructor(private submissionService: SubmissionService) {
    }

    onChangeFile(event: any) {
        this.file = event.target.files[0];
    }

    onSubmit() {
        if (!this.formControl.hasError('required')) {
            const code = this.formControl.value || '';
            if (this.file) {
                this.submissionService.submit(code, this.file)
                    .subscribe((response) => this.messageSubmit = response.message)
            }
        }
    }

    selectedFile(): boolean {
        return !!this.file;
    }

}
