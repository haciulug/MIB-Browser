import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrapDialogComponent } from './trap-dialog.component';

describe('TrapDialogComponent', () => {
  let component: TrapDialogComponent;
  let fixture: ComponentFixture<TrapDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrapDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrapDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
