import {ParameterType} from './parameter-type.model';

export interface TextAnalysesRequest {
  parameterType: ParameterType;
  inputText: string;
}
