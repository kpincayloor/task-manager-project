jest.mock('@angular/core', () => {
  const actual = jest.requireActual('@angular/core');
  return {
    ...actual,
    inject: jest.fn(),
  };
});

import { LoadingInterceptor } from './loading.interceptor';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, lastValueFrom } from 'rxjs';

describe('LoadingInterceptor', () => {
  let loadingServiceMock: { show: jest.Mock; hide: jest.Mock };

  beforeEach(() => {
    loadingServiceMock = {
      show: jest.fn(),
      hide: jest.fn(),
    };

    (inject as jest.Mock).mockReturnValue(loadingServiceMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call show() before and hide() after request', async () => {
    const mockRequest = {} as HttpRequest<unknown>;
    const mockResponse = {} as HttpEvent<unknown>;

    const next: HttpHandlerFn = jest.fn().mockReturnValue(of(mockResponse));

    const result = await lastValueFrom(LoadingInterceptor(mockRequest, next));

    expect(result).toBe(mockResponse);
    expect(loadingServiceMock.show).toHaveBeenCalledTimes(1);
    expect(loadingServiceMock.hide).toHaveBeenCalledTimes(1);
  });
});
