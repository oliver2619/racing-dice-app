import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcourCanvasComponent } from './parcour-canvas.component';

describe('ParcourCanvasComponent', () => {
  let component: ParcourCanvasComponent;
  let fixture: ComponentFixture<ParcourCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParcourCanvasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcourCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
