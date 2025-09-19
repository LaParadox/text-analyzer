import { TextAnalysesRequest } from '../models/text-analyses-request.model';
import { TextAnalysesResult } from '../models/text-analyses-result.model';

/**
 * FACTORY FUNCTIONS
 */
const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

export function createTextAnalysesResult(
  request: TextAnalysesRequest,
  letterCounts: { [key: string]: number }
): TextAnalysesResult {
  return {
    parameterType: request.parameterType,
    originalText: request.inputText,
    letterCounts,
    timestamp: new Date().toISOString()
  };
}

function countLetters(text: string, filterFn: (char: string) => boolean): { [key: string]: number } {
  return [...text.toUpperCase()].reduce((counts, char) => {
    if (/[A-Z]/.test(char) && filterFn(char)) {
      counts[char] = (counts[char] || 0) + 1;
    }
    return counts;
  }, {} as { [key: string]: number });
}

export function createVowelCounts(text: string): { [key: string]: number } {
  const counts = countLetters(text, char => VOWELS.has(char));

  // Ensure all vowels are represented (with 0 if not found)
  return { A: 0, E: 0, I: 0, O: 0, U: 0, ...counts };
}

export function createConsonantCounts(text: string): { [key: string]: number } {
  const counts = countLetters(text, char => !VOWELS.has(char));

  return Object.fromEntries(
    Object.entries(counts).sort(([a], [b]) => a.localeCompare(b))
  );
}
