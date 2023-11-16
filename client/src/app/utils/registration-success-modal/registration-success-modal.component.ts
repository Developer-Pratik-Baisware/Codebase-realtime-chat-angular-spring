import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-registration-success-modal',
  templateUrl: './registration-success-modal.component.html',
  styleUrls: ['./registration-success-modal.component.scss']
})
export class RegistrationSuccessModalComponent {

  constructor(public dialogRef: MatDialogRef<RegistrationSuccessModalComponent>) {
  }

  closeModal() {
    this.dialogRef.close();
  }

}
