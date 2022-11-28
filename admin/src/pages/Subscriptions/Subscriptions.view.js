import React from 'react';
import { Link } from 'react-router-dom';

const Subscription = () => {
    return (
        <div>
            <div className="page-header">
                <h3 className="page-title">
                    <span className="page-title-icon bg-gradient-primary text-white mr-2">
                        <i className="mdi mdi-home"></i>
                    </span> Subscriptions 
                </h3>
                <nav aria-label="breadcrumb">
                    <ul className="breadcrumb">
                        <li className="breadcrumb-item active" aria-current="page">
                            <span></span>Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="row">
                <div className="col-md-4 stretch-card grid-margin">
                    <div className="card bg-gradient-danger card-img-holder text-white">
                        <div className="card-body">
                            <img src={require("../../assets/images/dashboard/circle.svg")} className="card-img-absolute" alt="circle" />
                            <h4 className="font-weight-normal mb-3">Weekly Subscription <i className="mdi mdi-account-card-details mdi-24px float-right"></i>
                            </h4>
                            <h2 className="mb-5">Rs 1000</h2>
                            <p className="card-text">A weekly subscription that allows you to launch your exhibition for a week.</p>
                            <Link to='/purchase-subscription'>
                                <button type="button" className="btn btn-danger btn-rounded btn-fw">Get Now</button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 stretch-card grid-margin">
                    <div className="card bg-gradient-info card-img-holder text-white">
                        <div className="card-body">
                            <img src={require("../../assets/images/dashboard/circle.svg")} className="card-img-absolute" alt="circle" />
                            <h4 className="font-weight-normal mb-3">Biweekly Subscription <i className="mdi mdi-wallet-giftcard mdi-24px float-right"></i>
                            </h4>
                            <h2 className="mb-5">Rs 1800</h2>
                            <p className="card-text">A biweekly subscription that allows you to launch your exhibition for a two consicutive weeks.</p>
                            <Link to='/purchase-subscription'>
                                <button type="button" className="btn btn-info btn-rounded btn-fw">Get Now</button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 stretch-card grid-margin">
                    <div className="card bg-gradient-success card-img-holder text-white">
                        <div className="card-body">
                            <img src={require("../../assets/images/dashboard/circle.svg")} className="card-img-absolute" alt="circle" />
                            <h4 className="font-weight-normal mb-3">Monthly Subscription <i className="mdi mdi-diamond mdi-24px float-right"></i>
                            </h4>
                            <h2 className="mb-5">Rs 3000</h2>
                            <p className="card-text">A monthly subscription that allows you to launch your exhibition for a month.</p>
                            <Link to='/purchase-subscription'>
                                <button type="button" className="btn btn-success btn-rounded btn-fw">Get Now</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Subscription;