import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MondaiComponent } from './mondai.component';

describe('MondaiComponent', () => {
  let component: MondaiComponent;
  let fixture: ComponentFixture<MondaiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MondaiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MondaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
