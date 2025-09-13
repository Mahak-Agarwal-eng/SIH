import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { VerifiedUser, CloudUpload } from '@mui/icons-material';

const Home: React.FC = () => {
    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4, textAlign: 'center' }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Certificate Verification System
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph>
                    Verify the authenticity of educational certificates and degrees
                </Typography>

                <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button
                            component={Link}
                            to="/verify"
                            variant="contained"
                            startIcon={<VerifiedUser />}
                            size="large"
                        >
                            Verify Certificate
                        </Button>
                        <Button
                            component={Link}
                            to="/upload"
                            variant="outlined"
                            startIcon={<CloudUpload />}
                            size="large"
                        >
                            Upload Certificate
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Home;