import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  constructor() { }

  onClickNavbarItem(): void {
    const navbarToggle = document.querySelector('.navbar-toggler');
    if (navbarToggle && window.getComputedStyle(navbarToggle).display !== 'none') {
      navbarToggle.dispatchEvent(new Event('click'));
    }
  }

  isToggleOpen(): boolean {
    const navbarToggle = document.querySelector('.navbar-toggler');
    if(navbarToggle) {
      return navbarToggle.getAttribute('aria-expanded') === 'true';
    }
  }
}
