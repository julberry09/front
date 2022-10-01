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
import {Link, useLocation,useNavigate} from 'react-router-dom';
import { deleteMoveInfo, getPartyInfo } from 'api/partymanagement';
import {Demo,Item,Subtitle,ListBgColor,ListStatusDesc} from '../Utils/ComponentTheme';
import CustomError from 'utils/CustomError';
import DeleteCheckModal from 'components/@extended/DeleteCheckModal';
import { useSnackbar } from 'notistack';
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

function DetailSubInfo(props) {
    const isDriver = props.isDriver;
    const status = props.posts.status;
    console.log('isDriver:',isDriver);
    if (isDriver) {
      // if(status==='STARTED'){
      //   return <MyCarpoolDetailForDriver posts={props.posts}/>;
      // }else{
      //   return <></>
      // }
      return <MyCarpoolDetailForDriver posts={props.posts}/>;
    }
    else return <MyCarpoolDetailForCarpooler posts={props.posts}/>;
  }

const MyCarpoolDetail = (props) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const location=useLocation();
  const [query, setQuery] = React.useState({id:0});
  const [post, setPost] = React.useState(location.state.data);
  //const { type, isDriver } = queryString.parse(location.search);
  const userInfo   = useSelector(state =>  state.userInfo );

  console.log('location',location);
  console.log('location data :',location.state.data);
  console.log('location type :',location.state.type);

  const [isLoading, setIsLoading] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const partyId = location.state.data.id;
  console.log('post:',post);

  const onDeleteConfirm = async () => {
    const response = await deleteMoveInfo({partyId});
    console.log(response);
    if(response instanceof CustomError){
      enqueueSnackbar(response.message, {variant: 'error'});
    } else {
      enqueueSnackbar('운전정보가 삭제되었습니다.', {variant: 'success'});
      navigate(`/my-carpool-list`);
    }
  }
  const onDeleteCheckClick=()=>{
    setDeleteModalOpen(true);
  }
  const onDeleteCancel = ()=>{
    setDeleteModalOpen(false);
  }

    const type = location.state.type //지금 테스트 1은 운전자, 2는 카풀러
    const isDriver = (location.state.data.driver.userId === userInfo.userId); //여기에 나중에 user id랑 비교
    const canDelete = (location.state.data.curNumberOfParty === 1) && (location.state.data.status ==='OPEN'); //여기에 나중에 user id랑 비교
    console.log("isDriver:",isDriver);
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
                    {(canDelete)?
                    <Grid item xs={12} sx={{textAlign:"center"}}>
                      <Button size="small" variant="contained" color="error" align="center" onClick={onDeleteCheckClick}>삭제하기</Button>
                      <DeleteCheckModal modalOpen={deleteModalOpen}
                          onCancel={onDeleteCancel}
                          onOk={onDeleteConfirm}/>
                     </Grid>
                    :<br/>
                    }
                    </MainCard>

                </Grid>

                <DetailSubInfo isDriver={isDriver} posts={post}/>

            </Grid>
        </ComponentSkeleton>
      </>
      );
};
export default MyCarpoolDetail;
