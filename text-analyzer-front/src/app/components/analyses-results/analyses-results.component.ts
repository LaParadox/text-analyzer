import {Component, input} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {TextAnalysesResult} from '../../models/text-analyses-result.model';
import {ParameterType} from '../../models/parameter-type.model';

@Component({
  selector: 'app-analyses-results',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './analyses-results.component.html',
  styleUrl: './analyses-results.component.css'
})
export class AnalysesResultsComponent {

  results = input<TextAnalysesResult[]>([]);
  selectedAnalysisType = input<ParameterType | null>();

  getLetterCounts(letterCounts: { [key: string]: number }) {
    return Object.entries(letterCounts)
      .map(([letter, count]) => ({ letter, count }))
      .filter(item => item.count > 0 || this.selectedAnalysisType() === ParameterType.VOWELS);
  }

  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleString();
  }
}
