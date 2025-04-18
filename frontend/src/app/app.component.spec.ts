import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { LoadingComponent } from './features/loading/loading.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, LoadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render router-outlet and loading component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    // Validamos que exista <router-outlet>
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
    // Validamos que exista el selector del componente de loading
    expect(compiled.querySelector('app-loading')).toBeTruthy();
  });
});
