import * as React from 'react';
import { styled } from '@mui/material/styles';
import {ImageIcon, WorkIcon, BeachAccessIcon, ManageSearchIcon} from '@mui/icons-material/Work';
import AjaxUtils from 'utils/AjaxUtils';
import { ConvertToYYYYMMDDhhmmtoKor} from '../../Utils/DateUtils';
import EmptyList from './EmptyList';
import { Button, Stack, Box, Grid,Typography, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import ComponentSkeleton from '../../../components-overview/ComponentSkeleton';
import MainCard from '../../../../components/MainCard';
import PropTypes from 'prop-types';
import AnimateButton from '../../../../components/@extended/AnimateButton';
import {Demo,Item,Subtitle,ListBgColor,ListStatusDesc} from '../../Utils/ComponentTheme';
import {PAY_CHECK} from "../../../../utils/constants";
import PaymentCheckButtonForCarpooler from "./PaymentCheckButtonForCarpooler";
import {useSelector} from "react-redux";
import {useState} from "react";
import {requestPayment} from "../../../../api/partymanagement";
import CustomError from "../../../../utils/CustomError";
import {useSnackbar} from "notistack";
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
    boxShadow: 10,
    fontSize:"120%"
  }
  const MyCarpoolDetailForCarpooler = ({partyInfo}) => {

      console.log('MY Sub partyInfo',partyInfo)
      const userInfo   = useSelector(state =>  state.userInfo );
      const carpooler = partyInfo.carPooler.find(o=>o.userId==userInfo.userId)
      console.log(carpooler)
      const [isLoading, setIsLoading] = useState(false);
      const { enqueueSnackbar } = useSnackbar();

      const requestPayCheckClick=async ()=>{
          setIsLoading(true);
          const response = await requestPayment({
              partyId: partyInfo.id,
              carpoolerId: carpooler.userId
          })

          if(response instanceof CustomError){
              enqueueSnackbar(response.message, {variant: 'error'});
          }else{
              enqueueSnackbar('정산 요청 확인 신청되었습니다.', {variant: 'success'});
              window.location.reload()
          }
          setIsLoading(false);
      }

      return (
      <>
       <Grid item xs={12}>
            <MainCard title="운전자 Pay URL" >
                <Grid container spacing={3} wrap="nowrap">
                    <Grid item xs={6} sm={4} md={3} lg={2} >
                        <Button variant="contained" color="warning" size="small" onClick={()=>window.open(partyInfo.driver.settlementUrl)}>
                            Kakao Pay Url
                        </Button>
                    </Grid>
                </Grid>
            </MainCard>
        </Grid>
        <Grid item xs={12}>
            <MainCard title="정산내역" >
                {
                    // post.carPooler.filter(userId='');
                <Grid>
                    <Grid container justifyContent="start">
                        <Grid item xs={2} sm={2} md={2} ><Item sx={{ boxShadow:0}}><Subtitle sx={InputTitle}>지불요금</Subtitle></Item></Grid>

                        <Typography style={{textAlign:'center',fontSize:'15px', fontWeight:'bold', marginTop:13}}>{partyInfo.moveInfo.price}원 ({partyInfo.curNumberOfParty}명) =&gt; {partyInfo.moveInfo.price/partyInfo.curNumberOfParty}원</Typography>

                        <Grid item xs={2} sm={2} md={2} ><Item sx={{ boxShadow:0}}>
                            <PaymentCheckButtonForCarpooler
                                carpoolerCheck={carpooler.carpoolerCheck}
                                driverCheck={carpooler.driverCheck}
                                isLoading={isLoading}
                                requestPayCheckClick={requestPayCheckClick}/>
                        </Item></Grid>
                    </Grid>
                </Grid>
                }
            </MainCard>
        </Grid>
      </>
      );
};
export default MyCarpoolDetailForCarpooler;
