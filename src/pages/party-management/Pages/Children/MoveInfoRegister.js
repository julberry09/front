import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import {
    Box,    Button,    Divider,    FormControl,    FormHelperText,    Grid,
    Paper,    IconButton,    InputAdornment,    InputLabel,    OutlinedInput,
    Stack,    Typography
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { styled } from '@mui/material/styles';
// third party
import * as Yup from 'yup';
import { Field, useFormik ,FormikProvider} from 'formik';

// ============================|| FIREBASE - REGISTER ||============================ //
import {useNavigate} from 'react-router-dom';
import DatepickerField from '../../Utils/DatepickerField';
import {getDriverInfo, postMoveInfo} from 'api/partymanagement';
import { useSnackbar } from 'notistack';
import {Item,Subtitle,ListBgColor,ListStatusDesc} from '../../Utils/ComponentTheme';
import CustomError from 'utils/CustomError';
import {useSelector} from "react-redux";
import {PARTY_STATUS} from "../../../../utils/constants";
import {LoadingButton} from "@mui/lab";

const InputTitle = {
    backgroundColor: '#1A2027',
    textAlign: 'center',
    color:'#fff',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50px',
    border: '2px solid #1A2027',
    borderRadius:1,
    boxShadow: 10
  }

const InputItem = {
    backgroundColor: '#fff',
    padding: '2px',
    margin:'5px',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50px',
    border: '2px solid #fff',
    borderRadius:1,
    boxShadow: 10
  }


const MoveInfoRegister = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const userInfo   = useSelector(state =>  state.userInfo );

    const [isLoading, setIsLoading]=useState(false);

    const formik = useFormik({
      initialValues: {
        placeOfDeparture: '',
        destination: '',
        startDate: '',
        distance:'',
        maxNumberOfParty:'',
      },
      validationSchema: Yup.object({
        placeOfDeparture: Yup.string()
          .max(255, '출발지를 입력하세요')
          .required('Required'),
        destination: Yup.string()
          .max(255, '목적지를 입력하세요')
          .required('Required'),
        startDate: Yup.string().required('Required'),
        maxNumberOfParty: Yup.string().required('Required'),
      }),
    onSubmit: async (values, { setSubmitting})=>{

        setSubmitting(true);
        setIsLoading(true);
        const driverInfo = await getDriverInfo();
        const moveInfoRegisterRequest = {

            curNumberOfParty:1,
            driver:{
                userId:userInfo.userId,
                carKind: driverInfo.carType,
                carNumber: driverInfo.carNumber,
                department: userInfo.userTeam,
                gender: userInfo.userGender,
                name: userInfo.userName,
                //Todo 넣는다면 구조 다 바꿔야합니다.
                // profileImage: "profile_img_src",
                //Todo 리뷰랑 연동
                reviewInfo: {
                  recentComment: "-",
                  reviewAverageScore: 0
                },
                settlementUrl: driverInfo.settlementUrl,
            },
            moveInfo:{
                placeOfDeparture: values.placeOfDeparture,
                destination: values.destination,
                startDate: values.startDate,
                distance: values.distance,
                //Todo 변경할 수도 있다.
                price: values.distance*200
            },
            maxNumberOfParty:values.maxNumberOfParty,
            status: PARTY_STATUS.OPEN
        };
        const response =  await postMoveInfo(moveInfoRegisterRequest);

        setSubmitting(false);
        setIsLoading(false);
        //enqueueSnackbar('운전정보가 등록되었습니다.', {variant: 'success'});
        //navigate(`/my-carpool-list`);
        if(response instanceof CustomError){
            enqueueSnackbar(response.message, {variant: 'error'});
        }else{
            enqueueSnackbar('운전정보가 등록되었습니다.', {variant: 'success'});
            navigate(`/my-carpool-list`);
        }
    },
    });
    return (
    <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
        <form onSubmit={formik.handleSubmit}>

            <Grid container  spacing={3}>

                <Grid item xs={3} sm={3} md={3} sx={{p:1}}>
                    <Subtitle sx={InputTitle}><div style={{marginTop:'10px'}}>출발지</div></Subtitle>
                </Grid>
                <Grid item xs={9} sm={9} md={9} sx={{p:1}}>
                     <Item sx={InputItem}>
                        {/* <MapModal textName="출발지역 선택" type="a" mapid="TMapDepart"/> */}
                        <input
                            id="placeOfDeparture"
                            name="placeOfDeparture"
                            type="text"
                            style={{width:"100%", height:"100%", border:"1px solid #ccc", borderRadius:"5px"}}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.placeOfDeparture}
                        />
                    </Item>
                    {formik.touched.placeOfDeparture && formik.errors.placeOfDeparture ? (
                    <div>{formik.errors.placeOfDeparture}</div>
                    ) : null}
                </Grid>
                <Grid item xs={3} sm={3} md={3} sx={{p:1}}>
                    <Subtitle sx={InputTitle}>
                        <div style={{marginTop:'10px'}}>도착지</div>
                    </Subtitle>
                </Grid>
                <Grid item xs={9} sm={9} md={9} sx={{p:1}}>
                    <Item sx={InputItem}>
                        {/* <MapModalDestination textName="도착지역 선택" type="b" mapid="TMapDest"/> */}
                        <input
                            id="destination"
                            name="destination"
                            type="text"
                            style={{width:"100%", height:"100%", border:"1px solid #ccc", borderRadius:"5px"}}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.destination}
                        />
                    </Item>
                    {formik.touched.destination && formik.errors.destination ? (
                    <div>{formik.errors.destination}</div>
                    ) : null}
                </Grid>
                <Grid item xs={12} md={6} sx={{p:1}}>
                    <Stack spacing={1} sx={{p:1}}>
                        <Subtitle sx={InputTitle}><div  style={{marginTop:'10px'}}>출발시간</div></Subtitle>
                        <Field
                            name="startDate"
                            component={DatepickerField}
                            inputVariant="outlined"
                            label="startDate"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.startDate}

                        />
                        {formik.touched.startDate && formik.errors.startDate ? (
                        <div>{formik.errors.startDate}</div>
                        ) : null}
                    </Stack>
                </Grid>
                <Grid item xs={12} md={6} sx={{p:1}}>
                    <Stack spacing={1} sx={{p:1}}>
                        <Subtitle sx={InputTitle}>
                            <div style={{marginTop:'10px'}}>이동거리(km)</div>
                        </Subtitle>
                        <OutlinedInput
                                id="distance"
                                name="distance"
                                type='number'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.distance}
                                sx={InputItem}
                            />
                            {formik.touched.distance && formik.errors.distance ? (
                            <div>{formik.errors.distance}</div>
                            ) : null}
                    </Stack>
                    <Stack spacing={1} sx={{p:1}}>
                        <Subtitle sx={InputTitle}><div style={{marginTop:'10px'}}>파티인원</div></Subtitle>
                        <OutlinedInput
                                id="maxNumberOfParty"
                                name="maxNumberOfParty"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.maxNumberOfParty}
                                sx={InputItem}
                            />
                            {formik.touched.maxNumberOfParty && formik.errors.maxNumberOfParty ? (
                            <div>{formik.errors.maxNumberOfParty}</div>
                            ) : null}
                    </Stack>
                </Grid>
                <Grid item xs={12} align="center">
                    <LoadingButton
                        size="large"
                        type="submit"
                        loading={isLoading}
                        variant="contained"
                        color="primary"
                        sx={{m:2}}
                    >등록
                    </LoadingButton>
                    <Button
                        disableElevation
                        size="large"
                        variant="contained"
                        color="error"
                        sx={{m:2}}
                        onClick={()=>navigate('/party-management')}
                    >취소
                    </Button>
                </Grid>
            </Grid>
        </form>
        </LocalizationProvider>
      </FormikProvider>
    );

};

export default MoveInfoRegister;
