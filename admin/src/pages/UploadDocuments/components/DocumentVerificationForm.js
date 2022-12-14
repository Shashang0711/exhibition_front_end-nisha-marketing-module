import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardImage
} from '@coreui/react';
import IdentityProof from './formSteps/IdentityProof';
import Passbook from './formSteps/Passbook';
import './DocumentVerificationForm.css'
const DocumentVerificationForm = () => {
  const navigate = useHistory();
  // const userFromRedux = useSelector((state) => state.user);
  // const user = userFromRedux ? JSON.parse((userFromRedux)) : ""

  const user = JSON.parse(localStorage.getItem("user"));

  const [currentTab, setCurrentTab] = useState(0);
  const [displayTab, setDisplayTab] = useState(<></>);
  const [errorMessage, SetErrorMessage] = useState("")
  const [disableBtn, setDisableBtn] = useState(true)

  // useEffect(() => {
  //   docStateFun()
  // }, [])

  // const docStateFun = () => {
  //   if (user?.documents?.isVerified === 'Verified') {
  //     navigate.push('/dashboard')
  //   } else if (user?.documents?.isVerified === "Pending" || user?.documents?.isVerified === "Rejected") {
  //     if (user?.documents?.isIDVerified === "Verified" || user?.documents?.isIDVerified === "Pending") {
  //       setCurrentTab(1)
  //       SetErrorMessage("Your document is rejected please upload valid data")
  //     } else {
  //       setCurrentTab(0)
  //       SetErrorMessage("Your document is rejected please upload valid data")
  //     }
  //   } else {
  //     setCurrentTab(0)

  //   }
  // }


  const prevTab = () => {
    if (currentTab !== 0) {
      setCurrentTab(currentTab - 1)
      console.log("pre")
    }
  }

  const nextTab = () => {
    if (currentTab !== formSteps.length - 1) {
      // setDisableBtn(false)
      setCurrentTab(currentTab + 1)
      console.log("nextr")
    }
  }
  const formSteps = [
    <IdentityProof nextTab={nextTab} disableBtn={disableBtn} setDisableBtn={setDisableBtn} />,
    <Passbook prevTab={prevTab} nextTab={nextTab} />
  ];

  useEffect(() => {
    setDisplayTab(formSteps[currentTab])
  }, [
    currentTab,
    disableBtn,
    setDisableBtn
  ]);

  // Add active class for current step
  const isActive = (value) => {
    return 'step ' + ((value === currentTab) ? 'active' : '');
  }

  return (
    <>
      <div className="app-table">
        <div className="page-header d-flex justify-content-between flex-wrap">
          <h3 className="page-title mb-2">
            <span className="page-title-icon bg-gradient-primary text-white mr-2">
              <i className="mdi mdi-home"></i>
            </span>{" "}
            Document Verification
          </h3>
        </div>
        <CRow className="justify-content-center">
          <CCol xs={12}>
            <CCard className="mb-4">
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
                <div className={isActive(0)}><span>1</span>Register</div>
                  <div className={isActive(1)}><span>2</span>Identity Proof</div>
                  <div className={isActive(2)}><span>3</span>Account Statement of Last 6 Months</div>
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
