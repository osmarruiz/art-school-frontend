import { Course } from "./course";

export interface Student {
    id: number;
    id_card: string;
    name: string;
    courses: Course[];
    coursesString: string; 
    is_active: boolean;
    is_enrolled: boolean;
    date_of_birth: string;
    email: string;
    phone_number: string;
  }