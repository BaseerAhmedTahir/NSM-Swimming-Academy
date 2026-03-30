export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AdminAuthResponse extends AuthTokens {
    admin: {
        id: string;
        username: string;
        email: string;
        name: string;
        role: string;
        branchId: string;
    }
}

export interface StudentAuthResponse extends AuthTokens {
    student: {
        id: string;
        studentId: string;
        name: string;
        email: string;
        phone: string;
        status: string;
        branchId: string;
    }
}
