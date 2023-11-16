import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import {BreakpointObserver} from "@angular/cdk/layout";
import {NavbarService} from "../services/navbar.service";

declare var anime: any; // used for text animation

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('textWrapper', { static: false }) textWrapper!: ElementRef;

  logoImagePath: string = "../assets/hola-logo.png";
  maintext: string = "Hola! Come and Connect with Your Loved Ones!";
  isMobile: boolean;
  isTablet: boolean;

  constructor(private renderer: Renderer2,
              private breakpointObserver: BreakpointObserver,
              private navbarService: NavbarService) {}

  ngAfterViewInit(): void {
    const textWrapper = this.textWrapper.nativeElement;
    const words = textWrapper.textContent?.split(' ') || [];
    this.isMobile = this.breakpointObserver.isMatched('(max-width: 430px)')
    this.isTablet = this.breakpointObserver.isMatched('(max-width: 1025px) and (max-height: 1367px)')

    if (words.length > 0) {
      const timeline = anime.timeline({ loop: true });

      timeline
        .add({
          targets: '.c2 .line',
          scaleY: [0, 1],
          opacity: [0.5, 1],
          easing: "easeOutExpo",
          duration: 300
        })
        .add({
          targets: '.c2 .line',
          translateX: [0, this.isMobile ? this.getWordsWidth(words) + 50
            : this.isTablet ? this.getWordsWidth(words) + 670 : this.getWordsWidth(words) + 950],
          easing: "easeOutExpo",
          duration: 700,
          delay: 1000
        }).add({
        targets: '.c2 .word',
        opacity: [0, 1],
        easing: "easeOutExpo",
        duration: 3000,
        offset: '-=775',
        delay: (el: any, i: any) => 34 * (i+1)
      }).add({
        targets: '.c2',
        opacity: 0,
        duration: 3000,
        easing: "easeOutExpo",
        delay: 3000
      });
    }
  }

  private getWordsWidth(words: string[]): number {
    let totalWidth = 0;
    const hiddenText = this.renderer.createElement('span');
    this.renderer.setStyle(hiddenText, 'position', 'absolute');
    this.renderer.setStyle(hiddenText, 'visibility', 'hidden');
    this.renderer.setStyle(hiddenText, 'white-space', 'nowrap');
    this.renderer.appendChild(document.body, hiddenText);

    words.forEach(word => {
      const text = this.renderer.createText(word + ' ');
      this.renderer.appendChild(hiddenText, text);
      totalWidth += hiddenText.offsetWidth;
      this.renderer.removeChild(hiddenText, text);
    });

    this.renderer.removeChild(document.body, hiddenText);
    return totalWidth;
  }

  onClickMainButton = () =>  {
    if(this.navbarService.isToggleOpen())  {
      this.navbarService.onClickNavbarItem();
    }
  }
}
