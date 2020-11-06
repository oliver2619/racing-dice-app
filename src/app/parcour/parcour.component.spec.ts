import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcourComponent } from './parcour.component';

describe('ParcourComponent', () => {
  let component: ParcourComponent;
  let fixture: ComponentFixture<ParcourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParcourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
