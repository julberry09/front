import { useEffect, useState, useRef } from 'react';
import MainCard from 'components/MainCard';
import { Box,Button,Divider,FormControl,FormHelperText,Grid,Link,IconButton,InputAdornment,
    InputLabel,OutlinedInput, Stack,Typography,Avatar,Container,
} from '@mui/material';

import * as Yup from 'yup';
import { Field, Form, Formik, useFormik ,FormikProvider} from 'formik';
import {getUserByUserId, updateByUserId,updateWoPhotoByUserId} from 'api/user'
import {useNavigate} from 'react-router-dom';
import {useSelector } from 'react-redux';
import {useSnackbar } from 'notistack';
import CustomError from 'utils/CustomError';
import AnimateButton from 'components/@extended/AnimateButton';
import {strengthColor, strengthIndicator } from 'utils/password-strength';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import {LoadingButton} from '@material-ui/lab';

import {logOut} from "../../utils/authProvider";


const avartarStyle = {
    height: "10vh",
    width : "7vw",
    marginLeft: 0,
    marginTop: 20,
    marginBottom: 20,
}
// ============================|| FIREBASE - REGISTER ||============================ //
const UserUpdate = () => {

    let fileBf = '';
    let imagetmp ='';
    let response ='';

    const userInfo   = useSelector(state =>  state.userInfo );

    const navigate = useNavigate();
    const {enqueueSnackbar } = useSnackbar();

    const [isCheckLoading, setCheckLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [level, setLevel] = useState();
    const [showPassword, setShowPassword] = useState(false);

    const [image   , setImage]    = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")
    const [imageUrl, setImageUrl] = useState(null);
    const imgRef   = useRef();

    const [fileChgYn     , setFileChgYn     ] = useState('N');
    const [userEmail     , setUserEmail     ] = useState(null);
    const [userId        , setUserId        ] = useState(null);
    const [userName      , setUserName      ] = useState(null);
    const [userTeamName  , setUserTeamName  ] = useState(null);
    const [userGender    , setserGender     ] = useState(null);
    const [driverYn      , setDriverYn      ] = useState(null);
    const [settlementUrl , setSettlementUrl ] = useState(null);
    const [carType       , setCarType       ] = useState(null);
    const [carNumber     , setCarNumber    ] = useState(null);


    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setLevel(strengthColor(temp));
    };


    useEffect(async ()=>{await inqUser()},[]);

    const inqUser = async ()=>{
        await setIsLoading(true);
        response = await getUserByUserId(userInfo.userId)
            if(response instanceof CustomError){
                enqueueSnackbar(response.message, {variant: 'error'});
            }else{
                const str1='data:image/';
                const str2=response.fileExtension;;
                const str3=';base64,';
                const str4=response.userPhoto;
                imagetmp =str1+str2+str3+str4;

                await setUserEmail(response.userMailAddress);
                await setUserId(response.userId);
                await setUserName(response.userName);
                await setUserTeamName(response.userTeamName);
                await setserGender(response.userGender);
                await setDriverYn(response.driverYn);
                await setSettlementUrl(response.settlementUrl);
                await setCarType(response.carType);
                await setCarNumber(response.carNumber);
                await setImage(imagetmp);

                await setIsLoading(false);

            }

    }



    const handleImage = async(e)=>{

        const filereal = e.target.files[0];
        setFileChgYn('Y');
        const err = checkImage(filereal);
        console.log("filereal:",filereal );
        if(filereal){
            setImage(e.target.files[0]);

        }else{
            setImage("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
            return;
        }
        setImageUrl(filereal);

        const reader = new FileReader();
        reader.onload = () => {
        if(reader.readyState === 2){
        setImage(reader.result);
        }
        }
        reader.readAsDataURL(filereal);
    }

    const checkImage = (file) =>{
        let err="";
        if(!file) return err="File does not exist.";

        if(file.size>1024*1024){
            err = "The largest image size is 1mb.";
        }
        if(file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png'){
            err = "Image format is incorrect.";
        }
        return err;
    }

    const updateConfirm  = async ()=>{

        console.log("filereal11111:",fileChgYn );

        await setIsLoading(true);



        if(fileChgYn ==='Y'){
            let formData = new FormData();
            formData.append("profileImg"     , imageUrl);
            formData.append("userId"         , userId);
            formData.append("userPassword"   , password.value);
            formData.append("userMailAddress", userEmail );
            formData.append("userName"       , userName);
            formData.append("userTeamName"   , userTeamName);
            formData.append("userGender"     , userGender);
            formData.append("driverYn"       , driverYn);
            formData.append("settlementUrl"  , settlementUrl );
            formData.append("carType"        , carType);
            formData.append("carNumber"      , carNumber);

            await updateByUserId(userId, formData)
            .then((response) => {
                console.log("response:",response );

                if(response instanceof CustomError){
                    enqueueSnackbar(response.message, {variant: 'error'});
                }else{

                    enqueueSnackbar('수정이 완료되었습니다. 재로그인 해주세요', {variant: 'success'});
                    // navigate('/mypage');
                    logOut();
                }
            });
        }else{
            let formData = {

                "userId"         : userId,
                "userPassword"   : password.value,
                "userMailAddress": userEmail ,
                "userName"       : userName,
                "userTeamName"   : userTeamName,
                "userGender"     : userGender,
                "driverYn"       : driverYn,
                "settlementUrl"  : settlementUrl ,
                "carType"        : carType,
                "carNumber"      : carNumber,
            }


            await updateWoPhotoByUserId(userId, formData)
            .then((response) => {
                console.log("response:",response );

                if(response instanceof CustomError){
                    enqueueSnackbar(response.message, {variant: 'error'});
                }else{

                    enqueueSnackbar('수정이 완료되었습니다.', {variant: 'success'});
                    // navigate('/mypage');

                    logOut();
                }
            });
        }

        await setIsLoading(false);
    }


return (
        <>
         <MainCard darkTitle={true}  title="회원정보관리" >
            <Formik
                initialValues={{
                    email: '',
                    username: '',
                    userid:'',
                    company: '',
                    password: '',
                    gender:'',
                    driveryn:'',
                    carnumber:'',
                    cartype:'',
                    smturl:'',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    // userid: Yup.string().max(255).required('ID is required'),
                    // email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    // password: Yup.string().max(255).required('Password is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        setStatus({ success: false });
                        setSubmitting(false);
                        updateConfirm();
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

                        <Grid container spacing={1} item xs={6}>
                        <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="email-signup">이메일</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        id="email"
                                        type="email"
                                        readOnly="true"
                                        disabled="true"
                                        value= {userEmail}
                                        name="email"
                                        inputProps={{}}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="id-signup">아이디</InputLabel>
                                    <OutlinedInput
                                        id="userid"
                                        type="text"
                                        disabled="true"
                                        readOnly="true"
                                        value={userId}
                                        name="userid"
                                        fullWidth
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="password">비밀번호</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.password && errors.password)}
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            handleChange(e);
                                            changePassword(e.target.value);
                                        }}
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
                                        placeholder="******"
                                        inputProps={{}}
                                    />
                                    {touched.password && errors.password && (
                                        <FormHelperText error id="helper-text-password-signup">
                                            {errors.password}
                                        </FormHelperText>
                                    )}
                                </Stack>
                                <FormControl fullWidth sx={{ mt: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle1" fontSize="0.75rem">
                                                {level?.label}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="username-signup">이름</InputLabel>
                                    <OutlinedInput
                                        id="username"
                                        type="name"
                                        value={userName}
                                        name="username"
                                        onBlur={handleBlur}
                                        onChange={(e) => {setUserName(e.target.value)}}
                                        fullWidth
                                        error={Boolean(touched.username && errors.username)}
                                    />
                                    {touched.username && errors.username && (
                                        <FormHelperText error id="helper-text-username-signup">
                                            {errors.username}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="gender-signup">성별</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.gender && errors.gender)}
                                        id="gender"
                                        value={userGender}
                                        name="gender"
                                        onBlur={handleBlur}
                                        onChange={(e) => {setserGender(e.target.value)}}
                                        placeholder="M or F"
                                        inputProps={{}}
                                    />
                                    {touched.gender && errors.gender && (
                                        <FormHelperText error id="helper-text-gender-signup">
                                            {errors.gender}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="company-signup">소속부서</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.company && errors.company)}
                                        id="company"
                                        value={userTeamName}
                                        name="company"
                                        onBlur={handleBlur}
                                        onChange={(e) => {setUserTeamName(e.target.value)}}
                                        placeholder=""
                                        inputProps={{}}
                                    />
                                    {touched.company && errors.company && (
                                        <FormHelperText error id="helper-text-company-signup">
                                            {errors.company}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                        </Grid>
                        <Container align="left" xs={6} sx={{ margin: 0 }} >
                            <Avatar src= {image} style = {avartarStyle} onClick={()=>{imgRef.current.click()}}></Avatar>
                                <input  type='file' style={{display:'none'}} accept='image/jpg,impge/png,image/jpeg' name='profileImg' onChange={handleImage} ref={imgRef}/>
                        </Container>
                        <Grid container spacing={1} item xs={6}>
                            <Grid item xs={3}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="driveryn-signup">운전여부</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.company && errors.company)}
                                        id="driveryn"
                                        value={driverYn}
                                        name="driveryn"
                                        onBlur={handleBlur}
                                        onChange={(e) => {setDriverYn(e.target.value)}}
                                        placeholder="Y or N"
                                        inputProps={{}}
                                    />
                                    {touched.driveryn && errors.driveryn && (
                                        <FormHelperText error id="helper-text-driveryn-signup">
                                            {errors.driveryn}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={9}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="smturl-signup">카카오톡 송금주소</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.smturl && errors.smturl)}
                                        id="smturl"
                                        value={settlementUrl}
                                        name="smturl"
                                        onBlur={handleBlur}
                                        onChange={(e) => {setSettlementUrl(e.target.value)}}
                                        placeholder="카카오페이접속->내프로필->송금코드클릭"
                                        inputProps={{}}
                                    />
                                    {touched.smturl && errors.smturl && (
                                        <FormHelperText error id="helper-text-smturl-signup">
                                            {errors.company}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="carnumber-signup">자동차번호</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.carnumber && errors.carnumber)}
                                        id="carnumber"
                                        value={carNumber}
                                        name="carnumber"
                                        onBlur={handleBlur}
                                        onChange={(e) => {setCarNumber(e.target.value)}}
                                        placeholder="Car number"
                                        inputProps={{}}
                                    />
                                    {touched.carnumber && errors.carnumber && (
                                        <FormHelperText error id="helper-text-carnumber-signup">
                                            {errors.carnumber}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="cartype-signup">자동차 종류</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.cartype && errors.cartype)}
                                        id="cartype"
                                        value={carType}
                                        name="cartype"
                                        onBlur={handleBlur}
                                        onChange={(e) => {setCarType(e.target.value)}}
                                        placeholder="Car Type"
                                        inputProps={{}}
                                    />
                                    {touched.cartype && errors.cartype && (
                                        <FormHelperText error id="helper-text-cartype-signup">
                                            {errors.cartype}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
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
                                        신청
                                    </Button>
                                </AnimateButton>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
            </MainCard>
        </>
    );
};

export default UserUpdate;
