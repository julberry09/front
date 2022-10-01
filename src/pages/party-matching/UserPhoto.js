import React, {useEffect, useState} from 'react';

import {
    Avatar,
    Grid,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemSecondaryAction,
    ListItemText,
    Stack,
    Typography
} from '@mui/material';

import { GiftOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';
import avatar1 from 'assets/images/users/avatar-1.png';

const UserPhoto = ({userId, userName, userTeam, userPhoto, fileExtension, isDriver = false}) => {

    const [userImage, setUserImage] = useState(null);

    useEffect(()=>{
        if(userPhoto && fileExtension){
            const str1='data:image/';
            const str2=fileExtension;;
            const str3=';base64,';
            const str4=userPhoto;
            setUserImage(str1+str2+str3+str4);
        }
    },[])

    return (<>
            <Grid container direction="column" alignItems="center" justifyContent="center">
                <Avatar key={userId} src={userImage} style={{borderColor: isDriver? 'red' : 'alpha', width:100, height:100}}/>

                <Typography variant="h5" >{userName}</Typography>
                <Typography variant="h6" >{userTeam}</Typography>
            </Grid>
    </>
    )
};

export default UserPhoto;
