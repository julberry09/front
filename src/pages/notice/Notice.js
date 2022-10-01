import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { getNoticeById, deleteNoticeById } from 'api/notice';
import CustomError from 'utils/CustomError';
import { Box, Button, CircularProgress, Grid } from '@mui/material';
import { LoadingButton } from '@material-ui/lab';
import ContentsCard from 'components/ContentsCard';
import DeleteCheckModal from 'components/@extended/DeleteCheckModal';

const Notice = ()=>{
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const {id} = useParams();

  const [notice, setNotice] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(async ()=>{
    const result = await getNoticeById({id});
    if(result instanceof CustomError){
      enqueueSnackbar(response.message, {variant: 'error'});
      return;
    }
    setNotice(result.notice);
  },[id])

  const goBackList=()=>{
    navigate(`/notices`);
  }

  const deleteCheckClick=()=>{
    setDeleteModalOpen(true);
  }

  const deleteConfirm = async ()=>{
    setDeleteLoading(true);
    const result = await deleteNoticeById({id});
    if(result instanceof CustomError){
      enqueueSnackbar(result.message, {variant: 'error'});
      return;
    }
    enqueueSnackbar('문의가 삭제되었습니다.', {variant: 'success'});
    setDeleteLoading(false);
    setDeleteModalOpen(false);
    navigate(`/notices`);
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
        <Button variant="outlined" onClick={goBackList}>목록</Button>
      </Grid>
      <Grid item>
        <LoadingButton variant="contained" onClick={deleteCheckClick} color="error" loading={deleteModalOpen}>삭제</LoadingButton>
      </Grid>
    </Grid>
    {notice ?
      <ContentsCard contents={notice}/> :
      <Box sx={{py: 3, minHeight: 560, alignContent: 'center'}}>
        <CircularProgress />
      </Box>
    }
    <DeleteCheckModal modalOpen={deleteModalOpen}
                      onCancel={deleteCancel}
                      onOk={deleteConfirm}
                      deleteLoading={deleteLoading}/>
  </>
}

export default Notice;