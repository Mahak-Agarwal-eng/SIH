// Simple auth controller for demo - no real authentication
const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Demo signup - always succeeds
        res.status(201).json({
            ok: true,
            message: 'Account created successfully',
            user: { email }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Demo login - always succeeds
        res.status(200).json({
            ok: true,
            message: 'Login successful',
            user: { email }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    signup,
    login
};