import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from '../config.service';
import { TextAnalysesRequest } from '../../models/text-analyses-request.model';
import { TextAnalysesResult } from '../../models/text-analyses-result.model';
import { ParameterType } from '../../models/parameter-type.model';
import { TextAnalyzerRestApiService } from '../api/text-analyzer-api.service';

describe('TextAnalyzerRestApiService', () => {
  let service: TextAnalyzerRestApiService;
  let httpMock: HttpTestingController;
  let mockConfigService: jasmine.SpyObj<ConfigService>;

  const mockRequest: TextAnalysesRequest = {
    parameterType: ParameterType.VOWELS,
    inputText: 'hello world'
  };

  const mockResponse: TextAnalysesResult = {
    timestamp: '2025-09-19T10:30:00.000Z',
    originalText: 'hello world',
    parameterType: ParameterType.VOWELS,
    letterCounts: { 'e': 1, 'o': 2 }
  };

  beforeEach(() => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', [], {
      textAnalyzerBackendApi: 'http://localhost:8080/api'
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TextAnalyzerRestApiService,
        { provide: ConfigService, useValue: configServiceSpy }
      ]
    });

    service = TestBed.inject(TextAnalyzerRestApiService);
    httpMock = TestBed.inject(HttpTestingController);
    mockConfigService = TestBed.inject(ConfigService) as jasmine.SpyObj<ConfigService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should analyze text successfully', () => {
    service.analyzeText(mockRequest).subscribe(result => {
      expect(result).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/analyze');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });

  it('should handle analyze text error', () => {
    spyOn(console, 'error');
    const errorResponse = { status: 500, statusText: 'Internal Server Error' };

    service.analyzeText(mockRequest).subscribe({
      next: () => fail('Expected an error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(console.error).toHaveBeenCalledWith('error occurred', error);
      }
    });

    const req = httpMock.expectOne('http://localhost:8080/api/analyze');
    req.flush('Server Error', errorResponse);
  });

  it('should return true for successful health check', () => {
    service.healthCheck().subscribe(result => {
      expect(result).toBe(true);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/health');
    expect(req.request.method).toBe('GET');
    req.flush({ status: 'ok' });
  });

  it('should return false for unsuccessful health check status', () => {
    service.healthCheck().subscribe(result => {
      expect(result).toBe(false);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/health');
    req.flush({ status: 'error' });
  });

  it('should return false when health check fails with error', () => {
    service.healthCheck().subscribe(result => {
      expect(result).toBe(false);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/health');
    req.error(new ErrorEvent('Network error'));
  });

  it('should use correct API endpoints', () => {
    service.analyzeText(mockRequest).subscribe();
    service.healthCheck().subscribe();

    const analyzeReq = httpMock.expectOne('http://localhost:8080/api/analyze');
    const healthReq = httpMock.expectOne('http://localhost:8080/api/health');

    expect(analyzeReq.request.url).toBe('http://localhost:8080/api/analyze');
    expect(healthReq.request.url).toBe('http://localhost:8080/api/health');

    analyzeReq.flush(mockResponse);
    healthReq.flush({ status: 'ok' });
  });
});
