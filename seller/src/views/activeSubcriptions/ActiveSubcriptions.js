import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { UserSubscriptionService } from 'src/services/userSubscription';
import { CRow, CCol, CCard, CCardBody, CButton, CAvatar, CCardHeader } from '@coreui/react';
import { getUserFromRedux } from 'src/utils/userFromredux/getUserFromRedux';
import Subscription from '../../assets/images/Subscriptions.svg'

const activeSubcriptions = () => {
    const [activeSubcriptionsList, setActiveSubcriptionsList] = useState([])
    const userFromRedux = useSelector((state) => state.user);
    const user = getUserFromRedux(userFromRedux);
    const [subscriptionData, setSubscriptionData] = useState([
        {
            days: 7,
            count: 0
        },
        {
            days: 15,
            count: 0
        },
        {
            days: 30,
            count: 0
        },
    ])

    const countSubscriptionData = () => {
        let tempObj = JSON.parse(JSON.stringify(subscriptionData));
        for (const activeSub of activeSubcriptionsList) {
            const subDays = activeSub?.subscriptionPlan?.days;
            tempObj = tempObj.map((data) => {
                if (data.days === subDays) {
                    data.count += 1;
                }
                return data;
            })
        }
        setSubscriptionData(tempObj);
    }

    useEffect(() => {
        countSubscriptionData();
    }, [activeSubcriptionsList])
    useEffect(() => {
        fetchActiveSubcriptions();
    }, [])

    const fetchActiveSubcriptions = async () => {
        const activeSubcriptionsRes = await UserSubscriptionService.getActiveSubscriptions(user.userId);
        if (activeSubcriptionsRes.status === 200) {
            setActiveSubcriptionsList(activeSubcriptionsRes.data.rows);
        }
    }
    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <div className='app-table'>
                        <CCard className="mb-4 overflow-auto">
                            <CCardHeader>
                                <strong>Already Purchase Subscription Plan</strong>
                            </CCardHeader>
                            <CCardBody>
                                <>
                                    {[...new Map(activeSubcriptionsList.map(item => [item?.subscriptionPlanId, item])).values()].length <= 0 ?
                                        <h4 className='no-data-found'>No Data Found</h4>
                                        : <></>}
                                </>
                                <>
                                    {[...new Map(activeSubcriptionsList.map((item) => [item?.subscriptionPlanId, item])).values()].map((activeSub, index) => {
                                        const ind = subscriptionData.findIndex(data => data.days === activeSub.subscriptionPlan.days);
                                        if (subscriptionData[ind]?.count > 0) {
                                            return (<React.Fragment key={index}>
                                                <CRow className='mb-3' key={index}>
                                                    <CCol xs={12} xl={6}>
                                                        <CCard>
                                                            <CCardBody className='border'>
                                                                <CRow>
                                                                    <CCol className='d-flex align-items-center' xs={12}>
                                                                        <div className='me-3'>
                                                                            <CAvatar size="lg" src={Subscription} />
                                                                        </div>
                                                                        <div className='flex-grow-1'>
                                                                            <h6>{activeSub?.subscriptionPlan?.subscriptionPlanName}</h6>
                                                                            <span>{activeSub?.subscriptionPlan?.detail}</span>
                                                                        </div>
                                                                        <CButton>{subscriptionData[ind].count}</CButton>
                                                                    </CCol>
                                                                </CRow>
                                                            </CCardBody>
                                                        </CCard>
                                                    </CCol>
                                                </CRow>
                                            </React.Fragment>
                                            )
                                        }
                                        <>

                                        </>

                                    })}
                                </>
                            </CCardBody>
                        </CCard>
                    </div>
                </CCol>
            </CRow>
        </>
    )
}

export default activeSubcriptions