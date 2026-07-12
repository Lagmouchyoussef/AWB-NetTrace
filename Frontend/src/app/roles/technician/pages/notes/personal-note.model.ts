export interface PersonalNote {
  id: number;
  title: string | null;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalNoteRequest {
  title?: string | null;
  body: string;
}
