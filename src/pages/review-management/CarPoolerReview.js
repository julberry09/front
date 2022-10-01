import MainCard from 'components/MainCard';
import { Link, useNavigate } from 'react-router-dom';
import { Form, useFormik, FormikProvider } from 'formik';

import * as Yup from 'yup';
import { LoadingButton } from '@material-ui/lab';
import { TextField, Button, Grid } from '@mui/material';
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



const RegisterReview = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      partyId: '0',
      userId: 'oh',
      username: 'oh',
      profileImage: 'image',
      department: 'ICT',
      carPoolRole: 'DRIVER',
    },
    validationSchema: Yup.object().shape({
      comment: Yup.string().required('내용을 입력해주세요.'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      // Todo 수정 필요

      const reviewerId = values.reviewerId;
      const reviewTargetId = values.reviewTargetId;
      
      const reviewContents = {};
      reviewContents.reviewScore = value;
      reviewContents.comment = values.comment;

      const partyInfo = {};
      partyInfo.partyId = '0';
      partyInfo.userId = 'oh';
      partyInfo.username = 'oh';
      partyInfo.profileImage = 'image';
      partyInfo.department = 'ICT';
      partyInfo.carPoolRole = 'DRIVER';

      const response = await registerReview({
        reviewerId,
        reviewTargetId,
        partyInfo,
        reviewContents,
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

  const [value, setValue] = React.useState(2);
  const [hover, setHover] = React.useState(-1);

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
      <MainCard darkTitle={true} title={'리뷰하기'}>
      <Grid container display="flex" style={{ marginBottom:10}}>
        <Card sx={{ maxWidth: 200 }}>
            <CardMedia component="img" height="200" src={avatar1} />
            <CardContent>
              <Typography
                align="center"
                gutterBottom
                variant="h4"
                component="div"
              >
                운전자
              </Typography>
              <Typography variant="body2" color="text.secondary">
                부서
              </Typography>
              <Typography variant="body2" color="text.secondary">
                이름
              </Typography>
            </CardContent>
        </Card>
      </Grid>
        <FormikProvider value={formik}>
          <Form onSubmit={handleSubmit}>
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
                  <Box sx={{ ml: 2 }}>
                    {labels[hover !== -1 ? hover : value]}
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid
              container
              justifyContent="flex-start"
              spacing={2}
              style={{ marginTop: 5, marginBottom: 5 }}
            >
              <Grid item xs={12}>
                <TextField
                  name="reviewerId"
                  label="리뷰자"
                  fullWidth
                  {...getFieldProps('reviewerId')}
                  error={Boolean(touched.reviewerId && errors.reviewerId)}
                  helperText={touched.reviewerId && errors.reviewerId}
                />
              </Grid>
            </Grid>
            
            <Grid
              container
              justifyContent="flex-start"
              spacing={2}
              style={{ marginTop: 5, marginBottom: 5 }}
            >
              <Grid item xs={12}>
                <TextField
                  name="reviewTargetId"
                  label="리뷰대상"
                  fullWidth
                  {...getFieldProps('reviewTargetId')}
                  error={Boolean(
                    touched.reviewTargetId && errors.reviewTargetId
                  )}
                  helperText={touched.reviewTargetId && errors.reviewTargetId}
                />
              </Grid>
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
