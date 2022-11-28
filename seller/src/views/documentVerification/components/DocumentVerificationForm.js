import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CCardImage
} from '@coreui/react';
import IdentityProof from './formSteps/IdentityProof';
import Passbook from './formSteps/Passbook';
import './DocumentVerificationForm.css'
import { useFormData } from 'src/context';
import { useSelector } from 'react-redux';

const DocumentVerificationForm = () => {
  const navigate = useNavigate();
  const userFromRedux = useSelector((state) => state.user);
  const user = userFromRedux ? JSON.parse((userFromRedux)) : ""

  const [currentTab, setCurrentTab] = useState(0);
  const [displayTab, setDisplayTab] = useState(<></>);
  const [errorMessage, SetErrorMessage] = useState("")
  const [disableBtn, setDisableBtn] = useState(true)

  useEffect(() => {
    docStateFun()
  }, [])

  const docStateFun = () => {
    if (user?.documents?.isVerified === 'Verified') {
      navigate('/dashboard')
    } else if (user?.documents?.isVerified === "Pending" || user?.documents?.isVerified === "Rejected") {
      if (user?.documents?.isIDVerified === "Verified" || user?.documents?.isIDVerified === "Pending") {
        setCurrentTab(1)
        SetErrorMessage("Your document is rejected please upload valid data")
      } else {
        setCurrentTab(0)
        SetErrorMessage("Your document is rejected please upload valid data")
      }
    } else {
      setCurrentTab(0)

    }
  }


  const prevTab = () => {
    if (currentTab !== 0) {
      setCurrentTab(currentTab - 1)
      console.log("1")
    }
  }

  const nextTab = () => {
    if (currentTab !== formSteps.length - 1) {
      setDisableBtn(false)
      setCurrentTab(currentTab + 1)
      console.log("next")
    }
  }
  const formSteps = [
    <IdentityProof nextTab={nextTab} disableBtn={disableBtn} setDisableBtn={setDisableBtn} />,
    <Passbook prevTab={prevTab} nextTab={nextTab} />
  ];

  useEffect(() => {
    setDisplayTab(formSteps[currentTab])
  }, [currentTab, disableBtn, setDisableBtn]);

  // Add active class for current step
  const isActive = (value) => {
    return 'step ' + ((value === currentTab) ? 'active' : '');
  }

  return (
    <>
      <div className="app-table">

        <CRow className="justify-content-center">
          <CCol xs={12} xl={11} xxl={9}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Document Verification</strong>
              </CCardHeader>
              <span
                style={{
                  color: "red",
                  textAlign: "center",
                  padding: "5px"
                }}
              >
                {errorMessage}
              </span>
              <CCardBody>
                <div className='app-step mb-4'>
                  <div className={isActive(0)}><span>1</span>Identity Proof</div>
                  <div className={isActive(1)}><span>2</span>Account Statement of Last 6 Months</div>
                </div>
                <CRow>
                  <CCol xs={0} lg={6}>
                    <CCardImage orientation="top" src={require('../../../assets/images/Document_Verification.jpg')} />
                  </CCol>
                  <CCol xs={12} lg={6}>
                    {displayTab}
                  </CCol>

                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    </>
  );
}

export default DocumentVerificationForm;
