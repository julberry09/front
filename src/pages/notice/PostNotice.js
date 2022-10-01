import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { postNotice } from 'api/notice';
import CustomError from 'utils/CustomError';
import MainCard from 'components/MainCard';
import { Grid, TextField } from '@mui/material';
import { LoadingButton } from '@material-ui/lab';

const PostNotice = ()=>{
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title:"",
      body:""
    },
    validationSchema:Yup.object().shape({
      title: Yup.string()
        .required("제목을 입력해주세요."),
      body: Yup.string()
        .required("문의사항을 입력해주세요.")
    }),
    onSubmit: async (values, { setSubmitting})=>{

      setSubmitting(true);
      // Todo 수정 필요
      const noticeRegisterRequest = {
        adminId: 0,
        notice:{
          title: values.title,
          body: values.body
        }
      };

      const response = await postNotice(noticeRegisterRequest);
      setSubmitting(false);
      if(response instanceof CustomError){
        enqueueSnackbar(response.message, {variant: 'error'});
      }else{
        enqueueSnackbar('공지사항이 등록되었습니다.', {variant: 'success'});
        navigate(`/notices`);
      }
    },
  });

  const {
    values,
    errors,
    touched,
    handleSubmit,
    getFieldProps,
    isSubmitting,
    setFieldValue,
  } = formik;

  return <>
    <MainCard darkTitle={true} title={"공지사항 등록"}>
      <FormikProvider value={formik}>
        <Form onSubmit={handleSubmit}>
          <Grid
            container
            justifyContent="flex-start"
            spacing={2}
            style={{marginTop:5, marginBottom:5}}>
            <Grid item xs={12}>
              <TextField name="title"
                         label="제목"
                         fullWidth
                         {...getFieldProps('title')}
                         error={Boolean(touched.title && errors.title)}
                         helperText={(touched.title && errors.title)}/>
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="flex-start"
            spacing={2}
            style={{ marginBottom:5}}>
            <Grid item xs={12}>
              <TextField name="body"
                         label="내용"
                         multiline
                         rows={5}
                         fullWidth
                         {...getFieldProps('body')}
                         error={Boolean(touched.body && errors.body)}
                         helperText={(touched.body && errors.body)} />
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="flex-end"
            direction="row"
            spacing={2}>
            <Grid item>
              <LoadingButton
                variant="contained"
                type="submit"
                loading={isSubmitting}>
                등록
              </LoadingButton>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </MainCard>
  </>
}

export default PostNotice;