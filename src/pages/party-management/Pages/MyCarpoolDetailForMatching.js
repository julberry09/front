import * as React from 'react';
import { styled } from '@mui/material/styles';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AjaxUtils from 'utils/AjaxUtils';
import { ConvertToYYYYMMDDhhmmsstoKor, ConvertToYYYYMMDDhhmmtoKor} from '../Utils/DateUtils';
import EmptyList from './Children/EmptyList';
import { Button, Stack, Box, Grid,Typography, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import ComponentSkeleton from '../../components-overview/ComponentSkeleton';
import MainCard from '../../../components/MainCard';
import queryString from'query-string';
import PropTypes from 'prop-types';
import AnimateButton from '../../../components/@extended/AnimateButton';
import MyCarpoolDetailForCarpooler from './Children/MyCarpoolDetailForCarpooler';
import MyCarpoolDetailForDriver from './Children/MyCarpoolDetailForDriver';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { getPartyInfo } from 'api/partymanagement';
import {Demo,Item,Subtitle,ListBgColor,ListStatusDesc} from '../Utils/ComponentTheme';
import {useSelector} from "react-redux";

const InputTitle = {
  backgroundColor: '#1A2027',
  padding: '2px',
  textAlign: 'center',
  color:'#fff',
  justifyContent: 'center',
  alignItems: 'center',
  height: '35px',
  border: '2px solid #1A2027',
  borderRadius:1,
  boxShadow: 10
}
function ShadowBox({ shadow }) {
    return (
        <MainCard border={false} sx={{ boxShadow: shadow }}>
            <Stack spacing={1} justifyContent="center" alignItems="center">
                <Typography variant="h6">boxShadow</Typography>
                <Typography variant="subtitle1">{shadow}</Typography>
            </Stack>
        </MainCard>
    );
}

ShadowBox.propTypes = {
    shadow: PropTypes.string.isRequired
};



const MyCarpoolDetailForMatching = (props) => {


  const location=useLocation();
  const [query, setQuery] = React.useState({id:0});
  const [post, setPost] = React.useState(location.state.data);
  //const { type, isDriver } = queryString.parse(location.search);

  const userInfo   = useSelector(state =>  state.userInfo );
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = React.useState(false);
  const partyId = location.state.data.id;
  function isInParty(carpooler) {
    return carpooler.userId === userInfo.userId
  }
  console.log('post:',post);


    const type = location.state.type
    const isDriver = (location.state.data.driver.userId === userInfo.userId); //여기에 나중에 user id랑 비교
    const canApply = (location.state.data.curNumberOfParty <location.state.data.maxNumberOfParty)
                      && (location.state.data.status ==='OPEN')
                      && !isDriver
                      && (location.state.data.carPooler.find(carpoolers=>isInParty(carpoolers))===undefined);
     console.log(location);
     console.log("isDriver:",isDriver);
     console.log('canApply:',canApply);

     const applyParty = ()=>{
         navigate(`/party-matching/${partyId}`)
     }
      return (
      <>
        <Grid item xs={12} md={6}>
          <Typography sx={{ mt: 4, mb: 2 }} variant="h3" component="div">
          { (type !== 'past') ? '진행 중인 카풀':'지난 카풀 내역'}
          {/* <ManageSearchIcon fontSize="large" sx={{ float: 'right', m:2 }}></ManageSearchIcon> */}
          </Typography>
        </Grid>

        <ComponentSkeleton>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <MainCard title="카풀 파티 정보">
                    <ListItem sx={{m:3,bgcolor:'#eee', width:'95%'}} value={0} onClick={(e) => setQuery(e.target.value)}>
                        <Grid container spacing={{ xs: 2, md: 1 }} columns={{ xs: 12, sm:12,md:12}}>
                        <Grid item xs={12} sm={12} md={12} >
                            <Paper
                                sx={{
                                margin: 'auto',
                                maxWidth: '100%',
                                flexGrow: 1,
                                backgroundColor: (theme) =>
                                    theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                                }}
                            >
                                <Stack direction="row" spacing={2}>
                                <Subtitle sx={{width:'12%',p:1}}>파티상태</Subtitle>
                                <Item sx={{boxShadow:0}}>
                                <Typography variant="h6" noWrap sx={{boxShadow:0}}>
                                  {post.curNumberOfParty} / {post.maxNumberOfParty} 명
                                </Typography>
                                </Item>
                                <Item sx={{fontSize:'1em', color:'#d11', fontWeight:'bold', boxShadow:0}}>
                                  {ListStatusDesc[post.status]}
                                </Item>
                                <Item sx={{fontSize:'1em', color:'#1cd', fontWeight:'bold', boxShadow:0}}>
                                  [ {isDriver?'운전자':'카풀러'} ]
                                </Item>
                                </Stack>
                            </Paper>
                            </Grid>
                            <Grid item xs={1.5} sm={1.5} md={1.5} ><Subtitle sx={InputTitle}>출발지</Subtitle> </Grid>
                            <Grid item xs={2.5} sm={2.5} md={2.5} ><Item>{post.moveInfo.placeOfDeparture}</Item></Grid>
                            <Grid item xs={1.5} sm={1.5} md={1.5} ><Subtitle sx={InputTitle}>출발시간</Subtitle></Grid>
                            <Grid item xs={2.5} sm={2.5} md={2.5} ><Item>{ConvertToYYYYMMDDhhmmsstoKor(post.moveInfo.startDate)}</Item></Grid>
                            <Grid item xs={1.5} sm={1.5} md={1.5} ><Subtitle sx={InputTitle}>차종</Subtitle></Grid>
                            <Grid item xs={2.5} sm={2.5} md={2.5} ><Item>{post.driver.carKind}</Item> </Grid>
                            <Grid item xs={1.5} sm={1.5} md={1.5} ><Subtitle sx={InputTitle}>도착지</Subtitle></Grid>
                            <Grid item xs={2.5} sm={2.5} md={2.5} ><Item>{post.moveInfo.destination}</Item></Grid>
                            <Grid item xs={1.5} sm={1.5} md={1.5} ><Subtitle sx={InputTitle}>거리</Subtitle></Grid>
                            <Grid item xs={2.5} sm={2.5} md={2.5} ><Item>{post.moveInfo.distance}</Item></Grid>
                            <Grid item xs={1.5} sm={1.5} md={1.5} ><Subtitle sx={InputTitle}>차번호</Subtitle></Grid>
                            <Grid item xs={2.5} sm={2.5} md={2.5} ><Item>{post.driver.carNumber}</Item></Grid>

                        </Grid>
                        </ListItem>

                    <Box sx={{m:3,p:3,bgcolor:'#eee'}}>
                        <Stack direction="row" spacing={2} justifyContent="center">
                        {
                          post.carPooler.map((p,index)=>

                          <ListItemAvatar key={index} sx={{textAlign:'center',justifyContent: "center"}}>
                            <Avatar alt={p.name} sx ={{ width: 60, height: 60}} src={p.profileImage}>

                            </Avatar>
                          <ListItemText primary={p.name}/>
                          </ListItemAvatar>
                          )
                        }
                        </Stack>
                    </Box>
                    {(canApply)?
                    <Grid item xs={12} sx={{textAlign:"center"}}>
                      {/* <Link to="/modify-carpool-detail"
                        style={{ textDecoration: 'none' }}
                        state={{ data:post}}>
                        <Button size="small" variant="contained" color="primary" align="center">삭제하기</Button>
                      </Link> */}
                      <Button size="small" variant="contained" color="error" align="center" onClick={applyParty}>파티신청하기</Button>
                     </Grid>
                    :<br/>
                    }
                    </MainCard>

                </Grid>


            </Grid>
        </ComponentSkeleton>
      </>
      );
};
export default MyCarpoolDetailForMatching;
