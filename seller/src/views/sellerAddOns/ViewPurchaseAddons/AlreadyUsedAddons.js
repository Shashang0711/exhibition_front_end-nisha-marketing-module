import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { CRow, CCol, CCard, CCardBody, CButton, CAvatar, CCardHeader } from '@coreui/react';
import { AddSellerOnService } from 'src/services/userAddOns';
import { getUserFromRedux } from 'src/utils/userFromredux/getUserFromRedux';
import { imageUrl } from 'src/constants/constants';
function AlreadyusedAddons() {
  const [activeAddOnsList, setActiveAddOnsList] = useState([])
  const userFromRedux = useSelector((state) => state.user);
  const user = getUserFromRedux(userFromRedux);


  useEffect(() => {
    fetchActiveAddOns();
  }, [])


  const fetchActiveAddOns = async () => {
    const activeAddonsRes = await AddSellerOnService.getActiveAddOnsByStatus(user.userId);
    if (!activeAddonsRes) {
      return;
    }
    if (activeAddonsRes.status === 200 || activeAddonsRes.status === '200') {
      setActiveAddOnsList(activeAddonsRes.data.rows);
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
                  {activeAddOnsList.length <= 0 ?
                    <h4 className='no-data-found'>No Data Found</h4>

                    : <></>}
                </>
                <CRow className='mb-3 g-3'>
                  <>
                    {activeAddOnsList.map((ele, index) => {
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
                                    <span>Activated on : {ele?.exhibitionSellerAddOns[0]?.exhibition?.exhibitionName}</span>
                                  </div>
                                </CCol>
                              </CRow>
                            </CCardBody>
                          </CCard>
                        </CCol>
                      </React.Fragment>
                      )
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

export default AlreadyusedAddons