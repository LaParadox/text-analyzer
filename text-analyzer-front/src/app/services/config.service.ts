import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class ConfigService {

  private readonly API_URL = 'http://localhost:8080/api/';

  get textAnalyzerBackendApi() {
    return this.API_URL + 'text-analyzer';
  }
}
