jest.mock('@angular/core', () => {
  const actual = jest.requireActual('@angular/core');
  return {
    ...actual,
    inject: jest.fn(),
  };
});

import { authGuard } from './auth.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';

describe('authGuard', () => {
  let routerMock: { navigate: jest.Mock };

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;

  beforeEach(() => {
    routerMock = {
      navigate: jest.fn(),
    };

    (inject as jest.Mock).mockReturnValue(routerMock);
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true if token exists in localStorage', () => {
    localStorage.setItem('token', 'mock-token');

    const result = authGuard(mockRoute, mockState);

    expect(result).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to root and return false if no token is present', () => {
    const result = authGuard(mockRoute, mockState);

    expect(result).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['']);
  });
});
