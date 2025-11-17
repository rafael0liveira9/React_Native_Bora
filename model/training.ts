export interface Training {
  id?: number;
  name?: string;
  description?: string;
  level?: number;
  url?: string;
  photo?: string;
  token?: string;
  trainingId?: number;
  assign?: boolean;
}
export interface Serie {
  serieId?: number;
  trainingId?: number;
  exercise?: number;
  interval?: number;
  repetitions?: string[];
  token?: string;
  difficulty?: string[];
  addSet?: number;
  bisetExerciseId?: number | null | undefined;
  isometry?: number;
  amount?: number;
}

export interface ExerciseExecution {
  exerciseId?: number;
  executionId?: number;
  difficulty?: string[];
  token?: string;
}

export interface EvaluationUpdate {
  id?: number;
  evaluation?: number;
  observation?: string;
  token?: string;
}
