import { Component, effect, signal } from '@angular/core';
import { LoadingService } from '../../core/services/loading.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent {
  visible = signal(false);

  constructor(private loadingService: LoadingService) {
    effect(
      () => {
        this.visible.set(this.loadingService.loading());
      },
      { allowSignalWrites: true },
    );
  }
}
