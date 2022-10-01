import React, {useEffect, useState} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import {Button,FormHelperText,Grid,Link,IconButton,InputAdornment,InputLabel,OutlinedInput,Stack} from '@mui/material';
//Checkbox,Divider,FormControlLabel,Typography
//import FirebaseSocial from './FirebaseSocial';

import {getPhotoByUserId, signinByUserId} from 'api/user'
import {useNavigate} from 'react-router-dom';
// import { values } from 'lodash';
import { useSnackbar } from 'notistack';
import CustomError from 'utils/CustomError';

import { parseJwt, setAuthHeader, localStorageHandler} from 'utils';
import {ACCESS_TOKEN, JWT_EXPIRY_TIME, REFRESH_TOKEN} from 'utils/constants';

import { useDispatch } from 'react-redux';
import { setUserInfo } from 'store/reducers/userInfo';
import {onSlientRefresh} from "../../../utils/authProvider";

// ============================|| FIREBASE - LOGIN ||============================ //
const AuthLogin = () => {
    const initialState = {email:'', password:''};
    const [userData, setuserData] = useState(initialState);
    let dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    //const [checked, setChecked] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    useEffect(()=>{
        dispatch(
            setUserInfo({ userId     : "",
                userName   : "",
                userTeam   : "",
                email      : "",
                driverYn   : "",
                userGender   : "",
                userType   : "",
                userPhoto  : '',
            }));
    },[])
    const signinConfirm = async ()=>{
        const response = await signinByUserId({userId: email.value ,userPassword: password.value})
        if(response instanceof CustomError){
            enqueueSnackbar(response.message, {variant: 'error'});
        }else{
            setAuthHeader(`Bearer ${response.accessToken}`);
            localStorageHandler.setItem(ACCESS_TOKEN , response.accessToken);
            localStorageHandler.setItem(REFRESH_TOKEN, response.refreshToken);

            const userInfo = parseJwt(response.accessToken);
            // console.log("userInfo:",userInfo );

            const result = await getPhotoByUserId(userInfo.userId);
            let photo = null;
            if(result instanceof CustomError){
                // return;
            }else{
                const str1='data:image/';
                const str2=result.fileExtension;;
                const str3=';base64,';
                const str4=result.userPhoto;
                photo =str1+str2+str3+str4;
            }

            dispatch(
                setUserInfo({ userId     : response.key,
                    userName   : userInfo.name,
                    userTeam   : userInfo.team,
                    email      : userInfo.email,
                    driverYn   : userInfo.driverYn,
                    userGender : userInfo.userGender,
                    userType   : userInfo.userType,
                    userPhoto  : photo
                }));
            enqueueSnackbar('로그인 완료되었습니다. ', {variant: 'success'});
            setTimeout(onSlientRefresh, JWT_EXPIRY_TIME - 60 * 1000);
            navigate('/mypage');
        }
    }
    return (
        <>
            <Formik
                initialValues={{
                    email   : '', //info@codedthemes.com
                    password: '', //123456
                    submit  : null
                }}
                validationSchema={Yup.object().shape({
                    email   : Yup.string().max(255).required('ID or Email is required'), //email('Must be a valid email').
                    password: Yup.string().max(255).required('Password is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    setStatus({ success: false });
                    setSubmitting(true);
                    const result = await signinConfirm();
                    setSubmitting(false);
                    if(result instanceof CustomError){
                        enqueueSnackbar(result.message, {variant: 'error'});
                        return;
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="email-login">ID or Email address</InputLabel>
                                    <OutlinedInput
                                        id="email"
                                        // type="email"
                                        value={values.email}
                                        name="email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter id or email address"
                                        fullWidth
                                        error={Boolean(touched.email && errors.email)}
                                    />
                                    {touched.email && errors.email && (
                                        <FormHelperText error id="standard-weight-helper-text-email-login">
                                            {errors.email}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="password-login">Password</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.password && errors.password)}
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    size="large"
                                                >
                                                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        placeholder="Enter password"
                                    />
                                    {touched.password && errors.password && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.password}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>

                            <Grid item xs={12} sx={{ mt: -1 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                    {/* <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={checked}
                                                onChange={(event) => setChecked(event.target.checked)}
                                                name="checked"
                                                color="primary"
                                                size="small"
                                            />
                                        }
                                        label={<Typography variant="h6">Keep me sign in</Typography>}
                                    /> */}
                                    <Link variant="h6" component={RouterLink} to="" color="text.primary">
                                        Forgot Password?
                                    </Link>
                                </Stack>
                            </Grid>
                            {errors.submit && (
                                <Grid item xs={12}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <AnimateButton>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Login
                                    </Button>
                                </AnimateButton>
                            </Grid>
                            {/* <Grid item xs={12}>
                                <Divider>
                                    <Typography variant="caption"> Login with</Typography>
                                </Divider>
                            </Grid>
                            <Grid item xs={12}>
                                <FirebaseSocial />
                            </Grid> */}
                        </Grid>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default AuthLogin;
