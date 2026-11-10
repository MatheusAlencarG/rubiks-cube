import type { Document } from '../../shared/api/types';

export interface Tutorial extends Document {
  title: string;
  description: string;
  kind: 'overview' | 'parts' | 'step';
  stepNumber: number | null;
  displayOrder: number;
  parts: {
    id: number;
    title: string;
    description: string;
    imageAlt: string;
    image: { url: string } | null;
  }[];
  videos: { id: number; title: string; embedUrl: string }[];
}
