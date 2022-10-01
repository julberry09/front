import { useCallback, useEffect, useState } from 'react';
import { getPartyMembers } from 'api/accusation';
import {useLocation, useParams} from 'react-router-dom';
import MemberInfoTable from './components/MemberInfoTable';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Toolbar,
    Grid,
    Stack,
    Typography
} from '@mui/material';

const PartyMembers = () => {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const partyId = location.state.partyId
    const searchPartyMembers = useCallback(async () => {
        setIsLoading(true);
        
        const response = await getPartyMembers({ partyId });

        setData(!response.message ? response : []);
        setIsLoading(false);
    }, [partyId]);

    useEffect(() => {
        searchPartyMembers();
    }, [searchPartyMembers]);

    return (
        <>
            <Box>
                <Card style={{borderRadius: '8px'}}>
                    <Toolbar>
                        <Typography
                            sx={{ flex: '1 1 100%' }}
                            variant='h5'
                            id='tableTitle'
                            component='div'
                        >파티 정보</Typography>
                    </Toolbar>
                    <CardContent sx={{ mt: -1 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <Stack spacing={1}>
                                    <TextField
                                    id='outlined-read-only-input'
                                    label='출발지'
                                    value={data.placeOfDeparture || ''}
                                    InputProps={{readOnly: true}}/>
                                </Stack>
                            </Grid>
                            <Grid item xs={4}>
                                <Stack spacing={1}>
                                    <TextField
                                    id='outlined-read-only-input'
                                    label='도착지'
                                    value={data.destination || ''}
                                    InputProps={{readOnly: true}}/>
                                </Stack>
                            </Grid>
                            <Grid item xs={4}>
                                <Stack spacing={1}>
                                    <TextField
                                    id='outlined-read-only-input'
                                    label='출발 시간'
                                    value={data.startedDateTime || ''}
                                    InputProps={{readOnly: true}}/>
                                </Stack>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
            <Box sx={{ mt: 3 }}>
                <Card style={{borderRadius: '8px'}}>
                    <Toolbar>
                        <Typography
                            sx={{ flex: '1 1 100%' }}
                            variant='h5'
                            id='tableTitle'
                            component='div'
                        >신고 대상</Typography>
                    </Toolbar>
                    <MemberInfoTable data={data} isLoading={isLoading}/>
                </Card>
            </Box>
        </>
    )
}

export default PartyMembers;
