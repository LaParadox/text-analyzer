import {ParameterType} from './parameter-type.model';

export interface TextAnalysesResult {
  parameterType: ParameterType;
  originalText: string;
  letterCounts: { [key: string]: number };
  timestamp: string;
}
