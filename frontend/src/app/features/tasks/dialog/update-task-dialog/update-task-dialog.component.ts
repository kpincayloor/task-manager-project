import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Task } from '../../../../core/interfaces/task/task.interface';

@Component({
  selector: 'app-update-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  templateUrl: './update-task-dialog.component.html',
  styleUrl: './update-task-dialog.component.scss',
})
export class UpdateTaskDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task,
  ) {
    this.form = this.fb.group({
      title: [data.title, [Validators.required, Validators.minLength(2)]],
      description: [data.description],
      completed: [data.completed],
    });
  }

  update(): void {
    if (this.form.valid) {
      const updatedTask: Task = {
        ...this.data,
        ...this.form.value,
      };
      this.dialogRef.close(updatedTask);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
