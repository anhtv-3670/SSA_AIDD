export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      awards: {
        Row: {
          description: string | null
          id: string
          image: string | null
          name: string
          prize_value: string | null
          quantity: string | null
          ring_color: string | null
          sort_idx: number
        }
        Insert: {
          description?: string | null
          id: string
          image?: string | null
          name: string
          prize_value?: string | null
          quantity?: string | null
          ring_color?: string | null
          sort_idx?: number
        }
        Update: {
          description?: string | null
          id?: string
          image?: string | null
          name?: string
          prize_value?: string | null
          quantity?: string | null
          ring_color?: string | null
          sort_idx?: number
        }
        Relationships: []
      }
      badge_collections: {
        Row: {
          awarded_at: string
          badge_id: string
          id: string
          user_id: string
        }
        Insert: {
          awarded_at?: string
          badge_id: string
          id?: string
          user_id: string
        }
        Update: {
          awarded_at?: string
          badge_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "badge_collections_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "badge_collections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          id: string
          image: string | null
          name: string
          weight: number
        }
        Insert: {
          id: string
          image?: string | null
          name: string
          weight: number
        }
        Update: {
          id?: string
          image?: string | null
          name?: string
          weight?: number
        }
        Relationships: []
      }
      departments: {
        Row: {
          code: string
          name: string
        }
        Insert: {
          code: string
          name: string
        }
        Update: {
          code?: string
          name?: string
        }
        Relationships: []
      }
      hashtags: {
        Row: {
          id: number
          tag: string
        }
        Insert: {
          id?: never
          tag: string
        }
        Update: {
          id?: never
          tag?: string
        }
        Relationships: []
      }
      hearts: {
        Row: {
          kudos_id: string
          user_id: string
        }
        Insert: {
          kudos_id: string
          user_id: string
        }
        Update: {
          kudos_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hearts_kudos_id_fkey"
            columns: ["kudos_id"]
            isOneToOne: false
            referencedRelation: "kudos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hearts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hero_tiers: {
        Row: {
          color: string
          id: number
          max_received: number | null
          min_received: number
          name: string
        }
        Insert: {
          color: string
          id: number
          max_received?: number | null
          min_received: number
          name: string
        }
        Update: {
          color?: string
          id?: number
          max_received?: number | null
          min_received?: number
          name?: string
        }
        Relationships: []
      }
      kudos: {
        Row: {
          anonymous_name: string | null
          created_at: string
          danh_hieu: string | null
          id: string
          is_anonymous: boolean
          is_flagged: boolean
          message: string
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          anonymous_name?: string | null
          created_at?: string
          danh_hieu?: string | null
          id?: string
          is_anonymous?: boolean
          is_flagged?: boolean
          message: string
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          anonymous_name?: string | null
          created_at?: string
          danh_hieu?: string | null
          id?: string
          is_anonymous?: boolean
          is_flagged?: boolean
          message?: string
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kudos_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kudos_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kudos_hashtags: {
        Row: {
          hashtag_id: number
          kudos_id: string
        }
        Insert: {
          hashtag_id: number
          kudos_id: string
        }
        Update: {
          hashtag_id?: number
          kudos_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kudos_hashtags_hashtag_id_fkey"
            columns: ["hashtag_id"]
            isOneToOne: false
            referencedRelation: "hashtags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kudos_hashtags_kudos_id_fkey"
            columns: ["kudos_id"]
            isOneToOne: false
            referencedRelation: "kudos"
            referencedColumns: ["id"]
          },
        ]
      }
      kudos_images: {
        Row: {
          id: string
          kudos_id: string
          sort_idx: number
          url: string
        }
        Insert: {
          id?: string
          kudos_id: string
          sort_idx?: number
          url: string
        }
        Update: {
          id?: string
          kudos_id?: string
          sort_idx?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "kudos_images_kudos_id_fkey"
            columns: ["kudos_id"]
            isOneToOne: false
            referencedRelation: "kudos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_initial: string | null
          created_at: string
          dept_code: string | null
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          avatar_initial?: string | null
          created_at?: string
          dept_code?: string | null
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          avatar_initial?: string | null
          created_at?: string
          dept_code?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_dept_code_fkey"
            columns: ["dept_code"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["code"]
          },
        ]
      }
      secret_boxes: {
        Row: {
          unopened_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          unopened_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          unopened_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "secret_boxes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_hero_tier: {
        Args: { received: number }
        Returns: {
          color: string
          id: number
          max_received: number | null
          min_received: number
          name: string
        }
        SetofOptions: {
          from: "*"
          to: "hero_tiers"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      open_secret_box: {
        Args: never
        Returns: {
          id: string
          image: string | null
          name: string
          weight: number
        }
        SetofOptions: {
          from: "*"
          to: "badges"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      profile_stats: {
        Args: { uid: string }
        Returns: {
          boxes_opened: number
          boxes_unopened: number
          hearts_received: number
          hero_tier_name: string
          kudos_received: number
          kudos_sent: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

