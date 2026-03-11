import { ModelConfiguration } from './model.types';

export type ExperimentStatus = 'draft' | 'queued' | 'running' | 'complete' | 'failed';
export type AISystem = 'p1' | 'p2' | 'p3';

export interface Experiment {
  id: string;
  name: string;
  system: AISystem;
  projectId: string;
  status: ExperimentStatus;
  modelConfig: ModelConfiguration;
  config: P1Config | P2Config | P3Config;
  createdAt: string;
  completedAt?: string;
  runtimeSeconds?: number;
  progress?: number;
  stage?: string;
  error?: string;
}

// Precious1GPT Types
export interface P1Config {
  methylationFileId: string;
  rnaSeqFileId?: string;
  tissueType: string;
  species: string;
  chronologicalAge: number;
  sex: string;
  preprocessingOptions: string[];
}

export interface ShapGene {
  gene: string;
  shapValue: number;
  expressionLevel: number;
  direction: 'up' | 'down';
}

export interface DiseaseClassification {
  alzheimers: number;
  parkinsons: number;
  cardiovascular: number;
  type2diabetes: number;
  cancer: number;
}

export interface TherapeuticTarget {
  gene: string;
  score: number;
  knownDrugTarget: boolean;
  actionabilityScore: number;
  expressionLevel: number;
}

export interface P1Results {
  predictedBiologicalAge: number;
  chronologicalAge: number;
  ageAccelerationScore: number;
  ageAccelerationClass: 'normal' | 'accelerated' | 'decelerated';
  shapGenes: ShapGene[];
  diseaseClassification: DiseaseClassification;
  therapeuticTargets: TherapeuticTarget[];
}

// Precious2GPT Types
export interface P2Config {
  tissueType: string;
  species: string[];
  ageRange: { min: number; max: number };
  biologicalCondition: string;
  diseaseState?: string;
  dataModalities: string[];
  numberOfSamples: number;
  referenceDataset: string;
  noiseLevel: string;
  batchEffectSimulation: boolean;
  preserveCorrelationStructure: boolean;
  seed?: number;
}

export interface P2Results {
  generatedSamples: number;
  features: number;
  modalities: string[];
  generationTimeSeconds: number;
  qualityMetrics: {
    meanExpressionSimilarity: number;
    variancePreservation: number;
    correlationStructure: number;
    pcaVarianceExplained: number[];
  };
  downloadFiles: {
    name: string;
    size: number;
    url: string;
  }[];
}

// Precious3GPT Types
export interface GeneTarget {
  gene: string;
  expressionLevel: number;
  direction: 'up' | 'down' | 'any';
}

export interface P3Config {
  tissueType: string;
  diseaseCondition: string;
  ageRange: { min: number; max: number };
  geneTargets: GeneTarget[];
  compoundSmiles?: string[];
  compoundFileId?: string;
  screeningMode: 'broad' | 'targeted' | 'lead_optimization';
  maxCompounds: number;
  pathwayFocus: string[];
  filterToxicity: boolean;
}

export interface CompoundCandidate {
  rank: number;
  compoundId: string;
  compoundName: string;
  smiles: string;
  efficacyScore: number;
  selectivityScore: number;
  toxicityFlag: string | null;
  mechanismOfAction: string;
  predictedGeneChanges: Record<string, number>;
}

export interface EnrichedPathway {
  pathway: string;
  pValue: number;
  enrichmentScore: number;
  geneCount: number;
}

export interface P3Results {
  compoundsScreened: number;
  topCandidates: CompoundCandidate[];
  enrichedPathways: EnrichedPathway[];
  geneExpressionMatrix: Record<string, number[]>; // Gene names to expression values across samples
}
