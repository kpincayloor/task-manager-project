import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    service = new LoadingService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially be false', () => {
    expect(service.loading()).toBe(false);
  });

  it('should set loading to true when show is called', () => {
    service.show();
    expect(service.loading()).toBe(true);
  });

  it('should set loading to false when hide is called', () => {
    service.show();
    service.hide();
    expect(service.loading()).toBe(false);
  });
});
