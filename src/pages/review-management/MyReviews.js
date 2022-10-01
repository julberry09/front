import MainCard from '../../components/MainCard';

import {TextField, Button, Grid, Select, MenuItem} from '@mui/material';

import * as React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';


import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-1.png';
import avatar3 from 'assets/images/users/avatar-1.png';
import Typography from '@mui/material/Typography';

import DataTable from "../../components/@extended/DataTable";


import {useCallback, useEffect, useState} from "react";
import Rating from "@mui/material/Rating";
import {useSnackbar} from "notistack";
import {useSelector} from "react-redux";
import {getReviewByReviewerId, myReview} from "../../api/review";
import CustomError from "../../utils/CustomError";
import {ROLE} from "../../utils/constants";


function getLabelText(value) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

export default function HoverRating() {
    const { enqueueSnackbar } = useSnackbar();
    const userInfo   = useSelector(state =>  state.userInfo );

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [review, setReviewData] = useState([]);
    const [role, setRole] = useState("ALL");

    useEffect(async () => {
        await searchReview();
    }, []);

    useEffect(async () => {
        if(role!="ALL"){
            const result = review.filter(o=>o.targetRole==role)
            setData(result);
        }else{
            setData(review);
        }
    }, [review, role]);

    const searchReview = async () => {
        await setIsLoading(true);

        setIsLoading(true);
        const response = await myReview({reviewTargetId:userInfo.userId});
        if(response instanceof CustomError){
            enqueueSnackbar(response.message, {variant: 'error'});
            return;
        }

        setReviewData(response.reviews);
        setIsLoading(false);
    };

  return (

    <MainCard darkTitle={true} title={'마이 리뷰'}>
       <Grid
            container
            direction="row"
            justifyContent="flex-end"
            spacing={2}>
                <Select
                    value={role}
                    defaultValue={"ALL"}
                    onChange={(e)=>{
                        setRole(e.target.value)
                    }}
                >
                    <MenuItem value={"ALL"}>전체</MenuItem>
                    <MenuItem value={ROLE.DRIVER}>운전자</MenuItem>
                    <MenuItem value={ROLE.CARPOOLER}>카풀러</MenuItem>
                </Select>
        </Grid>
        <DataTable columns={columns} rows={data} rowsPerPageOptions={[10,20,30]} isLoading={isLoading}/>
    </MainCard>
  );
}

const columns = [
    // {
    //     id: 'id',
    //     label: 'No.',
    //     width: 50,
    //     align: 'center',
    // },
    {
        id: 'targetRole',
        label: '역할',
        width: 60,
        align: 'center',
        render: (row)=>{
            return <>
                {
                    row.targetRole==ROLE.DRIVER ? "운전자" : "카풀러"
                }
            </>
        }
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