import { Course } from "./course";
import { Shift } from "./shift";

export interface CourseShift {
    course: Course;
    shift: Shift;
}