import { TestBed } from '@angular/core/testing';

import { ParcourService } from './parcour.service';

describe('ParcourService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParcourService = TestBed.get(ParcourService);
    expect(service).toBeTruthy();
  });
});
