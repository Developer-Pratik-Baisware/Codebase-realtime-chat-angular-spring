import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-login-successful-modal',
  templateUrl: './login-successful-modal.component.html',
  styleUrls: ['./login-successful-modal.component.scss']
})
export class LoginSuccessfulModalComponent {

  constructor(public dialogRef: MatDialogRef<LoginSuccessfulModalComponent>) {
  }

  closeModal() {
    this.dialogRef.close();
  }
}
