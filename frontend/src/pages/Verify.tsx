import React, { useState } from 'react';
import axios from 'axios';

const Verify: React.FC = () => {
    const [rollNumber, setRollNumber] = useState('');
    const [verificationResult, setVerificationResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleVerify = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('/api/certificates/verify', { rollNumber });
            setVerificationResult(response.data);
        } catch (err) {
            setError('Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Verify Certificate</h1>
            <input
                type="text"
                placeholder="Enter Roll Number"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
            />
            <button onClick={handleVerify} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {verificationResult && (
                <div>
                    <h2>Verification Result:</h2>
                    <pre>{JSON.stringify(verificationResult, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default Verify;