import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import {
    Button,
    Grid,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography,
    Container
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
//import FirebaseSocial from './FirebaseSocial';
import AnimateButton from 'components/@extended/AnimateButton';
import {authenticatedByEmail, authnumcheckByEmail} from 'api/user'
import {useNavigate} from 'react-router-dom';

import { useSnackbar } from 'notistack';
import CustomError from 'utils/CustomError';
// ============================|| FIREBASE - REGISTER ||============================ //

const AuthRegister = () => {

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const authenticationNumSend  = async ()=>{
        await authenticatedByEmail({userMailAddress: email.value ,authNumber: '', possibleYn:''})
        .then((response) => {
            if(response instanceof CustomError){
                console.log("userInfo:",response.message );
                enqueueSnackbar(response.message, {variant: 'error'});
            }else{
                enqueueSnackbar('인증번호가 발송되었습니다. ', {variant: 'success'});
            }
        });
    };
    const authenticationNumCheck  = async ()=>{

        await authnumcheckByEmail({userMailAddress: email.value ,authNumber: authnum.value, possibleYn:''})
        .then((response) => {
            if(response instanceof CustomError){
                enqueueSnackbar(response.message, {variant: 'error'});
            }else{
                console.log("userInfo:",response.userMailAddress );
                console.log("userInfo:",response.possibleYn );
                if(response.possibleYn === 'Y'){
                    enqueueSnackbar('인증번호가 확인되었습니다. ', {variant: 'success'});

                    navigate(`/auth/registerform/${email.value}`);
                }else{
                    enqueueSnackbar('인증이 실패하였습니다.', {variant: 'error'});
                }
            }
        });
    };

    return (
        <>
            <Formik
                initialValues={{
                    email  : '',
                    authNum: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        setStatus({ success: false });
                        setSubmitting(false);
                    } catch (err) {
                        console.error(err);
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={1} align="left">
                             <Grid item xs={8} md={8}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="email-signup">Email Address</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        id="email"
                                        type="email"
                                        value={values.email}
                                        name="email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="sample@sk.com"
                                        inputProps={{}}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={4} md={4}  >
                                <AnimateButton >
                                    <Button xs={3} sx={{margin:1, mt: 4, mb: 3 }} type="submit" variant="contained" color="primary" onClick={authenticationNumSend}>인증발송</Button>
                                </AnimateButton>
                            </Grid>
                            <Grid item xs={12}>
                                    <OutlinedInput
                                        fullWidth
                                        id="authnum"
                                        value={values.authnum}
                                        name="authNum"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="인증번호를 입력하세요."
                                        inputProps={{}}
                                    />
                                {/* </Stack> */}
                            </Grid>
                            <Grid item xs={12}>
                                <AnimateButton >
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        onClick={authenticationNumCheck}
                                    >
                                        확인
                                    </Button>
                                </AnimateButton>

                            </Grid>
                        </Grid>

                    </form>
                )}
            </Formik>
        </>
    );
};

export default AuthRegister;
