import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarSetupComponent } from './car-setup.component';

describe('CarSetupComponent', () => {
  let component: CarSetupComponent;
  let fixture: ComponentFixture<CarSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarSetupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
