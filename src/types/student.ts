import { Course } from "./course";

export interface Student {
    id: number;
    id_card: string;
    name: string;
    courses: Course[];
    coursesString: string; 
    "is_active": boolean;
  }