import { Routes } from '@angular/router';
import {TextAnalyzerComponent} from './components/text-analyzer/text-analyzer.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/text-analyzer',
    pathMatch: 'full'
  },
  {
    path: 'text-analyzer',
    component: TextAnalyzerComponent,
    title: 'Text Analyzer - Vowels & Consonants Counter'
  },
  {
    path: '**',
    redirectTo: '/text-analyzer'
  }
];
