import MainCard from '../../components/MainCard';

import { TextField, Button, Grid } from '@mui/material';

import * as React from 'react';

import DataTable from '../../components/@extended/DataTable';

import { useCallback, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { getReviewByReviewerId } from 'api/review';
import CustomError from 'utils/CustomError';

import Rating from '@mui/material/Rating';
import {useSnackbar} from "notistack";
import {useSelector} from "react-redux";

const MyRegisteredReview = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const userInfo   = useSelector(state =>  state.userInfo );

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(async () => {
    await searchReview();
  }, []);

  const searchReview = async () => {
    await setIsLoading(true);

    setIsLoading(true);
    const response = await getReviewByReviewerId({reviewerId:userInfo.userId});
    if(response instanceof CustomError){
        enqueueSnackbar(response.message, {variant: 'error'});
        return;
    }

    setData(response.reviews);
    setIsLoading(false);
  };

  // rowClick 필요없어보임..
  // const rowClick = useCallback((e, row) => {
  //   const reviewId = row.id;
  //   navigate(`/my-review/${reviewId}`);
  // }, []);

  return (
    <MainCard darkTitle={true} title={'내가 작성한 리뷰'}>
      <DataTable
        columns={columns}
        rows={data}
        rowsPerPageOptions={[10, 20, 30]}
        isLoading={isLoading}
        // rowClick={rowClick}
      />
    </MainCard>
  );
  };

export default MyRegisteredReview;

const columns = [
  {
    id: 'id',
    label: 'No.',
    width: 50,
    align: 'center',
  },
  {
    id: 'reviewTargetId',
    label: '리뷰대상',
    width: 60,
    align: 'center',
  },
  {
    id: 'modifiedDateTime',
    label: '리뷰날짜',
    width: 60,
    align: 'center',
  },
  {
    id: 'reviewScore',
    label: '별점',
    width: 60,
    align: 'center',
    render: (row)=>{
      return <>
          <Rating name="read-only" value={row.reviewScore} readOnly />
      </>
  }
  },
  {
    id: 'comment',
    label: '내용',
    width: 290,
    align: 'left',
  },
];
