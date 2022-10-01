import * as React from 'react';
import { styled } from '@mui/material/styles';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { ConvertToYYYYMMDDhhmmtoKor} from '../Utils/DateUtils';
import EmptyList from './Children/EmptyList';
import {
    Button,
    Stack,
    Grid,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Box, CircularProgress
} from '@mui/material';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {Demo,Item,Subtitle,ListBgColor,ListStatusDesc} from '../Utils/ComponentTheme';
import { getPartyInfoPastMyNow } from 'api/partymanagement';
import isEmptyObj from '../Utils/BasicUtils';
import SearchModal from './Children/SearchPopup';
import dayjs from "dayjs";
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
const MyCarpoolPastList = () => {

  const userInfo   = useSelector(state =>  state.userInfo );
  const [query, setQuery] = React.useState({});
  const [post, setPost] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  function handleCloseModal(data) {
    console.log('부모에서 받은',data);
    setQuery({
      departure : data._departure,
      destination : data._destination,
      start_date : dayjs(data._dates).format("YYYY-MM-DD"),
      condition : data._condition
    });
  }
  React.useEffect(async ()=>{
      await getPartyInfos();
  },[query]);

  const getPartyInfos = async ()=>{
      await setIsLoading(true);

      const response = await getPartyInfoPastMyNow({
          user_id: userInfo.userId,
          ...query
      });
      let array = [];
      for(let index in response){
        array.push(response[index])
      }
      await setPost(!response.message ? array : []);
      await setIsLoading(false);
  }
  const isEmpty = isEmptyObj(post)||(post.length === 0);

  const goReview=(party)=>{
      navigate(`/review-select`, {state: {party: party}})
  }
  const goAccusation=(party)=>{
      navigate(`/register-accusation/parties`, {state: {partyId: party.id}})
  }


  if(!isLoading && isEmpty){
    return (
    <>
      <Grid item xs={12} md={6}>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h3" component="div">
            지난 카풀 내역
        <ManageSearchIcon fontSize="large" sx={{ float: 'right', m:2 }}></ManageSearchIcon>
        </Typography>
        <EmptyList/>
      </Grid>
    </>
    )
  }
  else
  {
  return (
      <>
      <Grid item xs={12} md={6}>
          <Typography sx={{ mt: 4, mb: 2 }} variant="h3" component="div">
          지난 카풀 내역
          {/* <ManageSearchIcon fontSize="large" sx={{ float: 'right', m:2 }}></ManageSearchIcon> */}
          <SearchModal
                onCloseModal={handleCloseModal}
              />
        </Typography>
        <List>
        <Demo>
        {isLoading?
            <Box sx={{py: 3, minHeight: 560, alignContent: 'center'}}>
                <CircularProgress />
            </Box>
            :
          post.map((p, index)=>
            <ListItem sx={{m:3,bgcolor:ListBgColor[p.status], width:'95%'}} key={index} >

            <ListItemAvatar sx={{m:2, width:'10%', textAlign:'center',justifyContent: "center"}}>
              <Avatar sx ={{ width: 80, height: 80}}>
                <BeachAccessIcon />
              </Avatar>
              <ListItemText primary={`${p.driver.name}Manager`} />
            </ListItemAvatar>
                <Link to={`/party-matching/${p.id}`}
                      style={{ textDecoration: 'none' }}
                      state={{
                          type:'past',
                          data:p
                      }}>
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
                      {p.curNumberOfParty} / {p.maxNumberOfParty} 명
                    </Typography>
                    </Item>
                    <Item sx={{fontSize:'1em', color:'#d11', fontWeight:'bold', boxShadow:0}}>
                      {ListStatusDesc[p.status]}
                    </Item>
                    <Item sx={{fontSize:'1em', color:'#1cd', fontWeight:'bold', boxShadow:0}}>
                        [ {p.driver.userId=== userInfo.userId?'운전자':'카풀러'} ]
                    </Item>
                  </Stack>
                </Paper>
                </Grid>
                <Grid item xs={1.5} sm={1.5} md={1.5} ><Subtitle sx={InputTitle}>출발지</Subtitle> </Grid>
                <Grid item xs={2.5} sm={2.5} md={2.5} ><Item>{p.moveInfo.placeOfDeparture}</Item></Grid>
                <Grid item xs={1.5} sm={1.5} md={1.5} ><Subtitle sx={InputTitle}>출발시간</Subtitle></Grid>
                <Grid item xs={2.5} sm={2.5} md={2.5} ><Item>{ConvertToYYYYMMDDhhmmtoKor(p.moveInfo.startDate)}</Item></Grid>
                <Grid item xs={1.5} sm={1.5} md={1.5} ><Subtitle sx={InputTitle}>차종</Subtitle></Grid>
                <Grid item xs={2.5} sm={2.5} md={2.5} ><Item>{p.driver.carKind}</Item> </Grid>
                <Grid item xs={1.5} sm={1.5} md={1.5} ><Subtitle sx={InputTitle}>도착지</Subtitle></Grid>
                <Grid item xs={2.5} sm={2.5} md={2.5} ><Item>{p.moveInfo.destination}</Item></Grid>
                <Grid item xs={1.5} sm={1.5} md={1.5} ><Subtitle sx={InputTitle}>거리</Subtitle></Grid>
                <Grid item xs={2.5} sm={2.5} md={2.5} ><Item>{p.moveInfo.distance}</Item></Grid>
                <Grid item xs={1.5} sm={1.5} md={1.5} ><Subtitle sx={InputTitle}>차번호</Subtitle></Grid>
                <Grid item xs={2.5} sm={2.5} md={2.5} ><Item>{p.driver.carNumber}</Item></Grid>
            </Grid>
            </Link>
            <Grid item xs={12} sm={12} md ={12} sx={{border:0, boxShadow:0}}>
              <Item spacing={2} sx={{border:0, boxShadow:0, bgcolor:ListBgColor[p.status]}}>
                <Button variant="contained" color="primary" sx={{m:1}} onClick={()=>goReview(p)}>리뷰하기</Button>
                <Button variant="contained" color="error" sx={{m:1}} onClick={()=>goAccusation(p)}>신고하기</Button>
              </Item>
            </Grid>
          </ListItem>
          )
        }
  </Demo>
  </List>
  </Grid>

      </>
  );
  }
};
export default MyCarpoolPastList;
