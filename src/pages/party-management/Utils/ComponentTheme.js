import { styled } from '@mui/material/styles';
import { Button, Stack, Box, Grid,Typography, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
export const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    padding:15
  }));

export const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    //...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    fontSize : '80%'
  }));
export const Subtitle = styled(Paper)(({ theme }) => ({
    backgroundColor: '#1A2027',
    // padding: theme.spacing(1),
    textAlign: 'center',
    fontSize:'100%',
    color:'#fff'
  }));

export  const ListBgColor = {
    OPEN : '#0080FF',
    FULL : '#FF4000',
    STARTED : '#FACC2E',
    CLOSED : '#626262'
  }

export const ListStatusDesc = {
    OPEN : '신청 가능',
    FULL : '신청 마감',
    STARTED : '카풀 진행 중',
    CLOSED : '종료'
  }
