import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AnalysesResultsComponent } from './analyses-results.component';
import { TextAnalysesResult } from '../../models/text-analyses-result.model';
import { ParameterType } from '../../models/parameter-type.model';

describe('AnalysesResultsComponent', () => {
  let component: AnalysesResultsComponent;
  let fixture: ComponentFixture<AnalysesResultsComponent>;

  const mockResults: TextAnalysesResult[] = [
    {
      timestamp: '2025-09-19T10:30:00.000Z',
      originalText: 'hello world',
      parameterType: ParameterType.VOWELS,
      letterCounts: { 'e': 1, 'o': 2, 'a': 0 }
    },
    {
      timestamp: '2025-09-19T11:45:00.000Z',
      originalText: 'test text',
      parameterType: ParameterType.CONSONANTS,
      letterCounts: { 't': 4, 's': 1, 'x': 1 }
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysesResultsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AnalysesResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display no results message when results array is empty', () => {
    fixture.componentRef.setInput('results', []);
    fixture.detectChanges();

    const noResultsElement = fixture.debugElement.query(By.css('.no-results'));
    const resultsSection = fixture.debugElement.query(By.css('.results-section'));

    expect(noResultsElement).toBeTruthy();
    expect(resultsSection).toBeFalsy();
    expect(noResultsElement.nativeElement.textContent).toContain('No analysis results yet');
  });

  it('should display results section when results array has data', () => {
    fixture.componentRef.setInput('results', mockResults);
    fixture.detectChanges();

    const resultsSection = fixture.debugElement.query(By.css('.results-section'));
    const noResultsElement = fixture.debugElement.query(By.css('.no-results'));
    const resultCards = fixture.debugElement.queryAll(By.css('.result-card'));

    expect(resultsSection).toBeTruthy();
    expect(noResultsElement).toBeFalsy();
    expect(resultCards.length).toBe(2);
  });

  it('should format timestamp correctly', () => {
    const testTimestamp = '2025-09-19T10:30:00.000Z';
    const formatted = component.formatTimestamp(testTimestamp);
    const expectedDate = new Date(testTimestamp).toLocaleString();

    expect(formatted).toBe(expectedDate);
  });

  it('should filter letter counts correctly for vowels analysis', () => {
    fixture.componentRef.setInput('selectedAnalysisType', ParameterType.VOWELS);

    const letterCounts = { 'a': 2, 'e': 0, 'i': 1, 'o': 0 };
    const result = component.getLetterCounts(letterCounts);

    expect(result).toEqual([
      { letter: 'a', count: 2 },
      { letter: 'e', count: 0 },
      { letter: 'i', count: 1 },
      { letter: 'o', count: 0 }
    ]);
  });

  it('should filter letter counts correctly for consonants analysis', () => {
    fixture.componentRef.setInput('selectedAnalysisType', ParameterType.CONSONANTS);

    const letterCounts = { 't': 3, 'n': 0, 's': 2, 'm': 0 };
    const result = component.getLetterCounts(letterCounts);

    expect(result).toEqual([
      { letter: 't', count: 3 },
      { letter: 's', count: 2 }
    ]);
  });

  it('should display correct analysis numbering in reverse order', () => {
    fixture.componentRef.setInput('results', mockResults);
    fixture.detectChanges();

    const analysisHeaders = fixture.debugElement.queryAll(By.css('.result-header h3'));

    expect(analysisHeaders[0].nativeElement.textContent.trim()).toBe('Analysis #2');
    expect(analysisHeaders[1].nativeElement.textContent.trim()).toBe('Analysis #1');
  });

  it('should render letter count items correctly', () => {
    fixture.componentRef.setInput('results', [mockResults[0]]);
    fixture.componentRef.setInput('selectedAnalysisType', ParameterType.VOWELS);
    fixture.detectChanges();

    const countItems = fixture.debugElement.queryAll(By.css('.count-item'));
    const firstItem = countItems[0];
    const letterElement = firstItem.query(By.css('.letter'));
    const countElement = firstItem.query(By.css('.count'));

    expect(countItems.length).toBeGreaterThan(0);
    expect(letterElement).toBeTruthy();
    expect(countElement).toBeTruthy();
  });

  it('should display formatted timestamps in result headers', () => {
    fixture.componentRef.setInput('results', [mockResults[0]]);
    fixture.detectChanges();

    const timestampElement = fixture.debugElement.query(By.css('.timestamp'));
    const expectedTimestamp = new Date(mockResults[0].timestamp).toLocaleString();

    expect(timestampElement.nativeElement.textContent.trim()).toBe(expectedTimestamp);
  });

  it('should handle empty letter counts object', () => {
    const emptyLetterCounts = {};
    const result = component.getLetterCounts(emptyLetterCounts);

    expect(result).toEqual([]);
  });
});
