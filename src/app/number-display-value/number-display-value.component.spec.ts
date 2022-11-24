import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberDisplayValueComponent } from './number-display-value.component';

describe('NumberDisplayValueComponent', () => {
  let component: NumberDisplayValueComponent;
  let fixture: ComponentFixture<NumberDisplayValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumberDisplayValueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumberDisplayValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
