import { Link } from 'react-router-dom';

// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project import
import FirebaseRegister from './auth-forms/AuthUserRegister';
import AuthWrapper      from './AuthWrapper';

// ================================|| REGISTER ||================================ //

const UserRegister = () => (
    <AuthWrapper>
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                    <Typography variant="h3">회원가입</Typography>
                    {/* <Typography component={Link} to="/auth/login" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
                        Already have an account?
                    </Typography> */}
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <FirebaseRegister />
            </Grid>
        </Grid>
    </AuthWrapper>
);

export default UserRegister;
