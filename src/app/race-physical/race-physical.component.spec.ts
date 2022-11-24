import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RacePhysicalComponent } from './race-physical.component';

describe('RacePhysicalComponent', () => {
  let component: RacePhysicalComponent;
  let fixture: ComponentFixture<RacePhysicalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RacePhysicalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RacePhysicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
