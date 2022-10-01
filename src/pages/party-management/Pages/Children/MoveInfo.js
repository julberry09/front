import { useEffect, useState } from 'react';
import { Link , useNavigate, useLocation} from 'react-router-dom';

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
import { Field, Form, Formik, useFormik ,FormikProvider} from 'formik';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import BasicDateTimePicker from '../../Utils/BasicDateTimePicker';
// ============================|| FIREBASE - REGISTER ||============================ //
import MapModal from '../../Utils/MapPopup';
import MapModalDestination from '../../Utils/MapPopupDest';
import DatepickerField from '../../Utils/DatepickerField';
import {postMoveInfo} from 'api/partymanagement';
//import CustomError from 'utils/CustomError'
import { useSnackbar } from 'notistack';
import {Demo,Item,Subtitle,ListBgColor,ListStatusDesc} from '../../Utils/ComponentTheme';
import isEmptyObj from '../../Utils/BasicUtils';

const MoveInfo = () => {
    const location=useLocation();
    const navigate = useNavigate();
    const [post, setPost] = useState(location.state.data);
    // const navigate = useNavigate();
    // const [user, setUser] = useState({});
    // const [post, setPost] = useState({});
    // const [isLoading, setIsLoading] = useState(false);
    // useEffect(async ()=>{
    //     await getPartyInfo(partyId);
    // },[partyId]);
    // const getPartyInfo = async (partyId)=>{
    //     await setIsLoading(true);

    //     const response = await getPartyInfo(partyId);
    //     let array = [];
    //     for(let index in response.data){
    //       array.push(response.data[index])
    //     }
    //     await setPost(!response.message ? array : []);
    //     await setIsLoading(false);
    // }
    // console.log(post);
    // const isEmpty = isEmptyObj(post)||(post.length === 0);

    const formik = useFormik({
      initialValues: {
        placeOfDeparture: post.moveInfo.placeOfDeparture,
        destination: post.moveInfo.destination,
        startDate: post.moveInfo.startDate,
        distance:post.moveInfo.distance,
        curNumberOfParty:post.curNumberOfParty,
        maxNumberOfParty:post.maxNumberOfParty,
      }
    }
    );
    //   validationSchema: Yup.object({
    //     placeOfDeparture: Yup.string()
    //       .max(255, '출발지를 입력하세요')
    //       .required('Required'),
    //     destination: Yup.string()
    //       .max(255, '목적지를 입력하세요')
    //       .required('Required'),
    //     startDate: Yup.string().required('Required'),
    //     maxNumberOfParty: Yup.string().required('Required'),
    //   }),

    // onSubmit: async (values, { setSubmitting})=>{
    //     setSubmitting(true);
    //     // Todo 수정 필요
    //     const moveInfoRegisterRequest = {

    //         curNumberOfParty:1,
    //         driver:{
    //             userId:"1",
    //             carKind: "BMW",
    //             carNumber: "12가1234",
    //             department: values.placeOfDeparture,
    //             gender: "male",
    //             name: "test",
    //             profileImage: "profile_img_src",
    //             reviewInfo: {
    //               recentComment: "good boy",
    //               reviewAverageScore: 2.1
    //             },
    //             settlementUrl: "settlementUrl.html",
    //         },
    //         moveInfo:{
    //             placeOfDeparture: values.placeOfDeparture,
    //             destination: values.destination,
    //             startDate: values.startDate,
    //             distance: values.distance,
    //             price: 0
    //         },
    //         maxNumberOfParty:values.maxNumberOfParty,
    //         status: "OPEN"
    //     };
    //     const response =  postMoveInfo(moveInfoRegisterRequest);
    //     setSubmitting(false);
    //     navigate(`/my-carpool-list`);
    // },
    // });
    return (
    <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
        <form onSubmit={formik.handleSubmit}>
            <Grid container  spacing={3}>
                <Grid item xs={3} sm={3} md={3} sx={{p:1}}>
                    <Subtitle><div style={{marginTop:'10px'}}>출발지</div></Subtitle>
                </Grid>
                <Grid item xs={9} sm={9} md={9} sx={{p:1}}>
                    <Item>
                        <MapModal textName={formik.values.placeOfDeparture} type="a" mapid="TMapDepart"/>
                        <input
                            id="placeOfDeparture"
                            name="placeOfDeparture"
                            type="hidden"
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
                    <Subtitle >
                        <div style={{marginTop:'10px'}}>도착지</div>
                    </Subtitle>
                </Grid>
                <Grid item xs={9} sm={9} md={9} sx={{p:1}}>
                    <Item>
                        <MapModalDestination textName={formik.values.destination} type="b" mapid="TMapDest"/>
                        <input
                            id="destination"
                            name="destination"
                            type="hidden"
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
                        <Subtitle ><div  style={{marginTop:'10px'}}>출발시간</div></Subtitle>
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
                        <Subtitle >
                            <div style={{marginTop:'10px'}}>이동거리</div>
                        </Subtitle>
                        <OutlinedInput
                                id="distance"
                                name="distance"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.distance}
                            />
                            {formik.touched.distance && formik.errors.distance ? (
                            <div>{formik.errors.distance}</div>
                            ) : null}
                    </Stack>
                    <Stack spacing={1} sx={{p:1}}>
                        <Subtitle ><div style={{marginTop:'10px'}}>파티인원</div></Subtitle>
                        <OutlinedInput
                                id="maxNumberOfParty"
                                name="maxNumberOfParty"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.maxNumberOfParty}
                            />
                            {formik.touched.maxNumberOfParty && formik.errors.maxNumberOfParty ? (
                            <div>{formik.errors.maxNumberOfParty}</div>
                            ) : null}
                    </Stack>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button
                        size="large"
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{m:2}}
                    >수정
                    </Button>
                    <Button
                        disableElevation
                        size="large"
                        variant="contained"
                        color="error"
                        sx={{m:2}}
                        onClick={()=>navigate(-1)}
                    >취소
                    </Button>
                </Grid>
            </Grid>
        </form>
        </LocalizationProvider>
      </FormikProvider>
    );

};

export default MoveInfo;
