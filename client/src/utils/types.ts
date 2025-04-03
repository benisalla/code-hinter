// ======================= Table Row Props =======================
export type ProfessorProps = {
    id: number;
    name: string;
    password: string; 
  };
  
  export type StudentProps = {
    id: number;
    name: string;
    password: string; 
    score?: number;   
  };
  
  export type ExerciseProps = {
    id: number;
    code_prof: string; 
    concepts: string;  
    id_prof: number;   
  };
  
  export type StudExeAssociationProps = {
    id: number;
    student_id: number;
    exercise_id: number;
    prof_id: number;
    score: number;
    status: "in_progress" | "submitted"; 
    code_submitted?: string | null;       
  };
  
  export type StudProfAssociationProps = {
    id: number;
    student_id: number;
    prof_id: number;
    notes?: string;
  };
  
  // --- Generic Table Row Type (for reusability) ---

  export type TableRowProps<T> = {
    row: T;
    selected: boolean;
    onSelectRow: () => void;
  };
  
  // ======================= Table Row Props =======================
  export type StudentTableRowProps = TableRowProps<StudentProps>;
  export type ProfessorTableRowProps = TableRowProps<ProfessorProps>;
  export type ExerciseTableRowProps = TableRowProps<ExerciseProps>;
  export type StudExeTableRowProps = TableRowProps<StudExeAssociationProps>;
  export type StudProfTableRowProps = TableRowProps<StudProfAssociationProps>;
  