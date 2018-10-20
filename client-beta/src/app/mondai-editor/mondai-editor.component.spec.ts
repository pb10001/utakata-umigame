import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MondaiEditorComponent } from './mondai-editor.component';

describe('MondaiEditorComponent', () => {
  let component: MondaiEditorComponent;
  let fixture: ComponentFixture<MondaiEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MondaiEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MondaiEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
