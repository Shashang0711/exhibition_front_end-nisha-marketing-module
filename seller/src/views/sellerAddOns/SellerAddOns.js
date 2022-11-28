import react, { useEffect, useState } from 'react';
import { CRow, CCol, CCard, CCardBody, CButton, CAvatar, CCardHeader } from '@coreui/react';
import { AddOnService } from 'src/services/addOns';
import React from 'react';
import { AddSellerOnService } from 'src/services/userAddOns';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'
import { loadScript } from 'src/utils/loadScript';
import { DEV, imageUrl, razorCheckoutUrl } from 'src/constants/constants';
import { paymentService } from 'src/services/payment';
import logo from "../../assets/images/favicon.svg"
import { useNavigate } from 'react-router-dom';
import { getUserFromRedux } from 'src/utils/userFromredux/getUserFromRedux';
const SellerAddOns = () => {
  const [addOnList, setAddonList] = useState([])
  const userFromRedux = useSelector((state) => state.user);
  const user = getUserFromRedux(userFromRedux);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchAddOns = async () => {
    const addOnsRes = await AddOnService.getAddOns();
    if (!addOnsRes) {
      return;
    }
    if (addOnsRes.status === 200 || addOnsRes.status === '200') {
      setAddonList(addOnsRes.data);
    }
  }

  useEffect(() => {
    fetchAddOns();
  }, [])

  const purchaseAddons = async (addons) => {

    // loading razjor pay UI
    const res = await loadScript(razorCheckoutUrl)
    if (!res) {
      toast.warn('Razorpay SDK failed to load. Are you online?')
      return;
    }

    //create order
    const paymentPayload = {
      amount: addons.price * 100,
      addOns: addons.addOnName,
      paymentPurpose: 'Addon'
    }
    const orderResposne = await paymentService.createOrder(paymentPayload)
    if (!orderResposne) {
      return;
    }
    if (orderResposne.status === 200 || orderResposne.status === '200') {


      const options = {
        key: DEV ? process.env.RAZORPAY_KEY_ID : process.env.RAZORPAY_KEY_ID,
        currency: "INR",
        amount: orderResposne.data.amount,
        order_id: orderResposne.data.orderId,
        name: 'hypestreet',
        image: logo,
        notes: {
          // subscriptionPlanName: orderResposne.data.subscriptionPlanName,
          sellerAddOns: addons.addOnName,
        },
        handler: async function (response) {
          // make payment request
          const requestPaymentPayload = {
            orderId: orderResposne.data.orderId,
            sellerPaymentId: orderResposne.data.sellerPaymentId,
            sellerAddOns: [{
              addOnId: addons.addOnId,
              sellerId: user.userId
            }],

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
              const userAddonsActiveResponse = await AddSellerOnService.getActiveAddOns(user?.userId);
              if (userAddonsActiveResponse.status === 200) {
                dispatch({ type: 'userAddons', userAddons: userAddonsActiveResponse.data.rows });
                navigate('/successfullpayment');
              }
            } else {
              toast.error("Payment fail")
            }
          }

        },
        prefill: {
          name: user.userName,
          email: user.email,
          phone_number: user.mobileNo
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
    <>
      <CRow>
        <CCol xs={12}>
          <div className='app-table'>
            <CCard className="mb-4 overflow-auto">
              <CCardHeader>
                <strong>Improve Your Customer's Experience With The Add Ons</strong>
              </CCardHeader>
              <CCardBody>
                <CRow className='mb-3 g-3'>
                  {addOnList.map((ele, index) =>
                    <React.Fragment key={index}>
                      <CCol xs={12} xl={6}>
                        <CCard>
                          <CCardBody className='border'>
                            <CRow>
                              <CCol className='d-flex align-items-center' xs={12}>
                                <div className='me-3'>
                                  <CAvatar size="lg" src={imageUrl + ele.image} />
                                </div>
                                <div className='flex-grow-1 me-2'>
                                  <h6>{ele.addOnName}</h6>
                                  <span>Tired of adding products by yourself  ? Price of addOn ₹ : {ele.price} only.</span>
                                </div>
                                <CButton onClick={() => purchaseAddons(ele)}>Pay ₹{ele.price}</CButton>
                              </CCol>
                            </CRow>
                          </CCardBody>
                        </CCard>
                      </CCol>

                    </React.Fragment>
                  )}
                </CRow>
              </CCardBody>
            </CCard>
          </div>
        </CCol>
      </CRow>
    </>
  );
}

export default SellerAddOns;
