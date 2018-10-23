import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyEditorComponent } from './lobby-editor.component';

describe('LobbyEditorComponent', () => {
  let component: LobbyEditorComponent;
  let fixture: ComponentFixture<LobbyEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobbyEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
