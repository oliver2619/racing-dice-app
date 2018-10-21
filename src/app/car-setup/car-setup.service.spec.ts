import { TestBed, inject } from '@angular/core/testing';

import { CarSetupService } from './car-setup.service';

describe('CarSetupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CarSetupService]
    });
  });

  it('should be created', inject([CarSetupService], (service: CarSetupService) => {
    expect(service).toBeTruthy();
  }));
});
