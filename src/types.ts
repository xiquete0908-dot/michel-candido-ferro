export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  equip: string;
  video: string;
  load: boolean;
}

export interface WorkoutDay {
  key: string;
  label: string;
  focus: string;
  sub: string;
  ex: Exercise[];
}

export interface CatalogExercise {
  id: string;
  name: string;
  category: string;
  sets: number;
  reps: string;
  rest: string;
  equip: string;
  video: string;
  load: boolean;
}

export interface StudentProfile {
  studentName?: string;
  trainerName?: string;
  goal?: string;
  notes?: string;
}

export interface ShareableWorkoutPayload {
  version: number;
  profile?: StudentProfile;
  customWorkouts?: Record<string, WorkoutDay>;
  coverPhotoUrl?: string;
  timestamp?: number;
}

export interface AppState {
  loads: Record<string, string>;
  sets: Record<string, boolean[]>;
  completedDays: Record<string, boolean>;
  coverPhotoUrl?: string;
  customWorkouts?: Record<string, WorkoutDay>;
  profile?: StudentProfile;
}
