export interface SEOFormData {
  primaryKeyword: string;
  secondaryKeyword: string;
  highAffinityKeywords: string;
  country: string;
  language: string;
  webhookUrl: string;
  useCorsProxy: boolean;
}

export interface BriefResponse {
  markdown: string;
}

export enum Status {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}