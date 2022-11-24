import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcourDigitalComponent } from './parcour-digital.component';

describe('ParcourDigitalComponent', () => {
  let component: ParcourDigitalComponent;
  let fixture: ComponentFixture<ParcourDigitalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParcourDigitalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcourDigitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
