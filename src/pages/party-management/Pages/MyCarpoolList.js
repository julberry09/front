import { styled } from '@mui/material/styles';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { ConvertToYYYYMMDDhhmmtoKor} from '../Utils/DateUtils';
import EmptyList from './Children/EmptyList';
import {
  Stack,
  Box,
  Grid,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress
} from '@mui/material';
import { Link,useSearchParams,useLocation } from 'react-router-dom';
import { getPartyInfoMyNow } from 'api/partymanagement';
import isEmptyObj from '../Utils/BasicUtils';
import {Demo,Item,Subtitle,ListBgColor,ListStatusDesc} from '../Utils/ComponentTheme';
import SearchModal from './Children/SearchPopup';
import dayjs from "dayjs";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
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

const MyCarpoolList = () => {
  const userInfo   = useSelector(state =>  state.userInfo );
  const [query, setQuery] = useState({});
  const [post, setPost] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
//search 조건을 바꿔야함.
  function handleCloseModal(data) {
    console.log('부모에서 받은',data);

    setQuery({
      departure : data._departure,
      destination : data._destination,
      start_date : dayjs(data._dates).format("YYYY-MM-DD"),
      condition : data._condition
    });
  }
    useEffect(async ()=>{
        await getPartyInfos();
    },[query]);

    const getPartyInfos = async ()=>{
        await setIsLoading(true);
        const response = await getPartyInfoMyNow({
          user_id: userInfo.userId,
          ...query
        });
        console.log(response);
        let array = [];
        //for(let index in response.data){
        for(let index in response){
          array.push(response[index])
        }
        await setPost(!response.message ? array : []);
        await setIsLoading(false);
    }
    const isEmpty = isEmptyObj(post)||(post.length === 0);

    if(!isLoading && isEmpty){
      return (
      <>
        <Grid item xs={12} md={6}>
          <Typography sx={{ mt: 4, mb: 2 }} variant="h3" component="div">
          진행 중인 카풀
          {/* <ManageSearchIcon fontSize="large" sx={{ float: 'right', m:2 }}></ManageSearchIcon> */}
          <SearchModal/>
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
            진행 중인 카풀
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
            // post.partyInfoes.filter(p => (p.status === 'OPEN' || p.status ==='FULL' || p.status === 'STARTED') ).map((p, index)=>
            post.map((p, index)=>
            <ListItem sx={{m:3,bgcolor:ListBgColor[p.status], width:'95%'}} key={index} >
              {console.log("p:",p)}
              <ListItemAvatar sx={{m:2, width:'10%', textAlign:'center',justifyContent: "center"}}>
                <Avatar sx ={{ width: 80, height: 80}}>
                  <BeachAccessIcon />
                </Avatar>
                <ListItemText primary={`${p.driver.name}Manager`} />
              </ListItemAvatar>
              <Link to={`/party-matching/${p.id}`}
                    style={{ textDecoration: 'none' }}
                    state={{
                      type:'now',
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
                      {/*<Item sx={{fontSize:'1em', color:'#d11', fontWeight:'bold', boxShadow:0}}>*/}
                      {/*  {ListStatusDesc[p.status]}*/}
                      {/*</Item>*/}
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
export default MyCarpoolList;
