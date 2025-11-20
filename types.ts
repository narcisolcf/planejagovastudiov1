
// Fix: Import React to ensure React namespace is available for React.ReactNode
import React from 'react';

export enum UserRole {
  ADMIN = 'ADMIN',
  GESTOR = 'GESTOR',
  COLABORADOR = 'COLABORADOR'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
}

export interface Organization {
  id: string;
  name: string;
  city: string;
  state: string;
}

export enum SwotType {
  STRENGTH = 'STRENGTH',
  WEAKNESS = 'WEAKNESS',
  OPPORTUNITY = 'OPPORTUNITY',
  THREAT = 'THREAT'
}

export interface SwotItem {
  id: string;
  text: string;
  type: SwotType;
  importance: number; // 1-5
  icon?: string; // Nome do ícone (ex: 'Users', 'DollarSign')
}

export interface StrategicFundamentals {
  mission: string;
  vision: string;
  values: string[];
  swotAnalysis: SwotItem[];
}

// --- BSC TYPES (PHASE 2) ---

export type PerspectiveType = 'FINANCIAL' | 'CUSTOMER' | 'PROCESSES' | 'LEARNING';

export interface Perspective {
  id: string;
  name: string;
  description: string;
  type: PerspectiveType;
  color: string; // Tailwind class or hex
  order: number;
}

export interface StrategicObjective {
  id: string;
  code: string;
  title: string;
  description: string;
  perspectiveId: string;
  ownerId?: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  progress: number; // 0-100 calculated
}

export interface ObjectiveRelationship {
  id: string;
  sourceId: string;
  targetId: string;
}

export type IndicatorPolarity = 'HIGHER_BETTER' | 'LOWER_BETTER';

export interface Measurement {
  id: string;
  date: string;
  value: number;
  evidenceUrl?: string;
  status: 'above_target' | 'on_target' | 'below_target';
}

export interface Target {
  year: number;
  period: string; // Q1, JAN, etc.
  value: number;
  toleranceMin: number;
  toleranceMax: number;
}

export interface Indicator {
  id: string;
  code: string;
  name: string;
  objectiveId: string;
  unit: string;
  frequency: string;
  baseline: number;
  target: number; // Meta atual/vigente
  currentValue: number | null;
  polarity: IndicatorPolarity;
  source: string;
  formula?: string; // Added as per PDF
  lastUpdate?: string;
  measurements?: Measurement[]; // Added for history
  targets?: Target[]; // Added for planning
}

// --- PROJECTS TYPES (PHASE 3) ---

export type ProjectStatus = 'PLANNING' | 'APPROVED' | 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
export type ProjectHealth = 'HEALTHY' | 'ATTENTION' | 'CRITICAL';
export type ProjectMethodology = 'TRADITIONAL' | 'AGILE' | 'HYBRID';

export interface Project {
  id: string;
  code: string;
  title: string;
  description: string;
  justification?: string;
  manager: string; // Nome do gerente
  sponsor: string; // Nome do patrocinador
  status: ProjectStatus;
  health: ProjectHealth;
  methodology: ProjectMethodology;
  progress: number; // 0-100
  
  // Dates
  startDate: string;
  endDate: string;
  baselineStartDate?: string;
  baselineEndDate?: string;

  // Budget
  budget: {
    estimated: number;
    approved: number;
    spent: number;
    committed: number;
  };

  // Alignment
  strategicObjectiveId?: string; // Link to BSC
  
  // EVA Metrics (Calculated)
  cpi?: number; // Cost Performance Index
  spi?: number; // Schedule Performance Index
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
  assignedTo?: string;
}

// Props genéricas para componentes UI
export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}
