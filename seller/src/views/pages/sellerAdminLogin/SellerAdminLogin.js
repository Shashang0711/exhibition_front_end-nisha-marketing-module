import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { AuthService } from 'src/services/auth'
import { sellerService } from 'src/services/sellers';
import { AddSellerOnService } from 'src/services/userAddOns';
import { UserSubscriptionService } from 'src/services/userSubscription';
import { setToken } from 'src/utils/localstorage';

const SellerAdminLogin = () => {
    const { accessToken } = useParams();
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const userFromRedux = useSelector((state) => state.user);
    // const user = JSON.parse((userFromRedux))

    // useEffect(() => {
    //     checkVerifyToken()
    // }, [])

    // const checkVerifyToken = async () => {
    //     console.log("fun")
    //     localStorage.removeItem('user');
    //     localStorage.removeItem('userToken');
    //     localStorage.removeItem('persist:root');
    //     dispatch({ type: 'user', user: null })
    //localStorage.removeItem('userMobileNo')
    //     dispatch({ type: 'userAddons', userAddons: null })
    //     dispatch({ type: 'userSubscriptionId', userSubscriptionId: null })

    //     console.log("sller user", userFromRedux)

    //     setToken(accessToken);
    //     let userId;
    //     const checkAuthRes = await AuthService.tokenCheck()
    //     if (!checkAuthRes) {
    //         navigate('/')
    //     }
    //     if (checkAuthRes.status === 200 || checkAuthRes.status === '200') {
    //         console.log("check auth res")
    //         userId = checkAuthRes.data.userId
    //     }
    //     console.log("userId", userId)
    //     if (userId) {
    //         const sellerByIdRes = await sellerService.getSellerById(userId)
    //         if (!sellerByIdRes) {
    //             return;
    //         }
    //         if (sellerByIdRes.status === 200 || sellerByIdRes === '200') {
    //             const user = JSON.stringify(sellerByIdRes.data);
    //             dispatch({ type: 'user', user: user }) // setting user in redux
    //             if (sellerByIdRes.data.isSubscribed) {
    //                 if (sellerByIdRes.data.isDocVerified) {
    //                     const userSubscritpionResponse = await UserSubscriptionService.getActiveSubscriptions(sellerByIdRes.data.userId);
    //                     if (!userSubscritpionResponse) {
    //                         return;
    //                     }
    //                     const userActiveAddonsResponse = await AddSellerOnService.getActiveAddOns(sellerByIdRes.data.userId);
    //                     if (!userActiveAddonsResponse) {
    //                         return;
    //                     }
    //                     dispatch({ type: 'getSubscription', subscription: userSubscritpionResponse.data.subscriptionPlanId });
    //                     dispatch({ type: 'userSubscriptionId', userSubscriptionId: userSubscritpionResponse.data.rows });
    //                     dispatch({ type: 'userAddons', userAddons: userActiveAddonsResponse.data.rows });
    //                 }

    //             }
    //         }

    //     }
    // }

    return (
        <div>
            {/* {isLoading ? <LoadingSpinner /> : null} */}
        </div>
    )
}

export default SellerAdminLogin