import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthGuard from './AuthGuard';
const PublicRouting = (props) => {
    const auth = AuthGuard()
    return auth ? <Navigate to="/home" /> : <Outlet />
}

export default PublicRouting