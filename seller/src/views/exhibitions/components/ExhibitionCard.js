import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CRow,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMediaPlay, cilOptions } from '@coreui/icons'
import { toast } from "react-toastify";
import { exhService } from 'src/services/exhibitions'
import { getExhibitonExtendEndDate, getExtendOption } from 'src/utils/date/exhibitonDate'
import { loadScript } from 'src/utils/loadScript'
import { DEV, imageUrl, razorCheckoutUrl } from 'src/constants/constants'
import { paymentService } from 'src/services/payment'
import logo from "../../../assets/images/favicon.svg"
import { useSelector } from 'react-redux'
import ExhibitionAddEditModal from './ExhibitionAddEditModal'

const ExhibitionCard = ({ exhibition, fetchExhibitions, index, operation }) => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const totalSub = "599";
  const userData = useSelector((state) => state.user);
  const user = JSON.parse(userData)

  let style
  if (exhibition.exhibitionStatus === "rejected") {
    style = {
      "--cui-card-cap-bg": '#3b5998',
      "opacity": 0.3
    }
  } else {
    style = {
      "--cui-card-cap-bg": '#3b5998',
    }
  }

  const sendForApprovalExhibition = async () => {
    const exApprovalExRes = await exhService.sendForApprovalExhibition({ exhibitionId: exhibition.exhibitionId })
    if (!exApprovalExRes) {
      return;
    }
    if (exApprovalExRes.status === 200) {
      fetchExhibitions();
      toast.success(exApprovalExRes.data)
    } else {
      toast.error("something went worng")
    }
  }

  const extendExhibition = async () => {

    // loading razjor pay UI
    const res = await loadScript(razorCheckoutUrl)
    if (!res) {
      toast.warn('Razorpay SDK failed to load. Are you online?')
      return;
    }

    const paymentPayload = {
      amount: totalSub * 100,
      exhibitionId: exhibition?.exhibitionId,
      exhibitionName: exhibition.exhibitionName,
      paymentPurpose: 'Extend'
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
          exhibitionName: orderResposne.data.exhibitionName,
        },
        handler: async function (response) {
          // make payment request
          const requestPaymentPayload = {
            orderId: orderResposne.data.orderId,
            exhibitionId: exhibition?.exhibitionId,
            sellerPaymentId: orderResposne.data.sellerPaymentId,
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
              const exEndDate = exhibition.exhibitionId;
              const ExhibitionEndDate = await getExhibitonExtendEndDate(exEndDate);
              if (!ExhibitionEndDate) {
                return;
              }
              const payload = {
                exhibitionId: exhibition.exhibitionId,
                newEndDate: exhibition.exhibitionEndDate
              }

              const extendExhibitionRes = await exhService.extendExhibiton(payload);
              if (!extendExhibitionRes) {
                return;
              }
              if (extendExhibitionRes.status === 200 || extendExhibitionRes.status === '200') {
                setVisible(true)
                toast.success(extendExhibitionRes.data)
                navigate('/successfullpayment')
              }
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

  // console.log("exhibition", exhibition)

  return (
    <React.Fragment key={index}>
      <div className="card" style={style}>
        <div className="card-header position-relative d-flex justify-content-center align-items-center">
          <CDropdown alignment="end" style={{ 'position': 'absolute', 'top': 10, 'right': 10 }}>
            <CDropdownToggle color="transparent" caret={false} className="p-0">
              <CIcon icon={cilOptions} className="" />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem href={`/inventory/viewExhibitionDetail/ViewExhibitionDetail/${exhibition.exhibitionId}`}>View Details</CDropdownItem>
              {exhibition.exhibitionStatus !== "rejected" ?
                <>
                  <CDropdownItem href={`/inventory/exhibitions/exhibitionproducts/${exhibition.exhibitionId}`}>Add/View Products</CDropdownItem>
                  <CDropdownItem onClick={() => {
                    navigator.clipboard.writeText(exhibition?.shareLink);
                    toast.info(`Link of ${exhibition.exhibitionName} exhibition copied`);
                  }}>Copy Link</CDropdownItem>
                  <CDropdownItem onClick={() => setVisible(!visible)}>
                    Extends Exhibiton
                  </CDropdownItem>


                  {exhibition.exhibitionStatus === "pending" ?
                    <>
                      <CDropdownItem onClick={sendForApprovalExhibition}>Send For Approval</CDropdownItem>
                      <CDropdownItem >

                        {/* <ExhibitionAddEditModal operation='Edit' /> */}


                      </CDropdownItem>
                    </>
                    : <></>}
                </>
                : <></>}
            </CDropdownMenu>
          </CDropdown>
          <CModal alignment='center' visible={visible} onClose={() => setVisible(false)}>
            <CModalHeader onClose={() => setVisible(false)}>
              <CModalTitle>Extend Subscription </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CRow>
                <div className='app-table extendexhibition'>
                  <div className='payment-click'>
                    <div className='pay-card'>
                      <h5>Total Payment</h5>
                      <h6>{totalSub}$</h6>
                      <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry.  </p>
                      <div className="btn btn-secondary w-100"
                        // onClick={() => setVisible(true)}
                        onClick={extendExhibition}

                      >
                        PAY NOW
                      </div>
                    </div>
                  </div>
                </div>
              </CRow>
            </CModalBody>
          </CModal>
          <img src={imageUrl + exhibition.exhibitionImage} height="100" width="100" alt='exhibitionImage' />
        </div>
        <div className="card-body text-center">
          <div className="col">
            <div className="fs-5 fw-semibold">Title</div>
            <div className="text-uppercase text-medium-emphasis small">{exhibition.exhibitionName}</div>
          </div>
          <div className="vr"></div>
          <div className="col">
            <div className="fs-5 fw-semibold">Status</div>
            <div className="text-uppercase text-medium-emphasis small">{exhibition.exhibitionStatus}</div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ExhibitionCard
