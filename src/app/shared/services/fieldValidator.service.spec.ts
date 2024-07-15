/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FieldValidatorService } from './fieldValidator.service';

describe('Service: FieldValidator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FieldValidatorService]
    });
  });

  it('should ...', inject([FieldValidatorService], (service: FieldValidatorService) => {
    expect(service).toBeTruthy();
  }));
});
