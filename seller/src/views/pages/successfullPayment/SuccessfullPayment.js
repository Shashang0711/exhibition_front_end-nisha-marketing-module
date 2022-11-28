// import React from 'react'

// const SuccessfullPayment = () => {
//     return (
//         <div>SuccessfullPayment</div>
//     )
// }

// export default SuccessfullPayment

import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    CButton,
    CCol,
    CContainer,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMagnifyingGlass } from '@coreui/icons'
import { removeToken } from 'src/utils/localstorage'
import { useDispatch } from 'react-redux'

import thankyou from '../../../assets/images/thankyou.svg'

const SuccessfullPayment = () => {
    const navigate = useNavigate();
    const goToHome = () => {
        navigate('/dashboard');
    }

    return (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={6} className="text-center py-3">
                        <span className="clearfix">
                            <img src={thankyou} className="w-100" alt="thankyou" />
                            <h1 className="display-3 me-4">Thank You</h1>
                            <p className="text-medium-emphasis float-start">
                                We have received your Payment. We will get back to you within two business days and verify your documents.
                            </p>
                        </span>
                        <CButton color="info" className='btn btn-primary' onClick={goToHome}>Processed to dashboard</CButton>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}

export default SuccessfullPayment
