import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { sellerMaster } from '../../../services/user.service';
import { fileUrl } from '../../../constants/constants';

const SellerDetails = () => {
    const { sellerId } = useParams();
    const [sellerData, setSellerData] = useState({});

    const getSellerMasterData = async () => {
        const sellerData = await sellerMaster(sellerId);
        if (sellerData.status === 200 || sellerData.status === '200') {
            setSellerData(sellerData.data)
        }
    }

    useEffect(() => {
        getSellerMasterData();
    }, []);
    return (
        <div>
            <div className="page-header">
                <h3 className="page-title">
                    <span className="page-title-icon bg-gradient-primary text-white mr-2">
                        <i className="mdi mdi-home"></i>
                    </span>{" "}
                    Seller Details
                </h3>
                <Link to="/sellers">
                    <button class="btn btn-outline-primary btn-sm addbtn" type="button">Back To Sellers</button>
                </Link>
            </div>
            <div className="row">
                <div className="col-lg-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body scrollableCard">
                            <div className='row'>
                                <div className='col-md-6 col-lg-6 col-xl-4 col-xxl-3'>
                                    <div className='list-card'>
                                        <div className='icon'>
                                            <i className="mdi mdi-home menu-icon"></i>
                                        </div>
                                        <div className='content'>
                                            <h5>Name: <span>{sellerData.userName}</span> </h5>
                                        </div>
                                    </div>
                                    <div className='list-card'>
                                        <div className='icon'>
                                            <i className="mdi mdi-home menu-icon"></i>
                                        </div>
                                        <div className='content'>
                                            <h5>Email: <span>{sellerData.email}</span> </h5>
                                        </div>
                                    </div>
                                    <div className='list-card'>
                                        <div className='icon'>
                                            <i className="mdi mdi-home menu-icon"></i>
                                        </div>
                                        <div className='content'>
                                            <h5>Mobile No: <span>{sellerData.mobileNo}</span> </h5>
                                        </div>
                                    </div>
                                    <div className='list-card'>
                                        <div className='icon'>
                                            <i className="mdi mdi-home menu-icon"></i>
                                        </div>
                                        <div className='content'>
                                            <h5>ID Proof:
                                                {
                                                    sellerData.documents ? (<>
                                                        <span><a href={`${fileUrl}/${sellerData?.documents?.idProof}`} target='_blank'>View</a></span>
                                                    </>) : (<>
                                                        <strong>Not Uploaded</strong>
                                                    </>)
                                                }
                                            </h5>
                                            <h5>Status: <span>{sellerData.documents?.isIDVerified}</span> </h5>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-6 col-lg-6 col-xl-4 col-xxl-3'>
                                    <div className='list-card'>
                                        <div className='icon'>
                                            <i className="mdi mdi-home menu-icon"></i>
                                        </div>
                                        <div className='content'>
                                            <h5>Passbook:
                                                {
                                                    sellerData.documents ? (<>
                                                        <span><a href={`${fileUrl}/${sellerData?.documents?.passbook}`} target='_blank'>View</a></span>
                                                    </>) : (<>
                                                        <strong>Not Uploaded</strong>
                                                    </>)
                                                }
                                            </h5>
                                            <h5>Status: <span>{sellerData.documents?.isPassbookVerified}</span> </h5>
                                        </div>
                                    </div>
                                    <div className='list-card align-items-start'>
                                        <div className='icon'>
                                            <i className="mdi mdi-home menu-icon"></i>
                                        </div>
                                        <div className='content'>
                                            <h5>Purchased Subscriptions: </h5>
                                            {
                                                sellerData && sellerData.userSubscriptions && sellerData.userSubscriptions.map((sub, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <h5>Plan: <span>{sub.subscriptionPlan.subscriptionPlanName}</span> </h5>
                                                            <h5>Status: <span>{sub.status}</span> </h5>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className='list-card align-items-start'>
                                        <div className='icon'>
                                            <i className="mdi mdi-home menu-icon"></i>
                                        </div>
                                        <div className='content'>
                                            <h5>Purchased Add-ons: </h5>
                                            {
                                                sellerData && sellerData.sellerAddOns && sellerData.sellerAddOns.map((addOnItem, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <h5>Add-on: <span>{addOnItem.addOn.addOnName}</span> </h5>
                                                            <h5>Status: <span>{addOnItem.status ? 'Consumed' : 'Not Consumed'}</span> </h5>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SellerDetails;
