import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { axios } from 'utils';
import { getAllQuestions, getQuestionsByUserId } from 'api/question';
import CustomError from 'utils/CustomError';
import MainCard from 'components/MainCard';
import {Button, Grid, Stack, Typography} from '@mui/material';
import DataTable from 'components/@extended/DataTable';
import Dot from "../../../components/@extended/Dot";


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

const QuestionsManagement = ()=>{
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(async ()=>{
    await searchQuestion()
  },[]);

  const searchQuestion = async ()=>{
    await setIsLoading(true);

    const response = await getAllQuestions();
    if(response instanceof CustomError){
      enqueueSnackbar(response.message, {variant: 'error'});
      return;
    }

    await setData(response);
    await setIsLoading(false);
  }

  const rowClick=useCallback((e,row)=>{
    const questionId = row.id;
    //Todo 수정 필요.
    navigate(`/admin/question-management/response/${questionId}`);

  },[])

  return (
    <MainCard title="문의사항 관리">
      <DataTable columns={columns} rows={data} rowsPerPageOptions={[10,20,30]} isLoading={isLoading} rowClick={rowClick}/>
    </MainCard>
  )
}

export default QuestionsManagement

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