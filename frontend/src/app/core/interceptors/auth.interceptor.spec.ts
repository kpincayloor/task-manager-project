jest.mock('@angular/core', () => {
  const actual = jest.requireActual('@angular/core');
  return {
    ...actual,
    inject: jest.fn(),
  };
});

import { AuthInterceptor } from './auth.interceptor';
import { HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError, of } from 'rxjs';

describe('AuthInterceptor', () => {
  let routerMock: { navigate: jest.Mock };

  beforeEach(() => {
    routerMock = { navigate: jest.fn() };
    (inject as jest.Mock).mockReturnValue(routerMock);
    localStorage.setItem('token', 'mock-token');
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should call next without modifying the request if no error occurs', done => {
    const mockRequest = {} as HttpRequest<unknown>;
    const mockNext: HttpHandlerFn = jest.fn().mockReturnValue(of({}) as unknown);

    AuthInterceptor(mockRequest, mockNext).subscribe({
      next: () => {
        expect(mockNext).toHaveBeenCalledWith(mockRequest);
        expect(routerMock.navigate).not.toHaveBeenCalled();
        expect(localStorage.getItem('token')).toBe('mock-token');
        done();
      },
    });
  });

  it('should handle 401 error: remove token and redirect', done => {
    const mockRequest = {} as HttpRequest<unknown>;
    const mockError = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });

    const mockNext: HttpHandlerFn = jest.fn().mockReturnValue(throwError(() => mockError));

    AuthInterceptor(mockRequest, mockNext).subscribe({
      error: error => {
        expect(mockNext).toHaveBeenCalledWith(mockRequest);
        expect(routerMock.navigate).toHaveBeenCalledWith(['/auth']);
        expect(localStorage.getItem('token')).toBeNull();
        expect(error.status).toBe(401);
        done();
      },
    });
  });

  it('should not redirect or remove token for non-401 errors', done => {
    const mockRequest = {} as HttpRequest<unknown>;
    const mockError = new HttpErrorResponse({ status: 403, statusText: 'Forbidden' });

    const mockNext: HttpHandlerFn = jest.fn().mockReturnValue(throwError(() => mockError));

    AuthInterceptor(mockRequest, mockNext).subscribe({
      error: error => {
        expect(routerMock.navigate).not.toHaveBeenCalled();
        expect(localStorage.getItem('token')).toBe('mock-token');
        expect(error.status).toBe(403);
        done();
      },
    });
  });
});
