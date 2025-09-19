import {
  Component,
  DestroyRef,
  effect,
  inject,
  Injector,
  OnInit,
  runInInjectionContext,
  signal
} from '@angular/core';
import {TextAnalysesResult} from '../../models/text-analyses-result.model';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ParameterType} from '../../models/parameter-type.model';
import {TextAnalyzerService} from '../../services/text-analyzer.service';
import {TextAnalysesRequest} from '../../models/text-analyses-request.model';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ToggleSwitchComponent} from '../toggle-switch/toggle-switch.component';
import {TextAreaInputComponent} from '../text-area-input/text-area-input.component';
import {RadioGroupComponent} from '../radio-group/radio-group.component';
import {ActionButtonsComponent} from '../action-buttons/action-buttons.component';
import {ErrorMessageComponent} from '../error-message/error-message.component';
import {AnalysesResultsComponent} from '../analyses-results/analyses-results.component';

@Component({
  selector: 'app-text-analyzer',
  imports: [
    ToggleSwitchComponent,
    ReactiveFormsModule,
    TextAreaInputComponent,
    RadioGroupComponent,
    ActionButtonsComponent,
    ErrorMessageComponent,
    AnalysesResultsComponent
  ],
  templateUrl: './text-analyzer.component.html',
  styleUrl: './text-analyzer.component.css'
})
export class TextAnalyzerComponent implements OnInit {

  injector = inject(Injector);
  destroyRef = inject(DestroyRef);
  textAnalyzerService = inject(TextAnalyzerService);

  analysisResults = signal<TextAnalysesResult[]>([]);
  parameterTypeOptions = signal([
    { value: ParameterType.VOWELS, label: 'Vowels' },
    { value: ParameterType.CONSONANTS, label: 'Consonants' }
  ]);

  analysisForm = new FormGroup({
    inputText: new FormControl('', [Validators.required, Validators.minLength(1)]),
    parameterType: new FormControl(ParameterType.VOWELS),
    isOnlineMode: new FormControl(false)
  });

  ngOnInit() {
    this.setupEffects();
  }

  onAnalyze() {
    if (!this.analysisForm.valid) return;

    const formValue = this.analysisForm.value;
    const request: TextAnalysesRequest = {
      parameterType: formValue.parameterType!,
      inputText: formValue.inputText!
    };

    const analyses$ = formValue.isOnlineMode
      ? this.textAnalyzerService.analyzeOnline(request)
      : this.textAnalyzerService.analyzeOffline(request);

    analyses$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (result) => {
        // Result will be handled by the effect
      },
      error: (error) => {
        console.error('Analyses failed:', error);
      }
    });
  }

  private setupEffects() {
    runInInjectionContext(this.injector, () => {
      // Listen to service state changes
      effect(() => {
        const lastResult = this.textAnalyzerService.lastResult();
        if (lastResult && !this.analysisResults().find(r => r.timestamp === lastResult.timestamp)) {
          this.analysisResults().unshift(lastResult);
        }
      });
    });
  }
}
