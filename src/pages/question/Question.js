import {useCallback, useEffect, useState} from 'react';

import {useParams} from 'react-router-dom';
import {getQuestionById, deleteQuestionById} from 'api/question'
import ContentsCard from "../../components/ContentsCard";
import {
    Box,
    Button, Card,
    CardContent,
    CircularProgress,
    Grid,
    InputLabel,
    Stack, TextareaAutosize,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import {LoadingButton} from '@material-ui/lab';
import {useNavigate} from 'react-router-dom';
import { useSnackbar } from 'notistack';
import DeleteCheckModal from "components/@extended/DeleteCheckModal";
import CustomError from 'utils/CustomError'
import {Formik} from "formik";
import {modifyAccusation} from "../../api/accusation";
import {SeverityPill} from "../../utils/severity-pill";

const Question = ()=>{
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const {id} = useParams();

    const [question, setQuestion] = useState(null);
    const [response, setResponse] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(async ()=>{
        const result = await getQuestionById({id});
        if(result instanceof CustomError){
            enqueueSnackbar(response.message, {variant: 'error'});
            return;
        }
        setQuestion(result.question);
        setResponse(result.response);
    },[id])

    const goBackList=()=>{
        navigate(`/questions`);
    }

    const deleteCheckClick=()=>{
        setDeleteModalOpen(true);
    }

    const deleteConfirm = async ()=>{
        setDeleteLoading(true);
        const result = await deleteQuestionById({id});
        if(result instanceof CustomError){
            enqueueSnackbar(result.message, {variant: 'error'});
            return;
        }
        enqueueSnackbar('문의가 삭제되었습니다.', {variant: 'success'});
        setDeleteLoading(false);
        setDeleteModalOpen(false);
        navigate(`/questions`);
    }

    const deleteCancel = ()=>{
        setDeleteModalOpen(false);
    }

    return <>
        <Grid
            container
            direction="row"
            justifyContent="flex-end"
            spacing={2}>
            <Grid item>
                <Button variant="contained" onClick={goBackList}>목록</Button>
            </Grid>
            <Grid item>
                <LoadingButton variant="contained" onClick={deleteCheckClick} color="error" loading={deleteModalOpen}>삭제</LoadingButton>
            </Grid>
        </Grid>
            <Card sx={{ p: 2 }} style={{ borderRadius: '8px', marginTop:15}}>
                <Toolbar>
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        variant='h4'
                        id='tableTitle'
                        component='div'>
                        {question?.title ? question.title : ''}
                    </Typography>
                    <QuestionStatus status={response}/>
                </Toolbar>
                <CardContent>
                    {question ?
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor='desc-signup'> 문의 내용</InputLabel>
                                    <TextareaAutosize
                                        maxRows={5}
                                        minRows={5}
                                        aria-label='maximum height'
                                        placeholder='내용'
                                        defaultValue={question.body}
                                        style={customStyle}
                                    />
                                </Stack>
                            </Grid>
                        :
                        <Box sx={{py: 3, minHeight: 560}} style={{textAlign: 'center'}}>
                            <CircularProgress />
                        </Box>
                    }
                </CardContent>
            </Card>
        {response ?
            <Card sx={{ p: 2 }} style={{ borderRadius: '8px', marginTop:15}}>
            <Toolbar>
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant='h4'
                    id='tableTitle'
                    component='div'>
                    답변
                </Typography>
            </Toolbar>
            <CardContent>
                {response ?
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor='desc-signup'> 제목 </InputLabel>
                            <TextareaAutosize
                                aria-label='maximum height'
                                placeholder='내용'
                                defaultValue={response.title}
                                style={customStyle}
                            />
                        </Stack>
                        <Stack style={{marginTop:10}} spacing={1}>
                            <InputLabel htmlFor='desc-signup'> 답변 내용</InputLabel>
                            <TextareaAutosize
                                maxRows={5}
                                minRows={5}
                                aria-label='maximum height'
                                placeholder='내용'
                                defaultValue={response.body}
                                style={customStyle}
                            />
                        </Stack>
                    </Grid>
                    :
                    <Box sx={{py: 3, minHeight: 560}} style={{textAlign: 'center'}}>
                        <CircularProgress />
                    </Box>
                }
            </CardContent>
        </Card>
            : <></>}
    </>
}

export default Question;


const QuestionStatus = ({ status }) => {
    let color;
    let title;

    if(status){
        color = 'success';
        title = '답변 완료';
    }else{
        color = 'warning';
        title = '답변 대기';
    }

    return (
        <SeverityPill style={{ width: '100px' }} color={color}>
            {title}
        </SeverityPill>
    );
};


const customStyle = {
    padding: '10.5px 14px 10.5px 12px',
    font: 'inherit',
    borderRadius: '4px',
    borderColor: '#d9d9d9'
};
