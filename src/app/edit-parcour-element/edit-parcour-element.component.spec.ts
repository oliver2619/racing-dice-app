import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditParcourElementComponent } from './edit-parcour-element.component';

describe('EditParcourElementComponent', () => {
  let component: EditParcourElementComponent;
  let fixture: ComponentFixture<EditParcourElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditParcourElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditParcourElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
