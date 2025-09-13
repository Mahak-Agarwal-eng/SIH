import React from 'react';

interface VerificationResultProps {
    rollNumber: string;
    course: string;
    year: string;
    verificationStatus: string;
}

const VerificationResult: React.FC<VerificationResultProps> = ({ rollNumber, course, year, verificationStatus }) => {
    return (
        <div>
            <h2>Verification Result</h2>
            <p><strong>Roll Number:</strong> {rollNumber}</p>
            <p><strong>Course:</strong> {course}</p>
            <p><strong>Year:</strong> {year}</p>
            <p><strong>Verification Status:</strong> {verificationStatus}</p>
        </div>
    );
};

export default VerificationResult;