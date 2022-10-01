import * as React from 'react';
import { Link, useHistory} from 'react-router-dom';
import MainCard from 'components/MainCard';
import {makeStyles} from '@material-ui/core/styles';
import { Box, ThemeProvider, createTheme } from '@mui/system';
import { Breadcrumbs, Divider, Grid, Stack, Typography, Button, Card, CardActionArea, CardContent} from '@mui/material';
import {useSelector} from "react-redux";

const theme = createTheme({
  palette: {
    background: {
        primary: '#03a9f4',
        secondary: '#ff9800',
    },
    text: {
      primary: '#FFF',
      secondary: '#46505A',
    },
    action: {
      active: '#001E3C',
    },
    success: {
      dark: '#009688',
    },
  },
});

const driverCard =(isDriver)=>{
    return (
        <>
            <CardActionArea disabled={!isDriver} component={Link} to="/create-party" state={{ type:"driver"}}>
                <CardContent>
                    <Typography variant="h3" align="center" sx={{color:'white'}}>
                        운전자
                    </Typography>
                </CardContent>
            </CardActionArea>
        </>
    );
}
const carpoolerCard = (
    <>
        <CardActionArea component={Link} to="/select-carpool-list" state={{ type:"carpooler"}}>
        <CardContent>
            <Typography variant="h3" align="center" sx={{color:'white'}}>
                카풀러
            </Typography>
        </CardContent>
        </CardActionArea>
    </>
);


const SelectRole = () => {
    const userInfo   = useSelector(state =>  state.userInfo );
    return (
        <div style={{margin: 'auto'}}>
        <ThemeProvider theme={theme} >
            <Grid container justifyContent="center"
                    alignItems="center" spacing={6} align="center" justify="center"
                    sx={{ minHeight: { xs: 'calc(100vh - 100px)', md: 'calc(100vh - 100px)' } }}>
                <Grid xs={2}></Grid>
                <Grid xs={4} sm={4} md={4} lg={4}>
                    <Card sx={{
                        boxShadow: 1,
                        borderRadius: 2,
                        p: 11,
                        m: 2,
                        // margin:10,
                        // padding:0,
                        minHeight: { xs: 'calc(100vh-100px)', md: 'calc(100vh-100px)'  },
                        bgcolor: userInfo.driverYn=='Y' ? 'background.primary' : 'grey'
                        }} variant="outlined" >{driverCard(userInfo.driverYn=='Y')}</Card>
                </Grid>
                <Grid xs={4} sm={4} md={4} lg={4}>
                    <Card  sx={{
                        boxShadow: 1,
                        borderRadius: 2,
                        p: 11,
                        m: 2,
                        minHeight: { xs: 'calc(100vh-100px)', md: 'calc(100vh-100px)' },
                        // padding:0,
                        margin:5,
                        bgcolor:'background.secondary'
                        }} variant="outlined">{carpoolerCard}</Card>
                </Grid>
                <Grid xs={2}></Grid>
            </Grid>
            </ThemeProvider>
        </div>
    );
};

export default SelectRole;
