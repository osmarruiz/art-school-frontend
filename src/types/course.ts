import { Shift } from './shift';
import { Type } from './type';

export interface Course {
  id: number;
  name: string;
  type: Type;
  price: number;
  is_closed: boolean;
  registered_date: Date;
  total_of_students: number;
  shifts: Shift[];
}
