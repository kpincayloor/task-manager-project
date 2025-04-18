import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CreateUserDialogComponent } from './create-user-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('CreateUserDialogComponent', () => {
  let component: CreateUserDialogComponent;
  let fixture: ComponentFixture<CreateUserDialogComponent>;
  let dialogRefMock: { close: jest.Mock };

  beforeEach(async () => {
    dialogRefMock = { close: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [CreateUserDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: { email: 'test@example.com' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the email', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('test@example.com');
  });

  it('should close with "cancel" on onCancel()', () => {
    component.onCancel();
    expect(dialogRefMock.close).toHaveBeenCalledWith('cancel');
  });

  it('should close with "confirm" on onConfirm()', () => {
    component.onConfirm();
    expect(dialogRefMock.close).toHaveBeenCalledWith('confirm');
  });
});
