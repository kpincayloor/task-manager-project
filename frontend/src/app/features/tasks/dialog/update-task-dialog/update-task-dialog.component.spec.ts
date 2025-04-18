import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateTaskDialogComponent } from './update-task-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../../../../core/interfaces/task/task.interface';

describe('UpdateTaskDialogComponent', () => {
  let component: UpdateTaskDialogComponent;
  let fixture: ComponentFixture<UpdateTaskDialogComponent>;
  let dialogRefMock: { close: jest.Mock };

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test description',
    completed: false,
    createdAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    dialogRefMock = { close: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [UpdateTaskDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: mockTask },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with task data', () => {
    expect(component.form.value).toEqual({
      title: mockTask.title,
      description: mockTask.description,
      completed: mockTask.completed,
    });
  });

  it('should call dialogRef.close with updated task when form is valid', () => {
    component.form.setValue({
      title: 'Updated Title',
      description: 'Updated description',
      completed: true,
    });

    component.update();

    expect(dialogRefMock.close).toHaveBeenCalledWith({
      ...mockTask,
      title: 'Updated Title',
      description: 'Updated description',
      completed: true,
    });
  });

  it('should not close dialog if form is invalid', () => {
    component.form.get('title')?.setValue('');
    component.update();

    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });

  it('should close the dialog without value on cancel()', () => {
    component.cancel();
    expect(dialogRefMock.close).toHaveBeenCalledWith();
  });
});
