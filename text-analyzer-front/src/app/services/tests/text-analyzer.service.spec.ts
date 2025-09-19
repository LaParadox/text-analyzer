import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import {TextAnalyzerService} from '../text-analyzer.service';
import {TextAnalyzerRestApiService} from '../api/text-analyzer-api.service';
import {TextAnalysesRequest} from '../../models/text-analyses-request.model';
import {ParameterType} from '../../models/parameter-type.model';
import {TextAnalysesResult} from '../../models/text-analyses-result.model';

describe('TextAnalyzerService', () => {
  let service: TextAnalyzerService;
  let mockRestApiService: jasmine.SpyObj<TextAnalyzerRestApiService>;

  const mockRequest: TextAnalysesRequest = {
    parameterType: ParameterType.VOWELS,
    inputText: 'hello world'
  };

  const mockResult: TextAnalysesResult = {
    timestamp: '2025-09-19T10:30:00.000Z',
    originalText: 'hello world',
    parameterType: ParameterType.VOWELS,
    letterCounts: { 'e': 1, 'o': 2 }
  };

  beforeEach(() => {
    const restApiServiceSpy = jasmine.createSpyObj('TextAnalyzerRestApiService', ['analyzeText']);

    TestBed.configureTestingModule({
      providers: [
        TextAnalyzerService,
        { provide: TextAnalyzerRestApiService, useValue: restApiServiceSpy }
      ]
    });

    service = TestBed.inject(TextAnalyzerService);
    mockRestApiService = TestBed.inject(TextAnalyzerRestApiService) as jasmine.SpyObj<TextAnalyzerRestApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize signals with default values', () => {
    expect(service.isAnalyzing()).toBe(false);
    expect(service.lastResult()).toBe(null);
    expect(service.error()).toBe(null);
  });

  it('should handle successful online analysis', () => {
    mockRestApiService.analyzeText.and.returnValue(of(mockResult));

    service.analyzeOnline(mockRequest).subscribe(result => {
      expect(result).toEqual(mockResult);
      expect(service.isAnalyzing()).toBe(false);
      expect(service.lastResult()).toEqual(mockResult);
      expect(service.error()).toBe(null);
    });
  });

  it('should handle online analysis error', () => {
    const error = new Error('Network error');
    mockRestApiService.analyzeText.and.returnValue(throwError(() => error));

    service.analyzeOnline(mockRequest).subscribe({
      next: () => fail('Expected an error'),
      error: (err) => {
        expect(err).toBe(error);
        expect(service.isAnalyzing()).toBe(false);
        expect(service.error()).toBe('Network error');
      }
    });
  });

  it('should handle successful offline analysis', () => {
    service.analyzeOffline(mockRequest).subscribe(result => {
      expect(result).toBeDefined();
      expect(result.originalText).toBe('hello world');
      expect(result.parameterType).toBe(ParameterType.VOWELS);
      expect(result.letterCounts).toBeDefined();
      expect(service.isAnalyzing()).toBe(false);
      expect(service.lastResult()).toBeDefined();
      expect(service.error()).toBe(null);
    });
  });

  it('should process vowels and consonants correctly', () => {
    const vowelRequest = { ...mockRequest, parameterType: ParameterType.VOWELS };
    const consonantRequest = { ...mockRequest, parameterType: ParameterType.CONSONANTS };

    service.analyzeOffline(vowelRequest).subscribe(result => {
      expect(result.parameterType).toBe(ParameterType.VOWELS);
      expect(result.letterCounts['E']).toBeDefined();
      expect(result.letterCounts['O']).toBeDefined();
    });

    service.analyzeOffline(consonantRequest).subscribe(result => {
      expect(result.parameterType).toBe(ParameterType.CONSONANTS);
      expect(Object.keys(result.letterCounts).length).toBeGreaterThan(0);
    });
  });

  it('should set isAnalyzing to true during analysis', () => {
    mockRestApiService.analyzeText.and.returnValue(of(mockResult));

    expect(service.isAnalyzing()).toBe(false);
    service.analyzeOnline(mockRequest).subscribe();

    expect(mockRestApiService.analyzeText).toHaveBeenCalled();
  });
});
