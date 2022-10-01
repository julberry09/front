import MainCard from 'components/MainCard';
import DataTable from 'components/@extended/DataTable';
import Dot from 'components/@extended/Dot';
import { Stack, Typography } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import { getAdminAccusations } from 'api/accusation';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const AdminAccusations = () => {
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            await searchAccusations();
        }
        fetchData();
    },[]);

    const searchAccusations = async () => {
        setIsLoading(true);

        const response = await getAdminAccusations({});

        setData(!response.message ? response.accusations : []);
        setIsLoading(false);
    };

    const rowClick = useCallback((e, row) => {
        const accusationId = row.id;
        navigate(`/admin-accusations/${accusationId}`);
    }, []);

    return (
    <MainCard title="신고내역">
        <DataTable columns={columns} rows={data} rowsPerPageOptions={[10,20,30]} isLoading={isLoading} rowClick={rowClick}/>
    </MainCard>
    );
}

export default AdminAccusations;

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
        <Stack direction="row" spacing={1} alignItems="center">
            <Dot color={color} />
            <Typography>{title}</Typography>
        </Stack>
    );
};

AccusationStatus.propTypes = {
    status: PropTypes.string.isRequired
};

const columns = [
    {
        id : 'id',
        label: 'No.',
        width: 50,
        align: 'center',
    },
    {
        id : 'partyId',
        label: '파티 ID',
        width: 50,
        align: 'center',
    },
    {
        id : 'memberId',
        label: '작성자',
        width: 50,
        align: 'center',
    },
    {
        id : 'title',
        label: '제목',
        width: 200,
        align: 'center',
    },
    {
        id : 'accusationStatus',
        label: '신고 상태',
        width: 80,
        align: 'left',
        render: (row)=>{
            return <>
                <AccusationStatus status={row.accusationStatus} />
            </>
        }
    },
    {
        id : 'modifiedDateTime',
        label: '최종 수정일',
        width: 80,
        align: 'left',
    }
];
