import React, { useEffect, useState } from "react";
import { CRow, CCol, CCard, CCardHeader, CCardBody, CButton } from '@coreui/react';
import SubscriptionForm from './components/SubscriptionForm/SubscriptionForm';
import { AddOnService } from 'src/services/addOns'
import { useNavigate } from "react-router-dom";
import { getUserFromRedux } from "src/utils/userFromredux/getUserFromRedux";
import { useSelector } from "react-redux";
const Subscriptions = () => {
  const userFromRedux = useSelector((state) => state.user);
  const user = getUserFromRedux(userFromRedux)


  const [purchase, setPurchase] = useState({
    subscription: '',
    addOn: [],
  });
  const navigate = useNavigate();
  const [addList, setAddonList] = useState([])

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


  return (
    <CRow>
      <CCol xs={12}>
        <div className="app-table mb-4">

          <CCard>
            <CCardHeader>
              <strong>Purchase Subscription</strong>
              {user && user?.documents && user?.documents?.isVerified === 'Verified' ?
                <>
                </>
                :

                <CButton color="secondary" onClick={() => {
                  navigate("/documentverification")
                }}>Back</CButton>

              }
            </CCardHeader>
            <CCardBody>
              <SubscriptionForm purchase={purchase} setPurchase={setPurchase} addList={addList} />
            </CCardBody>
          </CCard>
        </div>
      </CCol>
    </CRow>
  );
}

export default Subscriptions;
