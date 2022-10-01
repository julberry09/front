import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSnackbar} from 'notistack';
import {
  getReviewInfo,
  getUserInfo,
  getWaitingAndAcceptMembers
} from 'api/partyMatching';
import UserTable from 'pages/party-matching/UserTable';
import _ from 'lodash';

// material-ui
import {
  Avatar, Box, Button, CircularProgress,
  Grid,
  List,
  Typography,
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';

// assets
import {useLocation, useParams} from "react-router-dom";
import CustomError from "../../utils/CustomError";
import {useSelector} from "react-redux";
import {PARTY_STATUS} from "../../utils/constants";

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem',
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none',
};

const columns = [
  {
    id: 'userId',
    label: '사용자명',
    width: 290,
    align: 'left',
  },
];

const PartyMemberList = () => {

  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const userInfo   = useSelector(state =>  state.userInfo );

  const partyInfo = location.state.partyInfo;

  // const [isLoading, setIsLoading] = useState(false);
  const [acceptMembers, setAcceptMembers] = useState(null);
  const [waitingMembers, setWaitingMembers]= useState(null);

  // useEffect(async () => {
  //   setIsLoading(true);
  //   const response = await getMatchUsers({partyInfoId: partyInfo.id});
  //   if(response instanceof CustomError){
  //     enqueueSnackbar(response.message, {variant: 'error'});
  //     return;
  //   }
  //   if(response.matchStatusMembers.FORMED && response.matchStatusMembers.ACCEPT){
  //     setAcceptMembers([...response.matchStatusMembers.FORMED, ...response.matchStatusMembers.ACCEPT])
  //   }else if(response.matchStatusMembers.FORMED && !response.matchStatusMembers.ACCEPT){
  //     setAcceptMembers([...response.matchStatusMembers.FORMED])
  //   }else if(!response.matchStatusMembers.FORMED && response.matchStatusMembers.ACCEPT){
  //     setAcceptMembers([...response.matchStatusMembers.ACCEPT])
  //   }else{
  //     setAcceptMembers([])
  //   }
  //
  //   if(response.matchStatusMembers.WAITING){
  //     setWaitingMembers([...response.matchStatusMembers.WAITING]);
  //   }else{
  //     setWaitingMembers([]);
  //   }
  //   setIsLoading(false);
  // }, []);

  const [matchInfos, setMatchInfos] = useState(null);
  const [userInfos, setUserInfos]= useState([]);
  const [reviewInfos, setReviewInfos]= useState([]);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isLoadingReview, setIsLoadingReview] = useState(false);

  useEffect(()=>{
    searchMembers();
  },[])
  useEffect(()=>{
    if(!matchInfos) return;

    const userIds = matchInfos.map(o=>o.userId);
    searchUserInfo(userIds);
    searchReviewInfo(userIds);
  },[matchInfos])

  useEffect(()=>{
    if(matchInfos==null) return;
    if(isLoadingUser || isLoadingReview) return;

    const result = _.chain(matchInfos)
                    .map(o=>{
                      return {
                        ...o,
                        ...userInfos.find(u=>o.userId==u.userId),
                        ...reviewInfos.find(r=>o.userId==r.userId)
                      }
                    })
        .groupBy("matchStatus")
        .value();

    if(result.FORMED && result.ACCEPT){
      setAcceptMembers([...result.FORMED, ...result.ACCEPT])
    }else if(result.FORMED && !result.ACCEPT){
      setAcceptMembers([...result.FORMED])
    }else if(!result.FORMED && result.ACCEPT){
      setAcceptMembers([...result.ACCEPT])
    }else{
      setAcceptMembers([])
    }

    if(result.WAITING){
      setWaitingMembers([...result.WAITING]);
    }else{
      setWaitingMembers([]);
    }

  },[userInfos, reviewInfos])

  const searchMembers= async ()=>{
    const response = await getWaitingAndAcceptMembers({partyInfoId: partyInfo.id});
    if(response instanceof CustomError){
      enqueueSnackbar(response.message, {variant: 'error'});
      return;
    }
    setMatchInfos(response);
  }
  const searchUserInfo = async (userIds)=>{
    setIsLoadingUser(true);
    const response = await getUserInfo({userIds : userIds.join(",")});
    if(response instanceof CustomError){
      enqueueSnackbar(response.message, {variant: 'error'});
      return;
    }
    setIsLoadingUser(false);
    setUserInfos(response);
  }
  const searchReviewInfo = async (userIds)=>{
    setIsLoadingReview(true);
    const response = await getReviewInfo({userIds : userIds.join(",")});
    if(response instanceof CustomError){
      enqueueSnackbar(response.message, {variant: 'error'});
      return;
    }
    setIsLoadingReview(false);
    setReviewInfos(response);
  }


  const makePhoto = (userPhoto, fileExtension)=>{
    if(userPhoto && fileExtension){
      const str1='data:image/';
      const str2=fileExtension;;
      const str3=';base64,';
      const str4=userPhoto;
      return str1+str2+str3+str4;
    }else{
      return null;
    }
  }

  return (
    <ComponentSkeleton>
      <Grid container spacing={3}>
        <Grid item sx={{ mt: 2 }}>
          <Typography variant="h5">파티 확정 멤버</Typography>
        </Grid>
        <Grid item xs={12}>
          {acceptMembers==null ?<>
              <Box sx={{py: 3, minHeight: 150, alignContent: 'center'}}>
                <CircularProgress/>
              </Box>
              </>:
              <MainCard content={false}>
                <List
                    component="nav"
                    sx={{
                      px: 0,
                      py: 0,
                      '& .MuiListItemButton-root': {
                        py: 1.5,
                        '& .MuiAvatar-root': avatarSX,
                        '& .MuiListItemSecondaryAction-root': {
                          ...actionSX,
                          position: 'relative',
                        },
                      },
                    }}
                >
                  {acceptMembers.length > 0 &&
                      acceptMembers.map((user) => (
                          <UserTable
                              userName={user.userName}
                              userTeam={user.userTeamName}
                              userPhoto={makePhoto(user.userPhoto, user.fileExtension)}
                              scoreAvg={user.scoreAvg}
                              comment={user.comment}
                          />
                      ))}
                </List>
              </MainCard>
          }
        </Grid>
      </Grid>

      {userInfo.userId==partyInfo.driver.userId && (partyInfo.status == PARTY_STATUS.OPEN || partyInfo.status == PARTY_STATUS.FULL) && <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item sx={{ mt: 2 }}>
          <Typography variant="h5">파티 요청 멤버</Typography>
        </Grid>
        <Grid item xs={12}>
          {waitingMembers==null ?
              <Box sx={{py: 3, minHeight: 150, alignContent: 'center'}}>
                <CircularProgress/>
              </Box> :
              <MainCard content={false}>
                <List
                    component="nav"
                    sx={{
                      px: 0,
                      py: 0,
                      '& .MuiListItemButton-root': {
                        py: 1.5,
                        '& .MuiAvatar-root': avatarSX,
                        '& .MuiListItemSecondaryAction-root': {
                          ...actionSX,
                          position: 'relative',
                        },
                      },
                    }}
                >
                  {waitingMembers.length > 0 &&
                      waitingMembers.map((user) => (
                          <UserTable
                              userName={user.userName}
                              userTeam={user.userTeamName}
                              userPhoto={makePhoto(user.userPhoto, user.fileExtension)}
                              scoreAvg={user.scoreAvg}
                              comment={user.comment}
                              isWaitingMembers={true}
                              matchProcess={{
                                partyInfoId:partyInfo.id,
                                driverId:partyInfo.driver.userId,
                                driverName:partyInfo.driver.name,
                                userId: user.userId
                              }}
                          />
                      ))}
                </List>
              </MainCard>
          }
        </Grid>
      </Grid>}
    </ComponentSkeleton>
  );
};

export default PartyMemberList;
