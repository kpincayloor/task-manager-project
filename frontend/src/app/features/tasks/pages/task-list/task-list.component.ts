import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../../core/services/task.service';
import { Task } from '../../../../core/interfaces/task/task.interface';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UpdateTaskDialogComponent } from '../../dialog/update-task-dialog/update-task-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: data => {
        this.tasks = data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      },
      error: err => console.error(err),
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.taskService.createTask(this.form.value).subscribe({
      next: () => {
        this.form.reset();
        this.loadTasks();
      },
    });
  }

  toggleComplete(task: Task) {
    this.taskService.updateTask(task.id, { completed: !task.completed }).subscribe(() => {
      this.loadTasks();
    });
  }

  deleteTask(task: Task) {
    this.taskService.deleteTask(task.id).subscribe(() => {
      this.loadTasks();
    });
  }

  openUpdateDialog(task: Task) {
    const dialogRef = this.dialog.open(UpdateTaskDialogComponent, {
      width: '400px',
      data: task,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService
          .updateTask(result.id, {
            title: result.title,
            description: result.description,
            completed: result.completed,
          })
          .subscribe(() => {
            this.loadTasks();
          });
      }
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
