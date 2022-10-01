import MainCard from "components/MainCard";
import {Link, useNavigate} from 'react-router-dom';
import {Form, useFormik, FormikProvider} from "formik";

import * as Yup from 'yup';
import {LoadingButton} from '@material-ui/lab';
import {TextField, Button, Grid} from "@mui/material";
import {postQuestionById } from 'api/question'
import CustomError from 'utils/CustomError'
import { useSnackbar } from 'notistack';
import {useSelector} from "react-redux";

const PostQuestion = ()=>{
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const userInfo   = useSelector(state =>  state.userInfo );

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
            const questionRegisterRequest = {
                question:{
                    title: values.title,
                    body: values.body
                }
            };

            const response = await postQuestionById(questionRegisterRequest);
            setSubmitting(false);
            if(response instanceof CustomError){
                enqueueSnackbar(response.message, {variant: 'error'});
            }else{
                enqueueSnackbar('문의가 등록되었습니다.', {variant: 'success'});
                navigate(`/questions`);
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
        <MainCard darkTitle={true} title={"문의하기"}>
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
                                제출
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </Form>
            </FormikProvider>
        </MainCard>
    </>
}

export default PostQuestion