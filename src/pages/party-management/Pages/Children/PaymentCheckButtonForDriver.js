import {PAY_CHECK} from "../../../../utils/constants";
import {Button} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import {useSnackbar} from "notistack";
import {checkPayment, retryPayment} from "../../../../api/partymanagement";
import CustomError from "../../../../utils/CustomError";
import {LoadingButton} from "@mui/lab";
import Grid from "@mui/material/Unstable_Grid2";

const PaymentCheckButtonForDriver = ({carpoolerCheck, driverCheck, partyId, carpoolerId})=>{

    const [isLoading, setIsLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const checkPaymentClick=async ()=>{
        setIsLoading(true);
        const response = await checkPayment({
            partyId: partyId,
            carpoolerId: carpoolerId
        })

        if(response instanceof CustomError){
            enqueueSnackbar(partyMemberResponse.message, {variant: 'error'});
        }else{
            enqueueSnackbar('정산이 확인되었습니다.', {variant: 'success'});
            window.location.reload()
        }
        setIsLoading(false);
    }

    const requestRetryClick=async ()=>{
        setIsLoading(true);
        const response = await retryPayment({
            partyId: partyId,
            carpoolerId: carpoolerId
        })

        if(response instanceof CustomError){
            enqueueSnackbar(response.message, {variant: 'error'});
        }else{
            enqueueSnackbar('정산이 재요청되었습니다.', {variant: 'success'});
            window.location.reload()
        }
        setIsLoading(false);
    }


    if(carpoolerCheck==PAY_CHECK.PAID && driverCheck==PAY_CHECK.PAID){
        return <LoadingButton variant="contained" color="primary" loading={isLoading} disabled={true}style={{width: 130}}>정산 확인 완료</LoadingButton>
    }else if(carpoolerCheck==PAY_CHECK.PAID && driverCheck!=PAY_CHECK.PAID){
        return (<Grid direction="row" spacing={4} justifyContent="flex-start">
            <LoadingButton variant="contained" color="warning" loading={isLoading} onClick={checkPaymentClick} style={{width: 130, marginRight:10}}>정산 확인</LoadingButton>
            <LoadingButton variant="contained" color="error" loading={isLoading} onClick={requestRetryClick} style={{width: 130}}>정산 재요청</LoadingButton>
            </Grid>)
    }else{
        return <LoadingButton variant="contained" color="error" loading={isLoading} disabled={true} style={{width: 130}}>정산 전</LoadingButton>
    }

}

export default PaymentCheckButtonForDriver;