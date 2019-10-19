import { TestBed, async, inject } from '@angular/core/testing';

import { CanActivateCarSetupGuard } from './can-activate-car-setup.guard';

describe('CanActivateCarSetupGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActivateCarSetupGuard]
    });
  });

  it('should ...', inject([CanActivateCarSetupGuard], (guard: CanActivateCarSetupGuard) => {
    expect(guard).toBeTruthy();
  }));
});
