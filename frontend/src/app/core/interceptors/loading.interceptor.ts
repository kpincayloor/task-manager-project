import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';

export const LoadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const loadingService = inject(LoadingService);

  loadingService.show();

  return next(req).pipe(finalize(() => loadingService.hide()));
};
