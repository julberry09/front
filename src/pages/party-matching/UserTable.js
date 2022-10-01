import React from 'react';

import {acceptMatch, denyMatch, getMatchUsers} from 'api/partyMatching';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    Avatar,
    Grid,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemSecondaryAction,
    ListItemText,
    Stack,
    Typography
} from '@mui/material';

import { GiftOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';
import avatar1 from 'assets/images/users/avatar-1.png';
import {LoadingButton} from "@mui/lab";
import CustomError from "../../utils/CustomError";
import {useSnackbar} from "notistack";

const UserTable = ({userName, userTeam, userPhoto, scoreAvg, comment, isWaitingMembers=false, matchProcess={}}) => {

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [isLoading, setIsLoading]=useState(false);

    const acceptMember = async(userId)=>{
        setIsLoading(true)
        const response = await acceptMatch(matchProcess)
        if(response instanceof CustomError){
            enqueueSnackbar(response.message, {variant: 'error'});
            return;
        }
        enqueueSnackbar('신청을 수락하였습니다.', {variant: 'success'});
        setIsLoading(false)
        window.location.reload()
    }
    const denyMember=async (userId)=>{
        setIsLoading(true)
        const response = await denyMatch(matchProcess)
        if(response instanceof CustomError){
            enqueueSnackbar(response.message, {variant: 'error'});
            return;
        }
        enqueueSnackbar('신청을 거절하였습니다.', {variant: 'warning'});
        setIsLoading(false)
        window.location.reload()

    }

    // //Todo 변경
    // const goReviewDetail = () => {
    //     // const userId = params.userId;
    //     // navigate('/party-matching'); //주소 변경
    // };

    return (
        <ListItemButton
            divider
            // onClick={(e) => {
            //     goReviewDetail();
            // }}
        >
            <ListItemAvatar>
                <Avatar src={userPhoto} />
            </ListItemAvatar>
            <ListItemText primary={<Typography variant="subtitle1">{userName}</Typography>} secondary={userTeam} />
            <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                    <Typography variant="subtitle1" noWrap>
                        {`평점 : ${scoreAvg ? Math.round(scoreAvg*10)/10 : 0}`}
                    </Typography>
                    <Typography variant="h6" color="secondary" noWrap>
                        {`최근 코멘트: ${comment ? comment : '-'}`}
                    </Typography>
                    {isWaitingMembers ?
                        <Grid direction="row" alignItems="flex-end" spacing={1}>
                            <LoadingButton
                                variant="contained"
                                style={{margin: 1}}
                                loading={isLoading}
                                onClick={()=>acceptMember()}
                            >
                                수락
                            </LoadingButton>
                            <LoadingButton
                                variant="contained"
                                style={{margin: 1}}
                                onClick={denyMember}
                                loading={isLoading}
                                color="error">
                                거절
                            </LoadingButton>
                        </Grid>
                        :<></>
                    }
                </Stack>
            </ListItemSecondaryAction>
        </ListItemButton>
    );
};

export default UserTable;
