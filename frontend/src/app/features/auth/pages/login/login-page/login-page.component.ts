import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { CreateUserDialogComponent } from '../../dialog/create-user-dialog/create-user-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { firebaseAuth } from '../../../../../core/config/firebase';
import { signInWithCustomToken } from 'firebase/auth';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    const email = this.loginForm.value.email.trim();

    this.authService.checkUser(email).subscribe({
      next: ({ token }) => {
        signInWithCustomToken(firebaseAuth, token)
          .then(userCredential => {
            return userCredential.user.getIdToken();
          })
          .then(idToken => {
            localStorage.setItem('token', idToken);
            this.router.navigate(['/tasks']);
          })
          .catch(error => {
            console.error('Error al autenticar con Firebase:', error.message);
          });
      },
      error: (err: Error) => {
        if (err.message === 'USER_NOT_FOUND') {
          const dialogRef = this.dialog.open(CreateUserDialogComponent, {
            data: { email },
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result === 'confirm') {
              this.authService.createUser(email).subscribe({
                next: ({ token }) => {
                  signInWithCustomToken(firebaseAuth, token)
                    .then(cred => cred.user.getIdToken())
                    .then(idToken => {
                      localStorage.setItem('token', idToken);
                      this.router.navigate(['/tasks']);
                    })
                    .catch(err => {
                      console.error('Error al autenticar después de crear usuario:', err.message);
                    });
                },
                error: createErr => {
                  console.error('Error al crear usuario:', createErr.message);
                },
              });
            }
          });
        } else {
          console.error('Error inesperado:', err.message);
        }
      },
    });
  }
}
