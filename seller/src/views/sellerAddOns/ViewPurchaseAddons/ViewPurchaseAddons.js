import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { CRow, CCol, CCard, CCardBody, CButton, CAvatar, CCardHeader } from '@coreui/react';
import { AddSellerOnService } from 'src/services/userAddOns';
import { getUserFromRedux } from 'src/utils/userFromredux/getUserFromRedux';
import { imageUrl } from 'src/constants/constants';

const ViewPurchaseAddons = () => {
  const [addOnsList, setAddOnsList] = useState([])
  const userFromRedux = useSelector((state) => state.user);
  const user = getUserFromRedux(userFromRedux);
  const [AddOnsData, setAddOnsData] = useState([])

  const countAddOnsData = () => {
    let tempObj = JSON.parse(JSON.stringify(AddOnsData));
    for (const addOns of addOnsList) {
      const purchaseAddOns = addOns?.addOn?.addOnName;
      tempObj = tempObj.map((data) => {
        if (data.addOnName === purchaseAddOns) {
          data.count += 1;
        }
        return data;
      })
    }
    setAddOnsData(tempObj);
  }

  useEffect(() => {
    countAddOnsData();
  }, [addOnsList])
  useEffect(() => {
    fetchAddOns();
  }, [])


  const fetchAddOns = async () => {
    const purchaseListRes = await AddSellerOnService.getActiveAddOns(user.userId);
    if (!purchaseListRes) {
      return;
    }
    if (purchaseListRes.status === 200 || purchaseListRes.status === '200') {
      setAddOnsList(purchaseListRes.data.rows);
      const countArray = []
      purchaseListRes?.data?.rows.map((ele) =>
        countArray.push(
          { addOnName: ele?.addOn?.addOnName, count: 0 },
        )
      )
      setAddOnsData(countArray)
    }
  }
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <div className='app-table'>
            <CCard className="mb-4 overflow-auto">
              <CCardHeader>
                <strong>Purchase Add Ons Plan</strong>
              </CCardHeader>
              <CCardBody>
                <>
                  {[...new Map(addOnsList.map(item => [item?.addOnId, item])).values()].length <= 0 ?
                    <h4 className='no-data-found'>No Data Found</h4>

                    : <></>}
                </>
                <CRow className='mb-3 g-3'>

                  <>
                    {[...new Map(addOnsList.map(item => [item?.addOnId, item])).values()].map((ele, index) => {
                      const ind = AddOnsData.findIndex(data => data.addOnName === ele?.addOn?.addOnName);
                      if (AddOnsData[ind]?.count > 0) {
                        return (<React.Fragment key={index} >
                          <CCol md={6} lg={4}>
                            <CCard>
                              <CCardBody className='border'>
                                <CRow>
                                  <CCol className='d-flex align-items-center' xs={12}>
                                    <div className='me-3'>
                                      <CAvatar size="lg" src={imageUrl + ele?.addOn?.image} />
                                    </div>
                                    <div className='flex-grow-1 me-2'>
                                      <h6>{ele?.addOn?.addOnName}</h6>
                                      <span>{ele?.addOn?.price}</span>
                                    </div>
                                    <CButton>{AddOnsData[ind].count}</CButton>
                                  </CCol>
                                </CRow>
                              </CCardBody>
                            </CCard>
                          </CCol>
                        </React.Fragment>
                        )
                      }
                    })}
                  </>
                </CRow>
              </CCardBody>
            </CCard>
          </div>
        </CCol>
      </CRow>
    </>
  )
}

export default ViewPurchaseAddons