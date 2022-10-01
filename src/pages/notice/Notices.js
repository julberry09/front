import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { getNoticeList } from 'api/notice';
import CustomError from 'utils/CustomError';
import MainCard from 'components/MainCard';
import { Button, Grid } from '@mui/material';
import DataTable from 'components/@extended/DataTable';
import {useSelector} from "react-redux";
import {USER_TYPE} from "../../utils/constants";

const Notices = ()=>{
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const userInfo   = useSelector(state =>  state.userInfo );

  useEffect(async ()=>{
    await searchNotice()
  },[]);

  const searchNotice = async ()=>{
    await setIsLoading(true);

    const response = await getNoticeList();
    if(response instanceof CustomError){
      enqueueSnackbar(response.message, {variant: 'error'});
      return;
    }

    await setData(response);
    await setIsLoading(false);
  }

  const rowClick=useCallback((e,row)=>{
    const noticeId = row.id;
    navigate(`/notice/${noticeId}`);

  },[])

  const postNotice=()=>{
    navigate(`/notice/post`);
  }

  return (
    <MainCard title="공지사항">
      {userInfo.userType==USER_TYPE.ADMIN
          &&
      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        spacing={2}>
        <Grid item>
          <Button style={{margin:10}} variant="contained" onClick={postNotice}>등록하기</Button>
        </Grid>
      </Grid>
      }
      <DataTable columns={columns} rows={data} rowsPerPageOptions={[10,20,30]} isLoading={isLoading} rowClick={rowClick}/>
    </MainCard>
  )
}

export default Notices;

const columns = [
  {
    id : 'title',
    label: '공지 사항',
    width: 290,
    align: 'left',
  },
  {
    id : 'createdDate',
    label: '등록 날짜',
    width: 60,
    align: 'left',
  },

];