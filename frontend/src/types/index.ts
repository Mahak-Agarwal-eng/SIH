export interface CertificateFormData {
    rollNumber: string;
    course: string;
    year: number;
    file: File;
}

export interface VerificationResponse {
    isValid: boolean;
    message: string;
    certificateDetails?: {
        rollNumber: string;
        course: string;
        year: number;
        verificationStatus: string;
    };
}