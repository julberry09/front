import MainCard from 'components/MainCard';
import DataTable from "components/@extended/DataTable";
import {useCallback, useEffect, useState} from "react";
import {getQuestionsByUserId} from 'api/question'
import {useNavigate} from 'react-router-dom';
import {Button, Grid, Stack, Typography} from "@mui/material";
import CustomError from 'utils/CustomError';
import { useSnackbar } from 'notistack';
import Dot from "../../components/@extended/Dot";


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
        <Stack direction='row' spacing={1} alignItems='center'>
            <Dot color={color} />
            <Typography>{title}</Typography>
        </Stack>
    );
};

const Questions = ()=>{
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(async ()=>{
        await searchQuestion()
    },[]);

    const searchQuestion = async ()=>{
        await setIsLoading(true);
        const response = await getQuestionsByUserId();
        if(response instanceof CustomError){
            enqueueSnackbar(response.message, {variant: 'error'});
            return;
        }

        await setData(response);
        await setIsLoading(false);
    }

    const rowClick=useCallback((e,row)=>{
        const questionId = row.id;
        navigate(`/question/${questionId}`);

    },[])

    const postQuestion=()=>{
        navigate(`/question/post`);
    }

    return (
    <MainCard title="1:1 문의하기">
        <Grid
            container
            direction="row"
            justifyContent="flex-end"
            spacing={2}>
            <Grid item>
                <Button variant="contained" onClick={postQuestion}>문의하기</Button>
            </Grid>
        </Grid>
        <DataTable columns={columns} rows={data} rowsPerPageOptions={[10,20,30]} isLoading={isLoading} rowClick={rowClick}/>
    </MainCard>
    )
}

export default Questions;

const columns = [
    {
        id : 'title',
        label: '제목',
        width: 290,
        align: 'left',
    },
    {
        id : 'createdDate',
        label: '문의 날짜',
        width: 60,
        align: 'left',
    },
    {
        id : 'existResponse',
        label: '답변 상태',
        width: 50,
        align: 'left',
        render: (row)=>{
            return <>
                <QuestionStatus status={row.existResponse}/>
            </>
        }
    },

];