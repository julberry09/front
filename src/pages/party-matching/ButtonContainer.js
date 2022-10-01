import {Button, Grid} from "@mui/material";
import {MATCH_STATUS, PARTY_STATUS} from "utils/constants";
import {LoadingButton} from '@material-ui/lab';
import {useState} from "react";
import {applyParty, cancelMatch, cancelParty, closeParty, startParty} from "api/partyMatching";
import CustomError from "utils/CustomError";
import {useNavigate} from "react-router-dom";
import {useSnackbar} from "notistack";


const ButtonContainer =({partyInfo, userId, matchStatus})=>{

    const [isLoading,setIsLoading]=useState(false);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const startPartyClick = async () => {
        setIsLoading(true);

        const response = await startParty({
            partyInfoId: partyInfo.id,
            userId: userId,
        });

        if(response instanceof CustomError){
            enqueueSnackbar(response.message, {variant: 'error'});
        }else{
            enqueueSnackbar('파티가 시작되었습니다.',{variant: 'success'});
            navigate(`/my-carpool-list`);
        }
        setIsLoading(false);
    }
    const cancelPartyClick= async ()=>{
        setIsLoading(true);

        const response = await cancelParty({
            partyInfoId: partyInfo.id,
            userId: userId,
        });

        if(response instanceof CustomError){
            enqueueSnackbar(response.message, {variant: 'error'});
        }else{
            enqueueSnackbar('파티가 취소되었습니다.',{variant: 'success'});
            navigate(`/my-carpool-past-list`);
        }
        setIsLoading(false);
    }
    const applyPartyClick= async ()=>{
        setIsLoading(true);

        if(partyInfo.status == PARTY_STATUS.FULL){
            enqueueSnackbar('파티가 가득 찼습니다.',{variant: 'warning'});
        }

        const response = await applyParty({
            partyInfoId: partyInfo.id,
            userId: userId,
        });

        if(response instanceof CustomError){
            enqueueSnackbar(response.message, {variant: 'error'});
        }else{
            enqueueSnackbar('파티를 신청하였습니다.',{variant: 'success'});
            navigate(`/my-carpool-waiting-list`);
        }
        setIsLoading(false);
    }
    const cancelApplyClick= async ()=>{

        setIsLoading(true);

        const response = await cancelMatch({
            partyInfoId: partyInfo.id,
            userId: userId,
        });

        if(response instanceof CustomError){
            enqueueSnackbar(response.message, {variant: 'error'});
        }else{
            enqueueSnackbar('파티신청을 취소하였습니다.',{variant: 'success'});
            navigate(`/my-carpool-list`);
        }
        setIsLoading(false);
    }
    const closePartyClick= async ()=>{

        setIsLoading(true);

        const response = await closeParty({
            partyInfoId: partyInfo.id,
            userId: userId,
        });

        if(response instanceof CustomError){
            enqueueSnackbar(response.message, {variant: 'error'});
        }else{
            enqueueSnackbar('파티를 종료하였습니다.',{variant: 'success'});
            navigate(`/my-carpool-past-list`);
        }
        setIsLoading(false);

    }

    const isDriver =()=>{
        return partyInfo.driver.userId == userId
    }

    return (
        <Grid container direction="row" justifyContent="center" spacing={2}>
                {((partyInfo.status ==PARTY_STATUS.OPEN || partyInfo.status==PARTY_STATUS.FULL) && isDriver()) &&
                    <>
                        <LoadingButton sx={{ mt: 2 }} variant="contained" onClick={startPartyClick} loading={isLoading} style={{margin:5}}>
                            파티시작
                        </LoadingButton>
                        <LoadingButton sx={{ mt: 2 }} variant="contained" onClick={cancelPartyClick} loading={isLoading} color={"error"} style={{margin:5}}>
                            파티취소
                        </LoadingButton>
                    </>
                }
                {((partyInfo.status ==PARTY_STATUS.OPEN) && !isDriver()) &&
                    <>
                        <LoadingButton sx={{ mt: 2 }} variant="contained" onClick={applyPartyClick} loading={isLoading} disabled={matchStatus==MATCH_STATUS.ACCEPT || matchStatus==MATCH_STATUS.WAITING} style={{margin:5}}>
                            파티신청
                        </LoadingButton>
                        <LoadingButton sx={{ mt: 2 }} variant="contained" onClick={cancelApplyClick} loading={isLoading} color={"error"} disabled={matchStatus!=MATCH_STATUS.ACCEPT && matchStatus!=MATCH_STATUS.WAITING} style={{margin:5}}>
                            신청취소
                        </LoadingButton>
                    </>
                }
                {((partyInfo.status == PARTY_STATUS.STARTED) && isDriver()) &&
                    <>
                        <LoadingButton sx={{ mt: 2 }} variant="contained" onClick={closePartyClick} loading={isLoading} color={"error"} style={{margin:5}}>
                            파티 종료
                        </LoadingButton>
                    </>
                }
        </Grid>
    )
}
export default ButtonContainer