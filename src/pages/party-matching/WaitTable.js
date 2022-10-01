import React from 'react';

import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getMatchUsers,
  acceptMatch,
  denyMatch,
} from 'api/partyMatching';

import {
  Avatar,
  Grid,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  ListItem,
  Stack,
  Button,
  Typography,
} from '@mui/material';

import {
  GiftOutlined,
  MessageOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import avatar1 from 'assets/images/users/avatar-1.png';

const UserTable = (props) => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const goReviewDetail = (params, e) => {
    const userId = params.userId;
    navigate('/party-matching'); //주소 변경
  };

  // const nameList = userInfo && userInfo.map((name) => <UserTable userId={name.userId} />);

  const btnAccept = async () => {
    const data = {
      partyInfoId: 2,
      driverId: 'driver1234',
      userId: 'lee5678',
    };

    const acceptResult = await acceptMatch(data);
  };

  const btnDeny = async () => {
    const data = {
      partyInfoId: 2,
      driverId: 'driver1234',
      userId: 'lee1234',
    };

    const denyResult = await denyMatch(data);
  };

  return (
    <ListItemButton
      divider
      onClick={(e) => {
        goReviewDetail(props, e);
      }}
    >
      <ListItemAvatar>
        <Avatar alt="curp" src={avatar1} />
      </ListItemAvatar>
      <ListItemText
        primary={<Typography variant="subtitle1">{props.userId}</Typography>}
        secondary={props.userTeamName}
      />
      <ListItemSecondaryAction>
        <Stack alignItems="flex-end">
          <Typography variant="subtitle1" noWrap>
            {props.content}
          </Typography>
          <Typography variant="h6" color="secondary" noWrap>
            {props.reviewScore}
          </Typography>
        </Stack>
        <ListItem justifyContent="center">
          <Button
            size="small"
            variant="outlined"
            style={{ width: '50px' }}
            onClick={btnAccept}
          >
            수락
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            style={{ width: '50px', margin: '0px 0px 0px 10px' }}
            onClick={btnDeny}
          >
            거절
          </Button>
        </ListItem>
      </ListItemSecondaryAction>
    </ListItemButton>
  );
};

export default UserTable;
