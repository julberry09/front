import * as React from 'react';
import MainCard from 'components/MainCard';
import { Stack, Grid, Typography } from '@mui/material';;

const EmptyList = () => {
    return (
        <>
          <MainCard sx={{ mt: 12 }}>
              <Stack spacing={3}>
                  <Grid container justifyContent="space-between" alignItems="center">
                      <Grid item>
                          <Stack>
                              <Typography variant="h5" noWrap>
                                  내역이 존재하지 않습니다.
                              </Typography>
                          </Stack>
                      </Grid>
                  </Grid>
              </Stack>
          </MainCard>
        </>
    );
};
export default EmptyList;
