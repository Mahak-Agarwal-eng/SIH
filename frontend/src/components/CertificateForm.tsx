import React, { useState } from 'react';
import axios from 'axios';

const CertificateForm: React.FC = () => {
    const [rollNumber, setRollNumber] = useState('');
    const [course, setCourse] = useState('');
    const [year, setYear] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [verificationStatus, setVerificationStatus] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('rollNumber', rollNumber);
        formData.append('course', course);
        formData.append('year', year);
        if (file) {
            formData.append('certificate', file);
        }

        try {
            const response = await axios.post('/api/certificates/upload', formData);
            setVerificationStatus(response.data.verificationStatus);
        } catch (error) {
            console.error('Error uploading certificate:', error);
            setVerificationStatus('Error verifying certificate');
        }
    };

    return (
        <div>
            <h2>Upload Certificate</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Roll Number:</label>
                    <input
                        type="text"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Course:</label>
                    <input
                        type="text"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Year:</label>
                    <input
                        type="text"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Certificate File:</label>
                    <input type="file" onChange={handleFileChange} required />
                </div>
                <button type="submit">Submit</button>
            </form>
            {verificationStatus && <p>Verification Status: {verificationStatus}</p>}
        </div>
    );
};

export default CertificateForm;