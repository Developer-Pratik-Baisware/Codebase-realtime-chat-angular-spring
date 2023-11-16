import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { NgModel, Validators} from "@angular/forms";
import { AuthenticationService } from "../services/auth/authentication.service";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {
  RegistrationSuccessModalComponent
} from "../utils/registration-success-modal/registration-success-modal.component";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  logoImagePath: string = "../assets/hola-logo.png"

  username: string = "";
  email: string = "";
  password: string = "";
  form: any;
  hasSpace: boolean = false;
  // modal
  dialogConfig = new MatDialogConfig();
  modalDialog: MatDialogRef<RegistrationSuccessModalComponent, any> | undefined;
  //error handling
  errorMessage : string = "";

  constructor(private authService: AuthenticationService,
              public matDialog: MatDialog) {
  }

  onSubmit() {
    this.authService.registerUser(this.username, this.email, this.password).subscribe(
      (response) => {
        if(response.status === 200) {
          console.log('Registration successful');
          this.openModal();
        }
      },
      (error) => {
        if(error.error && error.error.errorMessage) {
          const errorMessage = error.error.errorMessage; // Extract the error message
          this.setErrorMessage(errorMessage);
        }
      }
    );
  }

  checkForSpace(text: string) {
    this.hasSpace = text.indexOf(' ') !== -1;
  }

  // Registration successful modal
  openModal() {
    this.dialogConfig.id = "registration-success-modal";
    this.modalDialog = this.matDialog.open(RegistrationSuccessModalComponent, this.dialogConfig)
  }

  private setErrorMessage(value : string) {
    this.errorMessage = value;
  }
}
