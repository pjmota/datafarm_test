import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FieldDetail, FieldService } from '../../services/field.service';

@Component({
  selector: 'app-dialog-feature',
  templateUrl: './dialog-feature.component.html',
  styleUrls: ['./dialog-feature.component.scss']
})
export class DialogFeatureComponent implements OnInit {

  fieldDetail: FieldDetail | undefined;
  isLoading = true;
  coordinatesString: string = '';

  constructor(
    public dialogRef: MatDialogRef<DialogFeatureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fieldService: FieldService
  ) {}

  ngOnInit(): void {
    if (this.data?.geometry?.coordinates) {
      this.coordinatesString = JSON.stringify(this.data.geometry.coordinates, null, 2);
    }

    if (this.data?.properties?.idField) {
      this.fieldService.getField(this.data.properties.idField).subscribe({
        next: (detail) => {
          this.fieldDetail = detail;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching field details', err);
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  close() {
    this.dialogRef.close();
  }
}
