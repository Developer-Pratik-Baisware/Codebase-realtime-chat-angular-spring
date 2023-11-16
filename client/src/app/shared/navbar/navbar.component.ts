import { Component } from '@angular/core';
import {NavbarService} from "../../services/navbar.service";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  logoImagePath: string = "../assets/hola-logo.png"

  constructor(private navbarService: NavbarService) {
  }

  onClickNavItem(): void {
    this.navbarService.onClickNavbarItem();
  }
}
