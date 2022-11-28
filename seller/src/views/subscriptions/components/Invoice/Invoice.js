import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react';
import './Invoice.css';
import { SubPlanService } from "src/services/subscriptionPlans";
import { UserSubscriptionService } from "src/services/userSubscription";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { sellerService } from "src/services/sellers";
import { AddSellerOnService } from "src/services/userAddOns";
import { paymentService } from "src/services/payment";
import logo from "../../../../assets/images/favicon.svg"
import { loadScript } from "src/utils/loadScript";
import { DEV, razorCheckoutUrl } from "src/constants/constants";
import moment from 'moment'

const Invoice = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const { purchase, setPurchase } = props;
  const [selectedSub, setSelectedSub] = useState({});
  const [selectedAddOn, setSelectedAddOn] = useState([]);
  const [total, setTotal] = useState(0);
  const user = useSelector((state) => state.user); // getting user from redux
  const userId = JSON.parse(user).userId;
  const userData = JSON.parse(user)

  const current = new Date();


  const fetchSubscriptionPlan = async (subPlanId) => {
    const subPlanResponse = await SubPlanService.getSubscriptionById(subPlanId);
    if (!subPlanResponse) {
      return;
    }
    if (subPlanResponse.status === 200 || subPlanResponse.status === '200') {
      // setSelectedSub(subPlanResponse.data.subscriptionPlanName);
      setSelectedSub({
        subscriptionPlanName: subPlanResponse.data.subscriptionPlanName,
        price: subPlanResponse.data.price
      });
    }
  }

  useEffect(() => {
    fetchSubscriptionPlan(purchase.subscription);
  }, []);

  useEffect(() => {
    const eleArray = [];
    if (purchase && purchase?.addOn) {
      purchase?.addOn.map((ele) => {
        eleArray.push(ele.addOn)
        setSelectedAddOn(eleArray)
      })
    }
    // const addOnTotalPrice = getAddOnTotal(purchase?.addOn);
    const subscriptionPrice = selectedSub.price;
    const addOnTotalPrice = selectedAddOn.reduce((accumulator, object) => {
      return accumulator + object.price;
    }, 0);
    setTotal(selectedSub.price + addOnTotalPrice);
  }, [purchase, selectedSub]);

  const buySubscription = async () => {

    // loading razjor pay UI
    const res = await loadScript(razorCheckoutUrl)
    if (!res) {
      toast.warn('Razorpay SDK failed to load. Are you online?')
      return;
    }


    // create order
    let addOnsList = '';
    if (purchase && purchase.addOn) {
      purchase.addOn.map((element, index) => {

        if (index === purchase?.addOn.length - 1) {
          addOnsList = addOnsList + `${element?.addOn.addOnName}`
        } else {
          addOnsList = addOnsList + `${element?.addOn.addOnName},`;
        }
        return addOnsList
      }

      )
    }
    const paymentPayload = {
      amount: total * 100,
      subscriptionPlan: selectedSub?.subscriptionPlanName,
      addOns: addOnsList,
      paymentPurpose: 'Subscription'
    }

    const orderResposne = await paymentService.createOrder(paymentPayload)
    if (!orderResposne) {
      return;
    }

    if (orderResposne.status === 200 || orderResposne.status === '200') {
      const addOnsPlayLoad = []
      if (purchase && purchase?.addOn) {
        purchase?.addOn.map((ele) => {
          addOnsPlayLoad.push({
            sellerId: userData?.userId,
            addOnId: ele?.addOn?.addOnId
          })
        })
      }
      const options = {
        key: DEV ? process.env.RAZORPAY_KEY_ID : process.env.RAZORPAY_KEY_ID,
        currency: "INR",
        amount: orderResposne.data.amount,
        order_id: orderResposne.data.orderId,
        name: 'hypestreet',
        image: logo,
        notes: {
          subscriptionPlanName: orderResposne.data.subscriptionPlanName,
          sellerAddOns: addOnsPlayLoad,
        },
        handler: async function (response) {
          // make payment request
          const requestPaymentPayload = {
            // amount: orderResposne.data.amount,
            orderId: orderResposne.data.orderId,
            // subscriptionPlanName: orderResposne.data.subscriptionPlanName,
            subscriptionPlanId: purchase.subscription,
            // addOns: orderResposne.data.addOns,
            sellerPaymentId: orderResposne.data.sellerPaymentId,
            sellerAddOns: addOnsPlayLoad,
            //handler res
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          }
          const requestPaymentRes = await paymentService.paymentRequest(requestPaymentPayload)
          if (!requestPaymentRes) {
            return;
          }
          if (requestPaymentRes.status === 200 || requestPaymentRes.status === '200') {
            if (requestPaymentRes.data.status === 'successfull') {

              const sellersResponse = await sellerService.getSellerById(userId);
              if (sellersResponse.data.isDocVerified) {
                const userAddonsActiveResponse = await AddSellerOnService.getActiveAddOns(userId);
                if (userAddonsActiveResponse.status === 200) {
                  dispatch({ type: 'userAddons', userAddons: userAddonsActiveResponse.data.rows });
                }
              }
              const sellerResponse = await sellerService.getSellerById(userId);
              if (sellerResponse.data.isDocVerified) {
                const userSubscritpionResponse = await UserSubscriptionService.getActiveSubscriptions(userId);
                dispatch({ type: 'userSubscriptionId', userSubscriptionId: userSubscritpionResponse.data.rows });
                toast.success("Payment successfull")
                navigate('/successfullpayment');
              } else {
                // dispatch({ type: 'userSubscriptionId', userSubscriptionId: userSubscritpionResponse.data.rows });
                toast.success("Payment successfull")
                navigate('/documentverification');

              }
            } else {
              toast.error("Payment fail")
            }
          }

        },
        prefill: {
          name: userData.userName,
          email: userData.email,
          phone_number: userData.mobileNo
        },

        theme: {
          hide_topbar: false,
          color: "#292826",
        },
        send_sms_hash: true,
      }
      const paymentObject = new window.Razorpay(options)
      paymentObject.open()

    }

  }

  return (
    <div className="row g-3">
      <div className="col-lg-7">
        <div className="invoice-section">
          <div className="box-left">
            <div className="invoice-header">
              <div className="row">
                <div className="col-6">
                  <ul>
                    <li> <span>Date:</span> {moment({ current }).format("ll")} </li>
                    <li> <span>Contact No:</span> {userData?.mobileNo} </li>
                    <li> <span>Email:</span> {userData?.email}</li>
                  </ul>
                </div>
                <div className="col-6">
                  <ul className="text-end">
                    <li> <span> Billed To </span> </li>
                    <li> {userData?.userName} </li>
                    <li className="address"> Netizens Technologies, India </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="h8">
              <div className="row m-0 border mb-3">
                <div className="col-9 h8 pe-0 ps-0 border-end">
                  <p className="textmuted py-2  border-bottom ps-2">Plan Name</p>
                  <span className="d-block p-2">{selectedSub?.subscriptionPlanName}</span>
                  {purchase && purchase?.addOn ?
                    <>
                      {purchase?.addOn.map((addonObj) => (
                        <React.Fragment key={addonObj?.addOn?.addOnId}>
                          <span className="d-block p-2">{addonObj?.addOn?.addOnName}</span>
                        </React.Fragment>
                      ))}

                    </>
                    : <></>
                  }
                </div>
                <div className="col-3 p-0 text-center h8">
                  <p className="textmuted p-2  border-bottom">Price</p>
                  <span className="d-block  py-2">
                    <span className="fas fa-dollar-sign"></span>
                    {selectedSub?.price}
                  </span>
                  {purchase && purchase?.addOn ?
                    <>
                      {purchase?.addOn.map((addonObj, index) => (
                        <React.Fragment key={index}>
                          <span className="d-block py-2 ">
                            <span className="fas fa-dollar-sign"></span>
                            {addonObj?.addOn?.price}
                          </span>
                        </React.Fragment>
                      ))}
                    </>
                    : <></>
                  }
                </div>
              </div>
              <div className="text-end">
                <div className="d-inline-block ml-auto h7 mb-2">
                  <p className="mb-2"> <b> Total Amount : </b> <span className="fas fa-dollar-sign"></span>
                    {total}</p>
                  <div className="">
                    <div className="form">
                      <div className="btn btn-primary d-block h8" onClick={() => setVisible(true)}>
                        PAY NOW
                      </div>
                      <CModal alignment='center' visible={visible}>
                        <CModalHeader>
                          <CModalTitle>Purchase Subscription?</CModalTitle>
                        </CModalHeader>
                        <CModalBody>After successful payment you will need to upload documents for verification purpose.</CModalBody>
                        <CModalFooter>
                          <CButton color="primary" onClick={buySubscription}>Ok</CButton>
                        </CModalFooter>
                      </CModal>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
