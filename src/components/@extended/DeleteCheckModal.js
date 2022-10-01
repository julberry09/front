import {useState} from "react";
import {Box, Button, Grid, Modal} from "@mui/material";
import {LoadingButton} from '@material-ui/lab';
import PropTypes from 'prop-types';

const DeleteCheckModal = ({modalOpen=false,
                          onOk,
                          onCancel,
                              deleteLoading})=>{

    return <>
        <Modal
            open={modalOpen}
            onClose={onCancel}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Box sx={{ ...style, width: 400 }}>
                <h2 id="parent-modal-title">삭제하시겠습니까?</h2>
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    spacing={2}>
                    <Grid item>
                        <LoadingButton variant="contained"
                                       onClick={onOk}
                                       color="error"
                                       loading={deleteLoading}>삭제</LoadingButton>
                    </Grid>
                    <Grid item>
                        <LoadingButton variant="contained"
                                onClick={onCancel}
                                loading={deleteLoading}>취소</LoadingButton>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    </>
}

export default DeleteCheckModal;


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

DeleteCheckModal.propTypes = {
    modalOpen: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    deleteLoading : PropTypes.bool
};
