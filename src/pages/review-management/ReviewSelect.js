import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {CardActionArea, CircularProgress} from '@mui/material';

import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-1.png';
import avatar3 from 'assets/images/users/avatar-1.png';
import avatar4 from 'assets/images/users/avatar-1.png';


import {Link, useLocation, useNavigate, useParams} from 'react-router-dom';
import { Box } from '../../../node_modules/@material-ui/core/index';
import MainCard from '../../components/MainCard';

import Grid from '@mui/material/Unstable_Grid2';
import {useEffect, useState} from "react";
import {getPartyMember, isReviewed} from "../../api/review";
import CustomError from "../../utils/CustomError";
import {useSnackbar} from "notistack";
import {useSelector} from "react-redux";

// const driverCard = (
//   <Card sx={{ maxWidth: 200 }}>
//     <CardActionArea>
//       <CardMedia component="img" height="200" src={avatar1} />
//       <CardContent>
//         <Typography align="center" gutterBottom variant="h5" component="div">
//           운전자
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           부서
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           이름
//         </Typography>
//       </CardContent>
//     </CardActionArea>
//   </Card>
// );

const ReviewSelect = ()=> {

  const {id} = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo   = useSelector(state =>  state.userInfo );

  const [memberList, setMemberList] = useState([]);
  const [party, setParty]= useState('');
  const [isLoading, setIsLoading]=useState(false);


  useEffect(async ()=>{
    setParty(location.state.party);
    setIsLoading(true);
    const response = await getPartyMember({partyInfoId: location.state.party.id});
    if(response instanceof CustomError){
      enqueueSnackbar(response.message, {variant: 'error'});
    } else {
      setMemberList(response)
    }
    setIsLoading(false);
  },[])

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

  const goPostReview= async (member)=>{
    if(member.userId!=userInfo.userId){
      setIsLoading(true);
      const response = await isReviewed({
        targetId: member.userId,
        partyId: party.id
      })
      if(response instanceof CustomError){
        enqueueSnackbar(response.message, {variant: 'error'});
      } else {
        if(!response) {
          navigate(`/review-register`, {
            state: {
              member: member,
              party: party
            }
          })
        }else{
          enqueueSnackbar('이미 리뷰하였습니다..', {variant: 'warning'});
        }
        setIsLoading(false);
      }
    }else{
      enqueueSnackbar('자신을 리뷰할 수 없습니다.', {variant: 'warning'});
    }
  }

  return (
    <MainCard darkTitle={true} title={'리뷰대상 선택하기'}>
      {isLoading ?
          <Box sx={{py: 3, minHeight: 150, alignContent: 'center'}}>
            <CircularProgress/>
          </Box> :
          <Grid container display="flex">
            {memberList &&
                memberList.map((member) =>
                    <Grid xs>
                      <Card sx={{maxWidth: 200}}>
                        <CardActionArea onClick={() => goPostReview(member)}>
                          <CardMedia component="img" height="200"
                                     src={makePhoto(member.userPhoto, member.fileExtension)}/>
                          <CardContent style={{background: member.userId == userInfo.userId ? 'alpha' : '#D1DFE8'}}>
                            <Typography
                                align="center"
                                gutterBottom
                                variant="h4"
                                component="div"
                            >
                              {party.driver.userId == member.userId ? '운전자' : '카풀러'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {`부서: ${member.userTeamName}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {`이름: ${member.userName}`}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                )
            }
          </Grid>
      }
    </MainCard>
  );
}

export default ReviewSelect;
