import { useNavigate } from 'react-router-dom';
import { Student } from '../types/student';
import { API_KEY, API_URL } from './apiConfig';
import useToast from '../hooks/useToast';

interface CourseSelection {
    courseId: number | null;
    shiftId: number | null;
    courseName: string | null;
    shiftName: string;
}

const processCourseChanges = async (
    studentId: number,
    courseSelection: CourseSelection[],
    studentData: Student,
    navigate: ReturnType<typeof useNavigate>,
) => {
    const toAdd = courseSelection.filter((c) => !studentData?.enrollment?.courses.find((cc) => cc.course.id === c.courseId));
    const toDelete = studentData?.enrollment?.courses.filter((c) => !courseSelection.find((cc) => cc.courseId === c.course.id));
    const { showSuccess, showError } = useToast();

    const addCourseRequests = toAdd.map((courseToAdd) =>
        fetch(`${API_URL}/students.add_course`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                Authorization: `${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                student_id: studentId,
                course_id: courseToAdd.courseId,
                shift_id: courseToAdd.shiftId
            }),
        }),
    );

    try {
        const addResponses = await Promise.all(addCourseRequests);

        for (const response of addResponses) {
            if (!response.ok) {
                const data = await response.json();
                console.error(`Error al agregar curso (status: ${response.status}):`, data?.detail || 'Error inesperado al agregar curso(s).');
                showError("Error al agregar curso.");
                throw new Error(`Error al agregar curso: ${response.status}`);
            }
        }

        const dropCourseRequests = toDelete.map((courseToDelete) =>
            fetch(`${API_URL}/students.drop_course`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    Authorization: `${API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    student_id: studentId,
                    course_id: courseToDelete.course.id,
                    shift_id: studentData?.enrollment?.courses.find((c) => c.course.id === courseToDelete.course.id,)?.shift.id
                }),
            }),
        );

        const dropResponses = await Promise.all(dropCourseRequests);

        for (const response of dropResponses) {
            if (!response.ok) {
                const data = await response.json();
                console.error(`Error al eliminar curso (status: ${response.status}):`, data?.detail || 'Error inesperado al eliminar curso(s).');
                showError(data?.detail || 'Error inesperado.');
                throw new Error(`Error al eliminar curso: ${response.status}`);
            }
        }

        showSuccess('Curso(s) actualizados exitosamente');
        navigate(`/student/${studentId}`);
    } catch (error) {
        console.error('Error al actualizar cursos:', error);
    }
};

export default processCourseChanges;
