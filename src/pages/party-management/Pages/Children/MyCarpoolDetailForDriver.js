import * as React from 'react';
import { styled } from '@mui/material/styles';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AjaxUtils from 'utils/AjaxUtils';
import { ConvertToYYYYMMDDhhmmtoKor} from '../../Utils/DateUtils';
import EmptyList from './EmptyList';
import { Button, Stack, Box, Grid,Typography, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import ComponentSkeleton from '../../../components-overview/ComponentSkeleton';
import MainCard from '../../../../components/MainCard';

import PropTypes from 'prop-types';
import AnimateButton from '../../../../components/@extended/AnimateButton';
import {Demo,Item,Subtitle,ListBgColor,ListStatusDesc} from '../../Utils/ComponentTheme';
import {useSelector} from "react-redux";
import {useState} from "react";
import {checkPayment, requestPayment} from "../../../../api/partymanagement";
import CustomError from "../../../../utils/CustomError";
import {useSnackbar} from "notistack";
import PaymentCheckButtonForCarpooler from "./PaymentCheckButtonForCarpooler";
import PaymentCheckButtonForDriver from "./PaymentCheckButtonForDriver";

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
const MyCarpoolDetailForDriver = ({partyInfo}) => {
  console.log('MY Sub partyInfo', partyInfo)

      return (
      <>

        <Grid item xs={12}>
              <MainCard title="지불요금" >
                  <Grid container spacing={3} wrap="nowrap">
                      <Grid item xs={12} sm={12} md={12} lg={12} >
                        <Demo>
                          <Stack direction="row" spacing={2}>
                            <Typography>금액</Typography>
                            <Typography>{partyInfo.moveInfo.price}원 ({partyInfo.curNumberOfParty}명) </Typography>
                            <Typography>=&gt; {partyInfo.moveInfo.price/partyInfo.curNumberOfParty}원</Typography>
                          </Stack>
                        </Demo>
                      </Grid>
                  </Grid>
              </MainCard>

          </Grid>

        <Grid item xs={12}>
            <MainCard title="정산내역" >
                <Grid>
                  <Demo>
                  {
                      partyInfo.carPooler.map((p,index)=>
                      <Grid container justifyContent="flex-start" key={index}>
                          <Grid item xs={2} sm={2} md={2} ><Item sx={{ boxShadow:0}}><Subtitle sx={InputTitle}>{p.name}</Subtitle></Item></Grid>
                          <Grid justifyContent="flex-start"><Item sx={{ boxShadow:0}}>
                              <PaymentCheckButtonForDriver
                                  carpoolerCheck={p.carpoolerCheck}
                                  driverCheck={p.driverCheck}
                                  partyId={partyInfo.id}
                                  carpoolerId={p.userId}
                              />
                          </Item></Grid>
                      </Grid>
                      )
                  }
                  </Demo>
                </Grid>
            </MainCard>
        </Grid>
      </>
      );
};
export default MyCarpoolDetailForDriver;
