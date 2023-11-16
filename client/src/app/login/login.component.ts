import { Component } from '@angular/core';
import {AuthenticationService} from "../services/auth/authentication.service";
import {
  RegistrationSuccessModalComponent
} from "../utils/registration-success-modal/registration-success-modal.component";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {LoginSuccessfulModalComponent} from "../utils/login-successful-modal/login-successful-modal.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  usernameOrEmail: string = "";
  password: string = "";

  // modal
  dialogConfig = new MatDialogConfig();
  modalDialog: MatDialogRef<RegistrationSuccessModalComponent, any> | undefined;

  //error handling
  isPresentHttpError : boolean = false;

  constructor(private authService: AuthenticationService, public matDialog: MatDialog) {
  }

  onSubmit() {
    this.authService.loginUser(this.usernameOrEmail, this.password).subscribe(
      (response) => {
        if(response.status === 200) {
          console.log('Registration successful');
          this.openModal();
        }
      },
      (error) => {
        this.isPresentHttpError = true;
      }
    )
  }

  // Registration successful modal
  openModal() {
    this.dialogConfig.id = "login-successful-modal";
    this.modalDialog = this.matDialog.open(LoginSuccessfulModalComponent, this.dialogConfig)
  }

  private setErrorMessage(value : boolean) {
    this.isPresentHttpError = value;
  }
}
