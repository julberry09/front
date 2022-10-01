import { useLocation, useNavigate } from 'react-router-dom';
import { registerAccusation } from 'api/accusation';
import CustomError from 'utils/CustomError'
import { useSnackbar } from 'notistack';
import {LoadingButton} from '@material-ui/lab';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
    FormHelperText,
    Grid,
    InputLabel,
    OutlinedInput,
    Stack,
    TextField,
    Typography,
    Toolbar,
    Card,
    CardContent,
    TextareaAutosize
} from '@mui/material';

const RegisterAccusation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { enqueueSnackbar } = useSnackbar();

    const partyInfo = location.state.partyInfo;
    const accusedMember = location.state.accusedMember;

    const customStyle = {
        padding: '10.5px 14px 10.5px 12px',
        font: 'inherit',
        borderRadius: '4px',
        borderColor: '#d9d9d9'
    };

    return (
        <>
        <Card sx={{ p: 2 }} style={{ borderRadius: '8px' }}>
            <Toolbar>
                <Typography
                sx={{ flex: '1 1 100%' }}
                variant='h5'
                id='tableTitle'
                component='div'>
                    신고하기
                </Typography>
            </Toolbar>
            <CardContent>
                <Formik
                initialValues={{
                    placeOfDeparture: partyInfo.placeOfDeparture,
                    destination: partyInfo.destination,
                    staredDateTime: partyInfo.startedDateTime,
                    memberFormat: accusedMember.name + '(' + accusedMember.id + ')',
                    title: '',
                    desc: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    title: Yup.string().max(255).required('Title is required')
                })}
                onSubmit={async (values, { setErrors, setSubmitting }) => {
                    try {
                        setSubmitting(true);
                        
                        const accusationContents = {};
                        accusationContents.title = values.title;
                        accusationContents.desc = values.desc;

                        const response = await registerAccusation({ partyInfo, accusedMember, accusationContents });

                        setSubmitting(false);
                        if (response instanceof CustomError) {
                            enqueueSnackbar(response.message, {variant: 'error'});
                        } else {
                            enqueueSnackbar('신고가 등록되었습니다.', {variant: 'success'});
                            navigate(`/accusations`);
                        }
                    } catch (err) {
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                        enqueueSnackbar('등록할 수 없습니다.', {variant: 'error'});
                    }
                }}
                >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
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
                                value={values.staredDateTime}
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
                                <InputLabel htmlFor='title-signup'>제목</InputLabel>
                                <OutlinedInput
                                id='title-login'
                                type='title'
                                value={values.title}
                                name='title'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                placeholder='Title'
                                fullWidth
                                error={Boolean(touched.title && errors.title)}
                                />
                                {touched.title && errors.title && (
                                <FormHelperText error id='helper-text-title-signup'>
                                    {errors.title}
                                </FormHelperText>
                                )}
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
                                defaultValue=''
                                onChange={e => values.desc = e.target.value}
                                style={customStyle}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} textAlign='right'>
                            <LoadingButton
                            disableElevation
                            loading={isSubmitting}
                            size='medium'
                            type='submit'
                            variant='contained'
                            color='primary'
                            >
                                등록
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </form>
                )}
                </Formik>
            </CardContent>
        </Card>
        </>
    );
}

export default RegisterAccusation;
