import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthGuard } from './AuthGuard'
const PrivateRouting = () => {
    const auth = AuthGuard();
    return auth ? <Outlet /> : <Navigate to="/" />
}

export default PrivateRouting
