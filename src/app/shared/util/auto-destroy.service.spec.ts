/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AutoDestroyService } from './auto-destroy.service';

describe('Service: AutoDestroy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AutoDestroyService]
    });
  });

  it('should ...', inject([AutoDestroyService], (service: AutoDestroyService) => {
    expect(service).toBeTruthy();
  }));
});
