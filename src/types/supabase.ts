import { LabelAnalysisResult } from '../types';

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScanRecord {
  id: string;
  user_id: string;
  product_name: string;
  ingredients: any;
  nutrition: any;
  health_score: number | string | null;
  warnings: any;
  image_url: string | null;
  created_at: string;
}

export interface FavoriteRecord {
  id: string;
  user_id: string;
  scan_id: string;
  created_at: string;
  scan?: ScanRecord;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string; email: string };
        Update: Partial<Profile>;
      };
      scans: {
        Row: ScanRecord;
        Insert: Omit<ScanRecord, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<ScanRecord>;
      };
      favorites: {
        Row: FavoriteRecord;
        Insert: Omit<FavoriteRecord, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<FavoriteRecord>;
      };
    };
  };
}
