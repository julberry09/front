import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAccusationByMemberId, modifyAccusation, deleteAccusation } from 'api/accusation';
import CustomError from 'utils/CustomError'
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@material-ui/lab';
import { SeverityPill } from 'utils/severity-pill';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    Grid,
    InputLabel,
    CircularProgress,
    Stack,
    TextField,
    Typography,
    Toolbar,
    Card,
    CardContent,
    TextareaAutosize,
    Dialog,
    DialogTitle,
    DialogActions
} from '@mui/material';

const AccusationDetail = () => {
    const navigate = useNavigate();
    const {accusationId} = useParams();
    const { enqueueSnackbar } = useSnackbar();

    const [data, setData] = useState({id: '', partyInfo: {placeOfDeparture: '', destination: '', startedDateTime: ''},
        accusedMember: {id: '', name: ''}, accusationContents: {title: '', desc: ''}, accusationStatus: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            await searchAccusation();
        }
        fetchData();
    },[]);

    const searchAccusation = async () => {
        setIsLoading(true);

        const response = await getAccusationByMemberId(accusationId, {});

        setData(!response.message ? response : []);
        setIsLoading(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteBtnClick = async () => {
        setOpen(false);
        setIsRemoving(true);

        const response = await deleteAccusation(accusationId, {});

        setIsRemoving(false);
        if (response instanceof CustomError) {
            enqueueSnackbar(response.message, {variant: 'error'});
        } else {
            enqueueSnackbar('삭제되었습니다.', {variant: 'success'});
            navigate(`/accusations`);
        }
    };

    const customStyle = {
        padding: '10.5px 14px 10.5px 12px',
        font: 'inherit',
        borderRadius: '4px',
        borderColor: '#d9d9d9'
    };

    return (
        <>
        <div>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-title" style={{width: '500px'}}>
                {"삭제하시겠습니까?"}
            </DialogTitle>
            <DialogActions>
                <Button onClick={handleClose}>취소</Button>
                <Button onClick={deleteBtnClick}>삭제</Button>
            </DialogActions>
        </Dialog>
        </div>
        <Card sx={{ p: 2 }} style={{ borderRadius: '8px' }}>
            <Toolbar>
                <Typography
                sx={{ flex: '1 1 100%' }}
                variant='h4'
                id='tableTitle'
                component='div'>
                    {data.accusationContents?.title ? data.accusationContents.title : ''}
                </Typography>
                <AccusationStatus status={data.accusationStatus}/>
            </Toolbar>
            <CardContent>
            {!isLoading ?
                <Formik
                initialValues={{
                    placeOfDeparture: data.partyInfo?.placeOfDeparture ? data.partyInfo.placeOfDeparture : '',
                    destination: data.partyInfo?.destination ? data.partyInfo.destination : '',
                    startedDateTime: data.partyInfo?.startedDateTime ? data.partyInfo.startedDateTime : '',
                    memberFormat: data.accusedMember?.name && data.accusedMember?.id ?
                        data.accusedMember.name + '(' + data.accusedMember.id + ')' : '',
                    title: data.accusationContents?.title ? data.accusationContents.title : '',
                    desc: data.accusationContents?.desc ? data.accusationContents.desc : '',
                    submit: null
                }}
                enableReinitialize={true}
                onSubmit={async (values, { setErrors, setSubmitting }) => {
                    try {
                        setSubmitting(true);

                        const title = values.title;
                        const desc = values.desc;
                        const response = await modifyAccusation(data.id, { title, desc });

                        setSubmitting(false);
                        if (response instanceof CustomError) {
                            enqueueSnackbar(response.message, {variant: 'error'});
                        } else {
                            enqueueSnackbar('수정되었습니다.', {variant: 'success'});
                        }
                    } catch (err) {
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                        enqueueSnackbar('수정할 수 없습니다.', {variant: 'error'});
                    }
                }}
                >
                {({ handleSubmit, isSubmitting, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor='firstname-signup'>출발지</InputLabel>
                                <TextField
                                id='outlined-read-only-input'
                                value={values.placeOfDeparture}
                                InputProps={{ readOnly: true }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={4}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor='firstname-signup'>도착지</InputLabel>
                                <TextField
                                id='outlined-read-only-input'
                                value={values.destination}
                                InputProps={{ readOnly: true }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={4}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor='firstname-signup'>출발 시간</InputLabel>
                                <TextField
                                id='outlined-read-only-input'
                                value={values.startedDateTime}
                                InputProps={{ readOnly: true }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={4}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor='firstname-signup'>신고 대상</InputLabel>
                                <TextField
                                id='outlined-read-only-input'
                                value={values.memberFormat}
                                InputProps={{ readOnly: true }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor='desc-signup'> 신고 내용</InputLabel>
                                <TextareaAutosize
                                maxRows={5}
                                minRows={5}
                                aria-label='maximum height'
                                placeholder='내용'
                                defaultValue={values.desc}
                                style={customStyle}
                                onChange={e => values.desc = e.target.value}
                                />
                            </Stack>
                        </Grid>
                        <ButtonsByStatus status={data.accusationStatus} isSubmitting={isSubmitting}
                            isRemoving={isRemoving} handleClickOpen={handleClickOpen}/>
                    </Grid>
                </form>
                )}
                </Formik>
            :
            <Box sx={{py: 3, minHeight: 560}} style={{textAlign: 'center'}}>
                <CircularProgress />
            </Box>
            }
            </CardContent>
        </Card>
        </>
    );
}

export default AccusationDetail;

const AccusationStatus = ({ status }) => {
    let color;
    let title;

    switch (status) {
        case 'REGISTERED':
            color = 'warning';
            title = '등록 완료';
            break;
        case 'REJECTED':
            color = 'error';
            title = '반려됨';
            break;
        case 'COMPLETED':
            color = 'success';
            title = '처리 완료';
            break;
        default:
            color = 'primary';
            title = '';
    }

    return (
        <SeverityPill style={{ width: '100px' }} color={color}>
            {title}
        </SeverityPill>
    );
};

AccusationStatus.propTypes = {
    status: PropTypes.string.isRequired
};

const ButtonsByStatus = ({ status, isSubmitting, isRemoving, handleClickOpen }) => {

    if (status == 'REGISTERED') {
        return (
            <>
            <Grid item xs={11} textAlign='right'>
                <LoadingButton
                disableElevation
                loading={isSubmitting}
                size='medium'
                type='submit'
                variant='contained'
                color='primary'
                >
                    수정
                </LoadingButton>
            </Grid>
            <Grid item xs={1} textAlign='center'>
                <LoadingButton
                loading={isRemoving}
                size='medium'
                variant='contained'
                color='primary'
                onClick={handleClickOpen}
                >
                    삭제
                </LoadingButton>
            </Grid>
            </>
        );
    } else {
        return (
            <>
            <Grid item xs={12} textAlign='right'>
                <LoadingButton
                loading={isRemoving}
                size='medium'
                variant='contained'
                color='primary'
                onClick={handleClickOpen}
                >
                    삭제
                </LoadingButton>
            </Grid>
            </>
        );
    }
};

ButtonsByStatus.propTypes = {
    status: PropTypes.string.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    isRemoving: PropTypes.bool.isRequired,
    handleClickOpen: PropTypes.func.isRequired
};
