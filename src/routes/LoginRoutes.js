import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// render - login
const AuthLogin    = Loadable(lazy(() => import('pages/authentication/Login')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/Register')));
const AuthUserRegister = Loadable(lazy(() => import('pages/authentication/UserRegister')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: 'auth/login',
            element: <AuthLogin />
        },
        {
            path: 'auth/register',
            element: <AuthRegister />
        },
        {
            path: 'auth/registerform/:checkedEmail',
            element: <AuthUserRegister />
        }
    ]
};

export default LoginRoutes;
