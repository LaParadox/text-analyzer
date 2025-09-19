import { createTextAnalysesResult, createVowelCounts, createConsonantCounts } from './utils';
import { ParameterType } from '../models/parameter-type.model';
import { TextAnalysesRequest } from '../models/text-analyses-request.model';

describe('Utils Functions', () => {

  it('should create result with correct structure', () => {
    const request: TextAnalysesRequest = {
      parameterType: ParameterType.VOWELS,
      inputText: 'hello world'
    };
    const letterCounts = { 'E': 1, 'O': 2 };

    const result = createTextAnalysesResult(request, letterCounts);

    expect(result.parameterType).toBe(ParameterType.VOWELS);
    expect(result.originalText).toBe('hello world');
    expect(result.letterCounts).toEqual({ 'E': 1, 'O': 2 });
    expect(result.timestamp).toBeDefined();
  });

  it('should count vowels correctly and include all vowels', () => {
    const result = createVowelCounts('hello world');

    expect(result['A']).toBe(0);
    expect(result['E']).toBe(1);
    expect(result['O']).toBe(2);
    expect(Object.keys(result)).toEqual(['A', 'E', 'I', 'O', 'U']);
  });

  it('should count consonants correctly and exclude vowels', () => {
    const result = createConsonantCounts('hello world');

    expect(result['L']).toBe(3);
    expect(result['H']).toBe(1);
    expect(result['E']).toBeUndefined();
    expect(result['O']).toBeUndefined();
  });

  it('should handle case insensitive counting', () => {
    const vowelResult = createVowelCounts('AeI');
    const consonantResult = createConsonantCounts('BcD');

    expect(vowelResult['A']).toBe(1);
    expect(vowelResult['E']).toBe(1);
    expect(consonantResult['B']).toBe(1);
    expect(consonantResult['C']).toBe(1);
  });

  it('should handle empty strings', () => {
    const vowelResult = createVowelCounts('');
    const consonantResult = createConsonantCounts('');

    expect(vowelResult).toEqual({ A: 0, E: 0, I: 0, O: 0, U: 0 });
    expect(consonantResult).toEqual({});
  });
});
