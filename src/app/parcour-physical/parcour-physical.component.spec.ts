import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcourPhysicalComponent } from './parcour-physical.component';

describe('ParcourPhysicalComponent', () => {
  let component: ParcourPhysicalComponent;
  let fixture: ComponentFixture<ParcourPhysicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParcourPhysicalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcourPhysicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
