import { Course } from './course';
import { CourseShift } from './courseShift';
import { Transaction } from './transaction';

export interface Enrollment {
  id: number;
  is_paid: boolean;
  is_exonerated: boolean;
  courses: CourseShift[];
  transaction: Transaction;
  registered_at: Date;
  emergency_number: string;
}
