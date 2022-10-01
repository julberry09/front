// assets
import { ChromeOutlined, QuestionOutlined, EyeOutlined,NotificationOutlined } from '@ant-design/icons';
import {ADMIN_TYPE} from "utils/constants";
import HistoryIcon from "@mui/icons-material/History";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";

// icons
const icons = {
    ChromeOutlined,
    QuestionOutlined,
    EyeOutlined,
    NotificationOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const support = {
    id: 'support',
    title: 'Support',
    type: 'group',
    children: [
        {
            id: 'questions',
            title: '문의',
            type: 'item',
            url: '/questions',
            icon: icons.QuestionOutlined
        },
        {
            id: 'notices',
            title: '공지사항',
            type: 'item',
            url: '/notices',
            icon: icons.NotificationOutlined
        },
        {
            id: 'accusations',
            title: '신고 내역',
            type: 'item',
            url: '/accusations',
            icon: HistoryIcon,
            breadcrumbs: false
        },
        {
            id:'review-register',
            title : '리뷰',
            type : 'collapse',
            icon: RateReviewOutlinedIcon,
            children: [
                {
                    id:'my-review',
                    title : '내가 작성한 리뷰',
                    type : 'item',
                    url : '/my-review',
                    breadcrumbs: false
                },
                {
                    id:'reviews',
                    title : '마이리뷰',
                    type : 'item',
                    url : '/reviews',
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'admin',
            title: '관리자 영역',
            authority: ADMIN_TYPE,
            type: 'collapse',
            icon: icons.EyeOutlined,
            children: [
                {
                    id: 'question-management',
                    title: '문의사항 관리',
                    type: 'item',
                    url: '/admin/question-management',
                    breadcrumbs: false
                },
                {
                    id: 'admin-accusation-list',
                    title: '회원 신고 리스트',
                    type: 'item',
                    url: '/admin-accusations',
                    breadcrumbs: false
                },
            ]
        }
    ]
};

export default support;
