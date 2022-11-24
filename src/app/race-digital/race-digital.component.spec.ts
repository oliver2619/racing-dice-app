import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceDigitalComponent } from './race-digital.component';

describe('RaceDigitalComponent', () => {
  let component: RaceDigitalComponent;
  let fixture: ComponentFixture<RaceDigitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaceDigitalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaceDigitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
