import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-user-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './create-user-dialog.component.html',
  styleUrl: './create-user-dialog.component.scss',
})
export class CreateUserDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { email: string },
    private dialogRef: MatDialogRef<CreateUserDialogComponent>,
  ) {}

  onCancel() {
    this.dialogRef.close('cancel');
  }

  onConfirm() {
    this.dialogRef.close('confirm');
  }
}
