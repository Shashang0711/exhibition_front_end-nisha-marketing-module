import React from 'react';

const SubscriptionCard = (props) => {
  const { subscriptionDetails, nextTab, purchase, setPurchase, addList } = props;

  const handleSubPurchase = (subscription) => {
    setPurchase(
      {
        subscription
      }
    );
    nextTab();
  }

  return (
    <div className="col-sm-12 col-md-6 col-lg-4">
        <div className="subscription-card">
            <div>
                <div className="subscription-title">
                    <h4>{subscriptionDetails.subscriptionPlanName}</h4>
                    <h5>&#8377; {subscriptionDetails.price}</h5>
                </div>
                <h6>Features included are:</h6>
                <ul className="features">
                    <li>
                        <img src={require('../../../../assets/images/tick.png')} width='8%' alt="tick" />
                        &nbsp;
                        <p>0% Commission</p>
                    </li>
                    <li>
                        <img src={require('../../../../assets/images/tick.png')} width='8%' alt="tick" />
                        &nbsp;
                        <p>{subscriptionDetails.detail}</p>
                    </li>
                    <li>
                        <img src={require('../../../../assets/images/tick.png')} width='8%' alt="tick" />
                        &nbsp;
                        <p>Inventory Management</p>
                    </li>
                    <li>
                        <img src={require('../../../../assets/images/tick.png')} width='8%' alt="tick" />
                        &nbsp;
                        <p>Custom Pricing</p>
                    </li>
                    <li>
                        <img src={require('../../../../assets/images/tick.png')} width='8%' alt="tick" />
                        &nbsp;
                        <p>All Round Analytics</p>
                    </li>
                    <li>
                        <img src={require('../../../../assets/images/tick.png')} width='8%' alt="tick" />
                        &nbsp;
                        <p>Social Media Integration</p>
                    </li>
                    <li>
                        <img src={require('../../../../assets/images/tick.png')} width='8%' alt="tick" />
                        &nbsp;
                        <p>Coupon Generation</p>
                    </li>
                    <li>
                        <img src={require('../../../../assets/images/tick.png')} width='8%' alt="tick" />
                        &nbsp;
                        <p>Home Delivery / Self Ship</p>
                    </li>
                    <li>
                        <img src={require('../../../../assets/images/tick.png')} width='8%' alt="tick" />
                        &nbsp;
                        <p>24/7 Support</p>
                    </li>
                </ul>
            </div>
            <div className="btn-wrapper">
                <div className="form">
                    <div className="btn btn-secondary d-block " onClick={() => handleSubPurchase(subscriptionDetails.subscriptionPlanId)}>
                        Purchase Subcription
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default SubscriptionCard;
