import { TestBed } from '@angular/core/testing';
import { SpinnerComponent } from '../ui/spinner/spinner.component';
import { SpinnerService } from './spinner.service';

describe('SpinnerService', () => {
  let service: SpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show spinner', () => {
    service.show();
    expect(service.spinnerVisible$()).toBeTrue();
  });

  it('should hide spinner', () => {
    service.hide();
    expect(service.spinnerVisible$()).toBeFalse();
  });

  it('should set spinnerVisible$ to true when show is called', () => {
    service.show();
    expect(service.spinnerVisible$()).toBe(true);
  });

  it('should set spinnerVisible$ to false when hide is called', () => {
    service.hide();
    expect(service.spinnerVisible$()).toBe(false);
  });
});
