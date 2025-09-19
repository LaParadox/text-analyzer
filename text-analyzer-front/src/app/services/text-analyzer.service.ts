import {inject, Injectable, signal} from '@angular/core';
import {TextAnalyzerRestApiService} from './api/text-analyzer-api.service';
import {TextAnalysesResult} from '../models/text-analyses-result.model';
import {TextAnalysesRequest} from '../models/text-analyses-request.model';
import {map, Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ParameterType} from '../models/parameter-type.model';
import {createConsonantCounts, createTextAnalysesResult, createVowelCounts} from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class TextAnalyzerService {

  restApiService = inject(TextAnalyzerRestApiService);

  readonly isAnalyzing = signal(false);
  readonly lastResult = signal<TextAnalysesResult | null>(null);
  readonly error = signal<string | null>(null);

  analyzeOnline(request: TextAnalysesRequest): Observable<TextAnalysesResult> {
    this.setAnalyzingState(true);

    return this.restApiService.analyzeText(request).pipe(
      map(result => {
        this.setAnalyzingState(false);
        this.lastResult.set(result);
        this.error.set(null);
        return result;
      }),
      catchError(error => {
        this.setAnalyzingState(false);
        this.error.set(error.message);
        throw error;
      })
    );
  }

  analyzeOffline(request: TextAnalysesRequest): Observable<TextAnalysesResult> {
    this.setAnalyzingState(true);

    try {
      const letterCounts = request.parameterType === ParameterType.VOWELS
        ? createVowelCounts(request.inputText)
        : createConsonantCounts(request.inputText);

      const result = createTextAnalysesResult(request, letterCounts);

      this.setAnalyzingState(false);
      this.lastResult.set(result);
      this.error.set(null);

      return of(result);
    } catch (error: any) {
      this.setAnalyzingState(false);
      this.error.set(error.message);
      throw error;
    }
  }

  private setAnalyzingState(isAnalyzing: boolean) {
    this.isAnalyzing.set(isAnalyzing);
  }
}
