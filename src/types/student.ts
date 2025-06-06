import { Course } from './course';
import { Tutor } from './tutor';
import { Enrollment } from './enrollment';
import { StatusHistory } from './statusHistory';

export interface Student {
  id: number;
  id_card: string;
  name: string;
  date_of_birth: string;
  age: number;
  email: string;
  phone_number: string;
  city: string;
  address: string;
  courses: Course[];
  coursesString: string;
  school_name: string;
  school_year: number;
  is_enrolled: boolean;
  is_active: boolean;
  registered_at: Date;
  updated_at: string;
  tutor_id: number;
  tutor: Tutor;
  tutor_kinship: {id: number; name: string};
  enrollment: Enrollment;
  status_history: StatusHistory[];
}
