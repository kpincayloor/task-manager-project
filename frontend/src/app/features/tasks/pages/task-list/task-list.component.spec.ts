import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../../../core/services/task.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Task } from '../../../../core/interfaces/task/task.interface';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskService: jest.Mocked<TaskService>;
  let router: jest.Mocked<Router>;
  let dialog: jest.Mocked<MatDialog>;

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Desc 1',
      completed: false,
      createdAt: '2024-01-01T10:00:00Z',
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Desc 2',
      completed: true,
      createdAt: '2024-01-02T10:00:00Z',
    },
  ];

  beforeEach(async () => {
    taskService = {
      getTasks: jest.fn(),
      createTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
    } as unknown as jest.Mocked<TaskService>;

    router = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    dialog = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatDialog>;

    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
        { provide: TaskService, useValue: taskService },
        { provide: Router, useValue: router },
        { provide: MatDialog, useValue: dialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load and sort tasks on init', () => {
    taskService.getTasks.mockReturnValue(of(mockTasks));
    component.ngOnInit();
    expect(taskService.getTasks).toHaveBeenCalled();
    expect(component.tasks[0].id).toBe('2'); // más reciente primero
  });

  it('should submit a new task and reload tasks', () => {
    taskService.createTask.mockReturnValue(of(mockTasks[0]));
    taskService.getTasks.mockReturnValue(of(mockTasks));
    component.form.setValue({ title: 'New Task', description: 'New Desc' });

    component.submit();

    expect(taskService.createTask).toHaveBeenCalledWith({
      title: 'New Task',
      description: 'New Desc',
    });
    expect(component.form.value).toEqual({ title: null, description: null }); // reseteado
  });

  it('should not submit if form is invalid', () => {
    component.form.setValue({ title: '', description: '' });
    component.submit();
    expect(taskService.createTask).not.toHaveBeenCalled();
  });

  it('should toggle task completion and reload tasks', () => {
    taskService.updateTask.mockReturnValue(of(mockTasks[0]));
    taskService.getTasks.mockReturnValue(of(mockTasks));

    const task = { ...mockTasks[1], completed: false };
    component.toggleComplete(task);

    expect(taskService.updateTask).toHaveBeenCalledWith(task.id, { completed: true });
  });

  it('should delete task and reload tasks', () => {
    taskService.deleteTask.mockReturnValue(of(undefined));
    taskService.getTasks.mockReturnValue(of(mockTasks));

    component.deleteTask(mockTasks[0]);

    expect(taskService.deleteTask).toHaveBeenCalledWith(mockTasks[0].id);
  });

  it('should open update dialog and update task if confirmed', () => {
    const updatedTask = {
      ...mockTasks[0],
      title: 'Updated',
      description: 'Updated Desc',
      completed: true,
    };

    taskService.updateTask.mockReturnValue(of(updatedTask));
    taskService.getTasks.mockReturnValue(of(mockTasks));

    const afterClosed$ = of(updatedTask);
    dialog.open.mockReturnValue({ afterClosed: () => afterClosed$ } as any);

    component.openUpdateDialog(mockTasks[0]);

    expect(dialog.open).toHaveBeenCalled();
    expect(taskService.updateTask).toHaveBeenCalledWith(updatedTask.id, {
      title: updatedTask.title,
      description: updatedTask.description,
      completed: updatedTask.completed,
    });
  });

  it('should not update if dialog is cancelled', () => {
    dialog.open.mockReturnValue({ afterClosed: () => of(undefined) } as any);
    component.openUpdateDialog(mockTasks[0]);
    expect(taskService.updateTask).not.toHaveBeenCalled();
  });

  it('should logout and navigate to "/"', () => {
    localStorage.setItem('token', 'mock-token');
    component.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
