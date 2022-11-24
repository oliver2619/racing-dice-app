import { TestBed } from '@angular/core/testing';

import { CarSetupService } from './car-setup.service';

describe('CarSetupService', () => {
  let service: CarSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarSetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
