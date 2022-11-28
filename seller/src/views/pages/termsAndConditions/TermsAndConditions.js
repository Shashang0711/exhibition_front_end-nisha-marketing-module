import React from 'react'
import { CRow, CCol, CButton, CCard, CCardHeader, CCardBody, CContainer } from '@coreui/react';
import { useNavigate } from 'react-router-dom';


const TermsAndConditions = () => {
    const navigate = useNavigate()
    return (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CCard className="mb-4 overflow-auto">
                    <CCardHeader>
                        <strong>Terms And Conditions</strong>
                    </CCardHeader>
                    <CCardBody className="exhibition-card">

                        <CButton onClick={() => navigate('/register')}>Back</CButton>

                    </CCardBody>
                </CCard>
            </CContainer>
        </div>

    )
}

export default TermsAndConditions