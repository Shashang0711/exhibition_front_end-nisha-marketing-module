import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useNavigate, useParams } from 'react-router-dom'
import { AuthService } from 'src/services/auth';
import { sellerService } from 'src/services/sellers';
import { AddSellerOnService } from 'src/services/userAddOns';
import { UserSubscriptionService } from 'src/services/userSubscription';
import { setToken } from 'src/utils/localstorage';
import { getUserFromRedux } from 'src/utils/userFromredux/getUserFromRedux';
import { AuthGuard } from './AuthGuard'
const PublicRouting = () => {
    const userFromRedux = useSelector((state) => state.user);
    const user = getUserFromRedux(userFromRedux)
    const dispatch = useDispatch();
    const navigate = useNavigate()
    ////////////////////
    const { accessToken } = useParams();
    useEffect(() => {
        if (accessToken) {
            checkVerifyToken()
        }
    }, [])


    const checkVerifyToken = async () => {
        localStorage.removeItem('user');
        localStorage.removeItem('userToken');
        localStorage.removeItem('persist:root');
        localStorage.removeItem('userMobileNo')
        dispatch({ type: 'user', user: null })
        dispatch({ type: 'userAddons', userAddons: null })
        dispatch({ type: 'userSubscriptionId', userSubscriptionId: null })
        setToken(accessToken);
        let userId;
        const checkAuthRes = await AuthService.tokenCheck()
        if (!checkAuthRes) {
            return navigate('/')
        }
        if (checkAuthRes.status === 200 || checkAuthRes.status === '200') {
            userId = checkAuthRes.data.userId
        }

        if (userId) {
            const sellerByIdRes = await sellerService.getSellerById(userId)
            if (!sellerByIdRes) {
                return;
            }
            if (sellerByIdRes.status === 200 || sellerByIdRes === '200') {
                const user = JSON.stringify(sellerByIdRes.data);
                dispatch({ type: 'user', user: user }) // setting user in redux
                if (sellerByIdRes.data.isSubscribed) {
                    if (sellerByIdRes.data.isDocVerified) {
                        const userSubscritpionResponse = await UserSubscriptionService.getActiveSubscriptions(sellerByIdRes.data.userId);
                        if (!userSubscritpionResponse) {
                            return;
                        }
                        const userActiveAddonsResponse = await AddSellerOnService.getActiveAddOns(sellerByIdRes.data.userId);
                        if (!userActiveAddonsResponse) {
                            return;
                        }
                        dispatch({ type: 'getSubscription', subscription: userSubscritpionResponse.data.subscriptionPlanId });
                        dispatch({ type: 'userSubscriptionId', userSubscriptionId: userSubscritpionResponse.data.rows });
                        dispatch({ type: 'userAddons', userAddons: userActiveAddonsResponse.data.rows });
                    }

                }
            }

        }
    }


    ///////////////////////




    const auth = AuthGuard();
    const navigatorFun = () => {
        if (user?.isSubscribed) {
            if (user?.isDocVerified) {
                return <Navigate to='/dashboard' />
            } else if (user?.documents === null) {
                return <Navigate to='/documentverification' />
            } else {
                if (user.documents.isIDVerified === "Rejected" && user.documents.isPassbookVerified === "Rejected") {
                    //enter form
                    return <Navigate to='/documentverification' />
                } else if (user.documents.isIDVerified === "Rejected") {
                    //step 1
                    return <Navigate to='/documentverification' />
                } else if (user.documents.isPassbookVerified === "Rejected") {
                    //spep 2
                    return <Navigate to='/documentverification' />
                } else {
                    return <Navigate to='/thank-you' />
                }
            }
        } else {
            return <Navigate to='/purchase/subscriptions' />
        }
    }
    return auth ? navigatorFun() : <Outlet />
}

export default PublicRouting


