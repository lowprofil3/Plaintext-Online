export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      assets_catalog: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category: string | null;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          category?: string | null;
          price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          category?: string | null;
          price?: number;
          created_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          energy_cost: number;
          focus_cost: number;
          base_payout: number;
          reputation_required: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          energy_cost: number;
          focus_cost: number;
          base_payout: number;
          reputation_required: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          energy_cost?: number;
          focus_cost?: number;
          base_payout?: number;
          reputation_required?: number;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          recipient_id: string;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          recipient_id: string;
          body: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          recipient_id?: string;
          body?: string;
          created_at?: string;
        };
      };
      player_assets: {
        Row: {
          id: string;
          player_id: string;
          asset_id: string;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          asset_id: string;
          quantity?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          asset_id?: string;
          quantity?: number;
          created_at?: string;
        };
      };
      players: {
        Row: {
          id: string;
          user_id: string;
          username: string;
          username_changed_at: string;
          stats: Json;
          regeneration: Json | null;
          assets: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          username: string;
          username_changed_at?: string;
          stats?: Json;
          regeneration?: Json | null;
          assets?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          username?: string;
          username_changed_at?: string;
          stats?: Json;
          regeneration?: Json | null;
          assets?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          player_id: string;
          amount: number;
          description: string;
          type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          amount: number;
          description: string;
          type: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          amount?: number;
          description?: string;
          type?: string;
          created_at?: string;
        };
      };
    };
    Functions: {
      init_player: {
        Args: Record<string, never>;
        Returns: unknown;
      };
      work_job: {
        Args: {
          job_id: string;
        };
        Returns: unknown;
      };
      purchase_asset: {
        Args: {
          asset_id: string;
        };
        Returns: unknown;
      };
    };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
