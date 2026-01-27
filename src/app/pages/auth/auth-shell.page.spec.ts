import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthShellPage } from './auth-shell.page';

describe('AuthShellPage', () => {
  let component: AuthShellPage;
  let fixture: ComponentFixture<AuthShellPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthShellPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
