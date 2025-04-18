import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./features/auth/pages/login/login-page/login-page.component').then(
        m => m.LoginPageComponent,
      ),
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./features/tasks/pages/task-list/task-list.component').then(m => m.TaskListComponent),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
