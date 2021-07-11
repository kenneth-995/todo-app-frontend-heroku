import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCreateComponent } from './edit-create.component';

describe('EditCreateComponent', () => {
  let component: EditCreateComponent;
  let fixture: ComponentFixture<EditCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
