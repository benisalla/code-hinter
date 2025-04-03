import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000/api';

interface PostRequestPayload {
    [key: string]: any;
}

interface ISignin {
    user: {
        name: string;
        role: string;
        id: number;
    }
}

interface ExercisePayload {
    code_prof: string;
    concepts: string;
    id_prof: number;
    id?: number;
}



// ======================= API Endpoints =======================

const postRequest = async (endpoint: string, payload: PostRequestPayload): Promise<any> => {
    try {
        const response = await axios.post(`${BASE_URL}/${endpoint}`, payload, {
            headers: {
                'Content-Type': 'application/json',
                // Add any other required headers
            },
            withCredentials: false // Set to true if you're using cookies/sessions
        });
        return response.data;
    } catch (error: any) {
        throw error.response ? error.response.data : new Error('Network error');
    }
};

const getRequest = async (endpoint: string): Promise<any> => {
    try {
        const response = await axios.get(`${BASE_URL}/${endpoint}`);
        return response.data;
    } catch (error: any) {
        throw error.response ? error.response.data : new Error('Network error');
    }
}


const putRequest = async (endpoint: string, payload: PostRequestPayload): Promise<any> => {
    try {
        const response = await axios.put(`${BASE_URL}/${endpoint}`, payload);
        return response.data;
    } catch (error: any) {
        throw error.response ? error.response.data : new Error('Network error');
    }
};

const deleteRequest = async (endpoint: string): Promise<any> => {
    try {
        const response = await axios.delete(`${BASE_URL}/${endpoint}`);
        return response.data;
    } catch (error: any) {
        throw error.response ? error.response.data : new Error('Network error');
    }
};


export const evaluate_code = (concepts: string, st_code: string, model_type: string): Promise<any> => {
    return postRequest("evaluate_code", { concepts, st_code, model_type });
};

export const compare_code = (pr_code: string, st_code: string, model_type: string): Promise<any> => {
    return postRequest("compare_code", { pr_code, st_code, model_type });
};


export const sign_in = (name: string, password: string): Promise<ISignin> => {
    return postRequest("auth/signin", { name, password });
};

export const createOrUpdateExercise = (payload: ExercisePayload): Promise<ExercisePayload> => {
    if(payload.id) {
        return axios.put(`${BASE_URL}/exercise/${payload.id}`, payload, {
            headers: {
                'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    })
    .then(response => response.data)
    .catch(error => {
        console.error("Full error:", error);
        throw error.response ? error.response.data : new Error('Network error');
    });
    } else {
        return axios.post(`${BASE_URL}/exercise`, payload, {
            headers: {
                'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    })
    .then(response => response.data)
    .catch(error => {
        console.error("Full error:", error);
        throw error.response ? error.response.data : new Error('Network error');
    });
    }
};

export const getExerciseById = (id: number): Promise<ExercisePayload> => {
    return getRequest(`exercise/${id}`);
}

export const getExercises = (id?: number): Promise<ExercisePayload[]> => {
    return getRequest(`exercise/prof/${id}`);
}

export const listProfs = (): Promise<any[]> => {
    return getRequest("prof");
};

export const getProfById = (id: number): Promise<any> => {
    return getRequest(`prof/${id}`);
};

export const createProf = (payload: any): Promise<any> => {
    return postRequest("prof", payload);
};

export const updateProf = (id: number, payload: any): Promise<any> => {
    return putRequest(`prof/${id}`, payload);
};

export const deleteProf = (id: number): Promise<any> => {
    return deleteRequest(`prof/${id}`);
};

export const getProfExercises = (profId: number): Promise<any[]> => {
    return getRequest(`prof/${profId}/exercises`);
};

export const getProfStudents = (profId: number): Promise<any[]> => {
    return getRequest(`prof/${profId}/students`);
};

// ======================= API Endpoints =======================
// Student Endpoints
// ======================= API Endpoints =======================
export const listStudents = (): Promise<any[]> => {
    return getRequest("student");
};

export const getStudentById = (id: number): Promise<any> => {
    return getRequest(`student/${id}`);
};

export const createStudent = (payload: any): Promise<any> => {
    return postRequest("student", payload);
};

export const updateStudent = (id: number, payload: any): Promise<any> => {
    return putRequest(`student/${id}`, payload);
};

export const deleteStudent = (id: number): Promise<any> => {
    return deleteRequest(`student/${id}`);
};

export const getStudentExercises = (studentId: number): Promise<any[]> => {
    return getRequest(`student/${studentId}/exercises`);
};

export const getStudentProfessors = (studentId: number): Promise<any[]> => {
    return getRequest(`student/${studentId}/professors`);
};

// stud_exe (Student-Exercise Association) Endpoints
export const listStudExe = (): Promise<any[]> => {
    return getRequest("stud_exe");
};

export const getStudExeById = (id: number): Promise<any> => {
    return getRequest(`stud_exe/${id}`);
};

export const createStudExe = (payload: any): Promise<any> => {
    return postRequest("stud_exe", payload);
};

export const updateStudExe = (id: number, payload: any): Promise<any> => {
    return putRequest(`stud_exe/${id}`, payload);
};

export const deleteProfExe = (id: number): Promise<any> => {
    return deleteRequest(`exercise/${id}`);
};

export const getStudExeByStudent = (studentId: number): Promise<any[]> => {
    return getRequest(`stud_exe/student/${studentId}`);
};

export const getStudExeByExercise = (exerciseId: number): Promise<any[]> => {
    return getRequest(`stud_exe/exercise/${exerciseId}`);
};

export const getStudExeByProf = (profId: number): Promise<any[]> => {
    return getRequest(`stud_exe/prof/${profId}`);
};

// stud_prof (Student-Professor Association) Endpoints
export const listStudProf = (): Promise<any[]> => {
    return getRequest("stud_prof");
};

export const getStudProfById = (id: number): Promise<any> => {
    return getRequest(`stud_prof/${id}`);
};

export const createStudProf = (payload: any): Promise<any> => {
    return postRequest("stud_prof", payload);
};

export const updateStudProf = (id: number, payload: any): Promise<any> => {
    return putRequest(`stud_prof/${id}`, payload);
};

export const deleteStudProf = (id: number): Promise<any> => {
    return deleteRequest(`stud_prof/${id}`);
};

export const getStudProfByProf = (profId: number): Promise<any[]> => {
    return getRequest(`stud_prof/prof/${profId}`);
};

export const getStudProfByStudent = (studentId: number): Promise<any[]> => {
    return getRequest(`stud_prof/student/${studentId}`);
};


export interface StudentSubmission {
    code_submitted: string | null;
    score: number;
    stud_name: string;
}
export const getSubmittedStudentsByExercise = (exerciseId: number): Promise<any> => {
    return getRequest(`stud_exe/exercise/${exerciseId}/submitted`);
};



interface CodeSubmissionPayload {
    code: string;
    exercise_id: number;
    student_id: number;
}

export const submitCode = (payload: CodeSubmissionPayload): Promise<any> => {
    return postRequest("compare_code", payload);
};

export const run_code = (payload: CodeSubmissionPayload): Promise<any> => {
    return postRequest("evaluate_code", payload);
};
