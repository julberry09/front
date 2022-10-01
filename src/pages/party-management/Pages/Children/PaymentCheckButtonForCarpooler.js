import {PAY_CHECK} from "../../../../utils/constants";
import {Button} from "@mui/material";
import * as React from "react";
import {LoadingButton} from "@mui/lab";

const PaymentCheckButtonForCarpooler = ({carpoolerCheck, driverCheck, isLoading, requestPayCheckClick})=>{
    if(carpoolerCheck==PAY_CHECK.PAID && driverCheck==PAY_CHECK.PAID){
        return <LoadingButton variant="contained" color="primary" loading={isLoading} disabled={true} style={{width: 130}}>정산 확인 완료</LoadingButton>
    }else if(carpoolerCheck==PAY_CHECK.PAID && driverCheck!=PAY_CHECK.PAID){
        return <LoadingButton variant="contained" color="warning" loading={isLoading} disabled={true} style={{width: 130}}>정산 확인 중</LoadingButton>
    }else if(carpoolerCheck==PAY_CHECK.RETRY && driverCheck!=PAY_CHECK.PAID){
        return <LoadingButton variant="contained" color="error" loading={isLoading} onClick={requestPayCheckClick} style={{width: 130}}>정산 재요청</LoadingButton>
    }else{
        return <LoadingButton variant="contained" color="error" loading={isLoading} onClick={requestPayCheckClick} style={{width: 130}}>정산 확인 요청</LoadingButton>
    }

}

export default PaymentCheckButtonForCarpooler;