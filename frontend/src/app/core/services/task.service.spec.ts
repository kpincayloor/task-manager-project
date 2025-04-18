import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Task } from '../interfaces/task/task.interface';
import { environment } from '../../../environments/environment';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  const mockToken = 'mock-token';
  const baseUrl = `${environment.apiUrl}/api/tasks`;

  beforeEach(() => {
    localStorage.setItem('token', mockToken);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all tasks', () => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Task 1',
        description: 'Desc 1',
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ];

    service.getTasks().subscribe(tasks => {
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(mockTasks);
  });

  it('should create a task', () => {
    const newTask = { title: 'New Task' };
    const createdTask: Task = {
      id: '123',
      title: 'New Task',
      description: 'New Task desc',
      completed: false,
      createdAt: new Date().toISOString(),
    };

    service.createTask(newTask).subscribe(task => {
      expect(task).toEqual(createdTask);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(createdTask);
  });

  it('should update a task', () => {
    const updates = { title: 'Updated Task' };
    const updatedTask: Task = {
      id: '123',
      title: 'Updated Task',
      description: 'Updated Task desc',
      completed: false,
      createdAt: new Date().toISOString(),
    };

    service.updateTask('123', updates).subscribe(task => {
      expect(task).toEqual(updatedTask);
    });

    const req = httpMock.expectOne(`${baseUrl}/123`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updates);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(updatedTask);
  });

  it('should delete a task', () => {
    service.deleteTask('123').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${baseUrl}/123`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(null);
  });
});
