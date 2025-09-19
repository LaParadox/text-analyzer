import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../config.service';
import {TextAnalysesRequest} from '../../models/text-analyses-request.model';
import {map, Observable, of} from 'rxjs';
import {TextAnalysesResult} from '../../models/text-analyses-result.model';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TextAnalyzerRestApiService {

  http = inject(HttpClient);
  configService = inject(ConfigService);

  analyzeText(request: TextAnalysesRequest): Observable<TextAnalysesResult> {
    const endpoint = `${this.configService.textAnalyzerBackendApi}/analyze`;

    return this.http.post<TextAnalysesResult>(endpoint, request).pipe(
      catchError(error => {
        console.error('error occurred', error);
        throw error;
      })
    );
  }

  healthCheck(): Observable<boolean> {
    const endpoint = `${this.configService.textAnalyzerBackendApi}/health`;

    return this.http.get<{ status: string }>(endpoint).pipe(
      map(response => response.status === 'ok'),
      catchError(() => of(false))
    );
  }
}
