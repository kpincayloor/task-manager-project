import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should check user and return LoginResponse', () => {
    const email = 'test@example.com';
    const mockResponse = {
      token: 'fake-token',
      user: { id: '123', email: 'test@example.com', createdAt: new Date().toISOString() },
    };

    service.checkUser(email).subscribe(res => {
      expect(res.token).toEqual('fake-token');
      expect(res.user.email).toEqual(email);
    });

    const req = httpMock.expectOne(`${apiUrl}/users?email=${encodeURIComponent(email)}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle user not found error', () => {
    const email = 'missing@example.com';

    service.checkUser(email).subscribe({
      next: () => fail('Expected error'),
      error: (err: Error) => {
        expect(err.message).toBe('USER_NOT_FOUND');
      },
    });

    const req = httpMock.expectOne(`${apiUrl}/users?email=${encodeURIComponent(email)}`);
    req.flush({ message: 'User not found' }, { status: 404, statusText: 'Not Found' });
  });

  it('should create user and then check user', () => {
    const email = 'newuser@example.com';

    const mockCreateUserResponse = {
      id: 'abc123',
      email,
      createdAt: new Date().toISOString(),
    };

    const mockLoginResponse = {
      token: 'new-token',
      user: { id: 'abc123', email, createdAt: new Date().toISOString() },
    };

    service.createUser(email).subscribe(res => {
      expect(res.token).toBe('new-token');
      expect(res.user.email).toBe(email);
    });

    // First call - POST to create user
    const createReq = httpMock.expectOne(`${apiUrl}/users`);
    expect(createReq.request.method).toBe('POST');
    expect(createReq.request.body).toEqual({ email });
    createReq.flush(mockCreateUserResponse);

    // Second call - GET to check user
    const checkReq = httpMock.expectOne(`${apiUrl}/users?email=${encodeURIComponent(email)}`);
    expect(checkReq.request.method).toBe('GET');
    checkReq.flush(mockLoginResponse);
  });

  it('should handle error when creating user', () => {
    const email = 'fail@example.com';

    service.createUser(email).subscribe({
      next: () => fail('Expected error'),
      error: (err: Error) => {
        expect(err.message).toBe('Failed to create');
      },
    });

    const req = httpMock.expectOne(`${apiUrl}/users`);
    req.flush({ message: 'Failed to create' }, { status: 500, statusText: 'Server Error' });
  });
});
