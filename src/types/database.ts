export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          clerk_id: string
          email: string
          name: string | null
          plan: 'FREE' | 'PRO' | 'ENTERPRISE'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_id: string
          email: string
          name?: string | null
          plan?: 'FREE' | 'PRO' | 'ENTERPRISE'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_id?: string
          email?: string
          name?: string | null
          plan?: 'FREE' | 'PRO' | 'ENTERPRISE'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          user_id: string
          title: string
          file_name: string
          file_size: number
          file_type: string
          content: string
          summary: string | null
          storage_path: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          file_name: string
          file_size: number
          file_type: string
          content: string
          summary?: string | null
          storage_path: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          file_name?: string
          file_size?: number
          file_type?: string
          content?: string
          summary?: string | null
          storage_path?: string
          created_at?: string
          updated_at?: string
        }
      }
      document_shares: {
        Row: {
          id: string
          document_id: string
          shared_by: string
          shared_with: string
          permission: 'view' | 'edit'
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          shared_by: string
          shared_with: string
          permission?: 'view' | 'edit'
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          shared_by?: string
          shared_with?: string
          permission?: 'view' | 'edit'
          created_at?: string
        }
      }
      queries: {
        Row: {
          id: string
          user_id: string
          query: string
          response: string
          document_ids: string[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          query: string
          response: string
          document_ids: string[]
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          query?: string
          response?: string
          document_ids?: string[]
          created_at?: string
        }
      }
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type Document = Database['public']['Tables']['documents']['Row']
export type DocumentShare = Database['public']['Tables']['document_shares']['Row']
export type Query = Database['public']['Tables']['queries']['Row']
