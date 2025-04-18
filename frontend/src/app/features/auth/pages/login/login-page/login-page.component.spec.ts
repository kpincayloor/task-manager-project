jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  signInWithCustomToken: jest.fn(() =>
    Promise.resolve({
      user: {
        getIdToken: jest.fn(() => Promise.resolve('mock-id-token')),
      },
    }),
  ),
}));

import { TestBed } from '@angular/core/testing';
import { LoginPageComponent } from './login-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserDialogComponent } from '../../dialog/create-user-dialog/create-user-dialog.component';
import { signInWithCustomToken } from 'firebase/auth';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let authService: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;
  let dialog: jest.Mocked<MatDialog>;

  const mockDialogRef = {
    afterClosed: jest.fn(),
  };

  beforeEach(async () => {
    authService = {
      checkUser: jest.fn(),
      createUser: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    router = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    dialog = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatDialog>;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        LoginPageComponent,
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: MatDialog, useValue: dialog },
      ],
    }).compileComponents();

    component = TestBed.inject(LoginPageComponent);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')).not.toBeNull();
  });

  it('should login and redirect if user exists', async () => {
    authService.checkUser.mockReturnValue(
      of({
        token: 'mock-token',
        user: {
          id: 'user-123',
          email: 'test@example.com',
          uid: 'uid123',
          createdAt: new Date().toISOString(),
        },
      }),
    );

    component.loginForm.setValue({ email: 'test@example.com' });
    await component.onSubmit();

    expect(authService.checkUser).toHaveBeenCalledWith('test@example.com');
    expect(signInWithCustomToken).toHaveBeenCalledWith(expect.anything(), 'mock-token');
    expect(localStorage.getItem('token')).toBe('mock-id-token');
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should open dialog and create user if not found', async () => {
    authService.checkUser.mockReturnValue(throwError(() => new Error('USER_NOT_FOUND')));
    authService.createUser.mockReturnValue(
      of({
        token: 'new-token',
        user: {
          id: 'user-456',
          email: 'new@example.com',
          uid: 'uid456',
          createdAt: new Date().toISOString(),
        },
      }),
    );
    mockDialogRef.afterClosed.mockReturnValue(of('confirm'));
    dialog.open.mockReturnValue(mockDialogRef as any);

    component.loginForm.setValue({ email: 'new@example.com' });
    await component.onSubmit();

    expect(dialog.open).toHaveBeenCalledWith(CreateUserDialogComponent, {
      data: { email: 'new@example.com' },
    });

    expect(authService.createUser).toHaveBeenCalledWith('new@example.com');
    expect(signInWithCustomToken).toHaveBeenCalledWith(expect.anything(), 'new-token');
    expect(localStorage.getItem('token')).toBe('mock-id-token');
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should log unexpected error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    authService.checkUser.mockReturnValue(throwError(() => new Error('OTHER_ERROR')));

    component.loginForm.setValue({ email: 'fail@example.com' });
    await component.onSubmit();

    expect(consoleSpy).toHaveBeenCalledWith('Error inesperado:', 'OTHER_ERROR');
    consoleSpy.mockRestore();
  });
});
