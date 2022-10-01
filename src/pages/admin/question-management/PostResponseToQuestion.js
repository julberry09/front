import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { getQuestionById, postResponse } from 'api/question';
import CustomError from 'utils/CustomError';
import { Box, Button, CircularProgress, Grid, TextField } from '@mui/material';
import { LoadingButton } from '@material-ui/lab';
import ContentsCard from 'components/ContentsCard';
import {Form, useFormik, FormikProvider} from "formik";
import * as Yup from 'yup';

const PostResponseToQuestion=()=>{
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const {id} = useParams();

  const [question, setQuestion] = useState(null);
  const [response, setResponse] = useState(null);

  useEffect(async ()=>{
    const result = await getQuestionById({id});
    if(result instanceof CustomError){
      enqueueSnackbar(result.message, {variant: 'error'});
      return;
    }
    setQuestion(result.question);
    setResponse(result.response);
  },[id])

  const goBackList=()=>{
    navigate(`/admin/question-management`);
  }

  const formik = useFormik({
    initialValues: {
      title:"",
      body:""
    },
    validationSchema:Yup.object().shape({
      title: Yup.string()
        .required("제목을 입력해주세요."),
      body: Yup.string()
        .required("답변을 입력해주세요.")
    }),
    onSubmit: async (values, { setSubmitting})=>{

      setSubmitting(true);

      //Todo 수정 필요
      const responseRegisterRequest = {
        adminId: 0,
        responseContents:{
          title: values.title,
          body: values.body
        },
        questionId: id
      };
      console.log("responseRegisterRequest", responseRegisterRequest);

      const response = await postResponse(responseRegisterRequest);
      setSubmitting(false);
      if(response instanceof CustomError){
        enqueueSnackbar(response.message, {variant: 'error'});
      }else{
        enqueueSnackbar('답변이 등록되었습니다.', {variant: 'success'});
        navigate(`/admin/question-management`);
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
    <Grid
      container
      direction="row"
      justifyContent="flex-end"
      spacing={2}>
      <Grid item>
        <Button variant="outlined" onClick={goBackList}>목록</Button>
      </Grid>
    </Grid>
    {question ?
      <ContentsCard contents={question}/> :
      <Box sx={{py: 3, minHeight: 560, alignContent: 'center'}}>
        <CircularProgress />
      </Box>
    }
    {response
      ? <ContentsCard contents={response}/>
      : <FormikProvider value={formik}>
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
                제출
              </LoadingButton>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    }

  </>
}
export default PostResponseToQuestion;