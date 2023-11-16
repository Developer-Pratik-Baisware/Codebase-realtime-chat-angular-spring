import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSuccessfulModalComponent } from './login-successful-modal.component';

describe('LoginSuccessfulModalComponent', () => {
  let component: LoginSuccessfulModalComponent;
  let fixture: ComponentFixture<LoginSuccessfulModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginSuccessfulModalComponent]
    });
    fixture = TestBed.createComponent(LoginSuccessfulModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
