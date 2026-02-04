
export type BackendStack = 'Java' | 'Python';

export interface ArchitectureLayer {
  name: string;
  role: string;
  responsibilities: string[];
  keyComponents: string[];
}

export interface GenerationHistory {
  id: string;
  timestamp: string;
  prompt: string;
  code: string;
}

export interface ComparisonItem {
  layer: string;
  java: string;
  python: string;
  philosophy: string;
}

export interface GeneratedModule {
  stack: BackendStack;
  moduleName: string;
  files: {
    path: string;
    content: string;
  }[];
}
