import React, { useState, useEffect, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CRow,
} from '@coreui/react'
import OtpInput from 'react18-input-otp';
import { AuthService } from 'src/services/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMobileNo, setMobileNo, setToken } from 'src/utils/localstorage';
import { UserSubscriptionService } from 'src/services/userSubscription';

const Login = () => {
  const { state } = useLocation();

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const [otp, setOtp] = useState();


  /// OTP timer:

  const [timer, setTimer] = useState(30);
  const timeOutCallback = useCallback(() => setTimer(currTimer => currTimer - 1), []);

  useEffect(() => {
    timer > 0 && setTimeout(timeOutCallback, 1000);
  }, [timer, timeOutCallback]);



  const handleOTPChange = (otp) => {
    setOtp(otp);
  }

  const submitOTP = async (e) => {

    try {
      e.preventDefault();
      const loginResponse = await AuthService.submitOTP({ otp, mobileNo: state.mobileNo });
      if (!loginResponse) {
        return;
      }
      if (loginResponse.status === 200 || loginResponse.status === '200') {
        if (loginResponse.data.newAccount === true) {
          setMobileNo(loginResponse.data.mobileNo);
          navigate('/register')
        } else {
          const accessToken = loginResponse.data.accessToken;
          const user = JSON.stringify(loginResponse.data.user);
          setToken(accessToken);
          dispatch({ type: 'user', user: user });
          toast.success('Log in successful');
          if (loginResponse.data.user.isSubscribed) {
            if (loginResponse.data.user.isDocVerified) {
              const userSubscritpionResponse = await UserSubscriptionService.getActiveSubscriptions(loginResponse.data.user.userId);
              dispatch({ type: 'getSubscription', subscription: userSubscritpionResponse.data.subscriptionPlanId });
              // dispatch({ type: 'getSubscription', subscription: userSubscritpionResponse.data.subscriptionPlanId });
              // const userWithSubscription = JSON.stringify({ ...user, userSubscriptionId: userSubscritpionResponse.data.userSubscriptionId });
              // dispatch({ type: 'user', user: userWithSubscription });
              dispatch({ type: 'userSubscriptionId', userSubscriptionId: userSubscritpionResponse.data.rows });
              navigate('/dashboard');
            } else {
              navigate('/thank-you');
            }
          } else {
            navigate('/purchase/subscriptions');
          }
          setOtp()
        }
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  const resendOtp = async () => {
    setTimer(60);
    const mobileNo = state.mobileNo
    const resendOtp = await AuthService.resendOtp({ mobileNo });
    if (resendOtp.status === 200 || resendOtp.status === '200') {
      setOtp()
      toast.success("OTP resend successfully")
    } else {
      toast.success("OTP not send successfully")
    }

  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center otp">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8} lg={6} xl={5} xxl={4}>
            <CCard className="p-2 p-md-4">
              <CCardBody className='CCardBody'>
                <div className='text-center mb-4'>
                  <h3>Enter the 5 digit OTP</h3>
                  <p>
                    Enter the 5 digit OTP that you have received on your given mobile number.
                  </p>
                  {/* <Link to="/register">
                        <CButton color="primary" className="mt-3" active tabIndex={-1}>
                          Register Now!
                        </CButton>
                      </Link> */}
                </div>
                <CForm className='digit-group' onSubmit={submitOTP}>
                  <OtpInput
                    value={otp}
                    onChange={handleOTPChange}
                    numInputs={5}
                    separator={<span style={{ width: "8px" }}></span>}
                    isInputNum={true}
                    shouldAutoFocus={true}
                    inputStyle={
                      {
                        border: "1px solid #CFD3DB",
                        borderRadius: "8px",
                        width: "50px",
                        height: "50px",
                        fontSize: "20px",
                        color: "#000",
                        fontWeight: "600",
                        caretColor: "#CFD3DB"
                      }
                    }
                    focusStyle={
                      {
                        border: "1px solid #F9C337",
                        outline: "none"
                      }
                    }
                    containerStyle={
                      {
                        justifyContent: 'center'
                      }
                    }
                  />
                  <br />
                  <div className="d-grid gap-2 mb-4 mt-2">
                    {
                      otp && otp.length === 5 ?
                        <CButton type="submit">Submit</CButton>
                        :
                        <CButton type="submit" disabled>Submit</CButton>
                    }
                  </div>

                  <div className='resend text-center'>
                    {timer ?
                      <div className="form-group col-12 ">
                        <p className="resend-otp">Resend OTP in 00:{String(timer).padStart(2, '0')}</p>
                      </div>
                      :
                      <span>Didn't recieve OTP?  <strong>
                        <u onClick={resendOtp}>
                          Resend
                        </u>
                      </strong></span>
                    }
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
