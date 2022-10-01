import MainCard from 'components/MainCard';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { Form, useFormik, FormikProvider } from 'formik';

import * as Yup from 'yup';
import { LoadingButton } from '@material-ui/lab';
import {TextField, Button, Grid, OutlinedInput, Stack} from '@mui/material';
import { registerReview } from 'api/review';
import CustomError from 'utils/CustomError';
import { useSnackbar } from 'notistack';

import * as React from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';


import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import Typography from '@mui/material/Typography';


import avatar1 from 'assets/images/users/avatar-1.png';
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import moment from "moment";



const RegisterReview = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo   = useSelector(state =>  state.userInfo );

  const [value, setValue] = React.useState(3);
  const [hover, setHover] = React.useState(-1);

  useEffect(()=>{
    console.log("location.state.member:", location.state.member);
    console.log("location.state.party:", location.state.party);
  },[]);

  const formik = useFormik({
    initialValues: {
      party: location.state.party,
      member: location.state.member,
    },
    validationSchema: Yup.object().shape({
      comment: Yup.string().required('내용을 입력해주세요.'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);

      const response = await registerReview({
        reviewerId : userInfo.userId,
        reviewTargetId : values.member.userId,
        partyId : values.party.id,
        reviewContents:{
          reviewScore: value,
          comment: values.comment
        },
        reviewerRole: values.party.driver.userId == userInfo.userId ? 'DRIVER' : 'CARPOOLER',
        targetRole: values.party.driver.userId == values.member.userId ? 'DRIVER' : 'CARPOOLER'
      });

      setSubmitting(false);
      if (response instanceof CustomError) {
        enqueueSnackbar(response.message, { variant: 'error' });
      } else {
        enqueueSnackbar('리뷰가 등록되었습니다.', { variant: 'success' });
        navigate(`/my-review`);
      }
    },
  });

  const makePhoto = (userPhoto, fileExtension)=>{
    if(userPhoto && fileExtension){
      const str1='data:image/';
      const str2=fileExtension;;
      const str3=';base64,';
      const str4=userPhoto;
      return str1+str2+str3+str4;
    }else{
      return null;
    }
  }

  const labels = {
    1: 'VERYBAD',
    2: 'BAD',
    3: 'OK',
    4: 'GOOD',
    5: 'VERYGOOD',
  };

  function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
  }


  const {
    values,
    errors,
    touched,
    handleSubmit,
    getFieldProps,
    isSubmitting,
    setFieldValue,
  } = formik;

  return (
    <>
      <MainCard darkTitle={true} title={'리뷰 작성하기'}>

        <FormikProvider value={formik}>
          <Form onSubmit={handleSubmit}>
            <Grid container display="flex" style={{ marginBottom:10}} spacing={3}>
              <Card sx={{ maxWidth: 200, margin:5 }}>
                <CardMedia component="img" height="200" src={makePhoto(values.member.userPhoto, values.member.fileExtension)} />
                <CardContent>
                  <Typography
                      align="center"
                      gutterBottom
                      variant="h4"
                      component="div"
                  >
                    {values.party.driver.userId == values.member.userId ? '운전자' : '카풀러'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {`부서: ${values.member.userTeamName}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {`이름: ${values.member.userName}`}
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ maxWidth: 500, margin:5 }}>
                <CardContent sx={{marginTop:1}}>
                  <Grid container direction="column" alignItems="center" spacing={1}>
                    <Typography gutterBottom variant="h4" component="div">
                      파티정보
                    </Typography>
                    <TextField
                        name="placeOfDeparture"
                        label="출발지"
                        fullWidth
                        value={values.party.moveInfo.placeOfDeparture}
                        sx={{width:400, marginTop:2}}
                        disabled
                    />
                    <TextField
                        name="destination"
                        label="출발지"
                        fullWidth
                        value={values.party.moveInfo.destination}
                        sx={{marginTop:2}}
                        disabled
                    />
                    <TextField
                        name="startDate"
                        label="출발시간"
                        fullWidth
                        value={moment(values.party.moveInfo.startDate).format('YYYY-MM-DD HH:mm:ss')}
                        sx={{marginTop:2}}
                        disabled
                    />
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          <Grid
              container
              justifyContent="flex-start"
              spacing={2}
              style={{ marginTop: 5, marginBottom: 5 }}
            >
              <Box
                sx={{
                  width: 200,
                  display: 'flex',
                }}
                container
                style={{ marginBottom: 10 }}
              >
                <Rating
                  name="hover-feedback"
                  defaultValue={3}
                  size="large"
                  value={value}
                  precision={1}
                  sx={{ ml: 2 }}
                  getLabelText={getLabelText}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                  onChangeActive={(event, newHover) => {
                    setHover(newHover);
                  }}
                  emptyIcon={
                    <StarIcon style={{ opacity: 1 }} fontSize="inherit" />
                  }
                />
                {value !== null && (
                  <Box sx={{ ml: 2, }}>
                    {labels[hover !== -1 ? hover : value]}
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid
              container
              justifyContent="flex-start"
              spacing={2}
              style={{ marginBottom: 5 }}
            >
              <Grid item xs={12}>
                <TextField
                  name="comment"
                  label="내용"
                  multiline
                  rows={5}
                  fullWidth
                  {...getFieldProps('comment')}
                  error={Boolean(touched.comment && errors.comment)}
                  helperText={touched.comment && errors.comment}
                />
              </Grid>
            </Grid>
            <Grid
              container
              justifyContent="flex-end"
              direction="row"
              spacing={2}
            >
              <Grid item>
                <LoadingButton
                  variant="contained"
                  type="submit"
                  loading={isSubmitting}
                >
                  제출
                </LoadingButton>
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      </MainCard>
    </>
  );
};

export default RegisterReview;
