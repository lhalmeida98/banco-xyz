import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpinnerComponent } from './spinner.component';
import { SpinnerService } from '../../services/spinner.service';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;
  let spinnerService: SpinnerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerComponent],
      providers: [SpinnerService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    spinnerService = TestBed.inject(SpinnerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display spinner when spinnerVisible$ is true', () => {
    spinnerService.spinnerVisible$.set(true);
    fixture.detectChanges();
    const spinnerElement = fixture.debugElement.query(By.css('.spinner-overlay'));
    expect(spinnerElement).toBeTruthy();
  });

  it('should hide spinner when spinnerVisible$ is false', () => {
    spinnerService.spinnerVisible$.set(false);
    fixture.detectChanges();
    const spinnerElement = fixture.debugElement.query(By.css('.spinner-overlay'));
    expect(spinnerElement).toBeFalsy();
  });
});
