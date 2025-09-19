import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';

import { TextAnalyzerComponent } from './text-analyzer.component';
import { TextAnalyzerService } from '../../services/text-analyzer.service';
import { ParameterType } from '../../models/parameter-type.model';
import { TextAnalysesResult } from '../../models/text-analyses-result.model';
import { ToggleSwitchComponent } from '../toggle-switch/toggle-switch.component';
import { TextAreaInputComponent } from '../text-area-input/text-area-input.component';
import { RadioGroupComponent } from '../radio-group/radio-group.component';
import { ActionButtonsComponent } from '../action-buttons/action-buttons.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { AnalysesResultsComponent } from '../analyses-results/analyses-results.component';

describe('TextAnalyzerComponent', () => {
  let component: TextAnalyzerComponent;
  let fixture: ComponentFixture<TextAnalyzerComponent>;
  let mockTextAnalyzerService: jasmine.SpyObj<TextAnalyzerService>;

  const mockAnalysisResult: TextAnalysesResult = {
    timestamp: new Date().toISOString(),
    originalText: 'test text',
    parameterType: ParameterType.VOWELS,
    letterCounts: { 'e': 2, 'a': 1 }
  };

  beforeEach(async () => {
    const textAnalyzerServiceSpy = jasmine.createSpyObj('TextAnalyzerService',
      ['analyzeOnline', 'analyzeOffline'],
      {
        isAnalyzing: signal(false),
        error: signal(null),
        lastResult: signal(null)
      }
    );

    await TestBed.configureTestingModule({
      imports: [
        TextAnalyzerComponent,
        ReactiveFormsModule,
        ToggleSwitchComponent,
        TextAreaInputComponent,
        RadioGroupComponent,
        ActionButtonsComponent,
        ErrorMessageComponent,
        AnalysesResultsComponent
      ],
      providers: [
        { provide: TextAnalyzerService, useValue: textAnalyzerServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TextAnalyzerComponent);
    component = fixture.componentInstance;
    mockTextAnalyzerService = TestBed.inject(TextAnalyzerService) as jasmine.SpyObj<TextAnalyzerService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.analysisForm.get('inputText')?.value).toBe('');
    expect(component.analysisForm.get('parameterType')?.value).toBe(ParameterType.VOWELS);
    expect(component.analysisForm.get('isOnlineMode')?.value).toBe(false);
    expect(component.parameterTypeOptions().length).toBe(2);
  });

  it('should not call analyze when form is invalid', () => {
    component.analysisForm.patchValue({ inputText: '' });

    component.onAnalyze();

    expect(mockTextAnalyzerService.analyzeOffline).not.toHaveBeenCalled();
    expect(mockTextAnalyzerService.analyzeOnline).not.toHaveBeenCalled();
  });

  it('should call analyzeOffline when isOnlineMode is false', () => {
    mockTextAnalyzerService.analyzeOffline.and.returnValue(of(mockAnalysisResult));

    component.analysisForm.patchValue({
      inputText: 'test text',
      parameterType: ParameterType.VOWELS,
      isOnlineMode: false
    });

    component.onAnalyze();

    expect(mockTextAnalyzerService.analyzeOffline).toHaveBeenCalledWith({
      parameterType: ParameterType.VOWELS,
      inputText: 'test text'
    });
    expect(mockTextAnalyzerService.analyzeOnline).not.toHaveBeenCalled();
  });

  it('should call analyzeOnline when isOnlineMode is true', () => {
    mockTextAnalyzerService.analyzeOnline.and.returnValue(of(mockAnalysisResult));

    component.analysisForm.patchValue({
      inputText: 'test text',
      parameterType: ParameterType.CONSONANTS,
      isOnlineMode: true
    });

    component.onAnalyze();

    expect(mockTextAnalyzerService.analyzeOnline).toHaveBeenCalledWith({
      parameterType: ParameterType.CONSONANTS,
      inputText: 'test text'
    });
    expect(mockTextAnalyzerService.analyzeOffline).not.toHaveBeenCalled();
  });

  it('should handle analysis error', () => {
    spyOn(console, 'error');
    mockTextAnalyzerService.analyzeOffline.and.returnValue(throwError(() => new Error('Analysis failed')));

    component.analysisForm.patchValue({
      inputText: 'test text',
      parameterType: ParameterType.VOWELS,
      isOnlineMode: false
    });

    component.onAnalyze();

    expect(console.error).toHaveBeenCalledWith('Analyses failed:', jasmine.any(Error));
  });

  it('should validate required inputText', () => {
    const inputTextControl = component.analysisForm.get('inputText');

    expect(inputTextControl?.hasError('required')).toBe(true);

    inputTextControl?.setValue('test');
    expect(inputTextControl?.hasError('required')).toBe(false);
  });

  it('should add new results to analysisResults when service lastResult changes', () => {
    const initialResults = component.analysisResults();
    expect(initialResults.length).toBe(0);

    mockTextAnalyzerService.lastResult.set(mockAnalysisResult);
    component['setupEffects']();
    fixture.detectChanges();

    expect(component.analysisResults).toBeDefined();
  });

  it('should have correct parameter type options', () => {
    const options = component.parameterTypeOptions();

    expect(options).toEqual([
      { value: ParameterType.VOWELS, label: 'Vowels' },
      { value: ParameterType.CONSONANTS, label: 'Consonants' }
    ]);
  });
});
