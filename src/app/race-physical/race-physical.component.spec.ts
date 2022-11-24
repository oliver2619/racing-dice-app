import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RacePhysicalComponent } from './race-physical.component';

describe('RacePhysicalComponent', () => {
  let component: RacePhysicalComponent;
  let fixture: ComponentFixture<RacePhysicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RacePhysicalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RacePhysicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
