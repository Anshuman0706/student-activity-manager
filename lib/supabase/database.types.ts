export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          mobile_number: string | null;
          branch: string;
          semester: number;
          role: "student" | "admin";
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          mobile_number?: string | null;
          branch: string;
          semester: number;
          role?: "student" | "admin";
          created_at?: string;
        };
        Update: {
          full_name?: string;
          mobile_number?: string | null;
          branch?: string;
          semester?: number;
          role?: "student" | "admin";
          created_at?: string;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          student_id: string;
          title: string;
          due_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          title: string;
          due_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          title?: string;
          due_date?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      exams: {
        Row: {
          id: string;
          student_id: string;
          subject: string;
          exam_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          subject: string;
          exam_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          subject?: string;
          exam_date?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      attendance: {
        Row: {
          id: string;
          student_id: string;
          subject: string;
          attended: number;
          total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          subject: string;
          attended?: number;
          total?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          subject?: string;
          attended?: number;
          total?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      books: {
        Row: {
          id: number;
          title: string;
          author: string;
          issued_to: string | null;
          borrowed_on: string | null;
          return_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          author: string;
          issued_to?: string | null;
          borrowed_on?: string | null;
          return_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          author?: string;
          issued_to?: string | null;
          borrowed_on?: string | null;
          return_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      student_library_loans: {
        Row: {
          id: string;
          student_id: string;
          book_name: string;
          borrowed_on: string;
          return_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          book_name: string;
          borrowed_on: string;
          return_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          book_name?: string;
          borrowed_on?: string;
          return_by?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      update_own_profile_semester: {
        Args: { p_semester: number };
        Returns: boolean;
      };
      update_own_profile_mobile_number: {
        Args: { p_mobile_number: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
