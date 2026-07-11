export interface ChecklistItem {
  id: number;
  stepOrder: number;
  label: string;
  completed: boolean;
  completedAt: string | null;
}

export type PhotoPhase = 'BEFORE' | 'AFTER';

export interface InterventionPhotoMeta {
  id: number;
  phase: PhotoPhase;
  contentType: string;
  uploadedByUsername: string;
  createdAt: string;
}

export interface TechnicianNote {
  id: number;
  body: string;
  authorUsername: string;
  createdAt: string;
  updatedAt: string;
}

export interface RackElevationDevice {
  id: number;
  name: string;
  deviceType: string;
  positionUStart: number;
  heightU: number;
  target: boolean;
}

export interface RackElevation {
  rackName: string;
  rackHeightU: number;
  devices: RackElevationDevice[];
}
