import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilPhone } from '@coreui/icons'
import { useDispatch } from 'react-redux'
import { AuthService } from 'src/services/auth';
import { UserSubscriptionService } from 'src/services/userSubscription';
import { setMobileNo, setToken } from 'src/utils/localstorage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Divider from 'src/components/divider/Divider';
import { AddSellerOnService } from 'src/services/userAddOns';
import LoginImg from '../../../assets/images/login.svg';
import show from '../../../assets/images/show.svg';
import hide from '../../../assets/images/hide.svg';

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userLogin, setUserLogin] = useState([])
  // Configuring React-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger
  } = useForm();

  const {
    register: otpRegister,
    handleSubmit: handleOTPSubmit,
    formState: { errors: otpErrors },
    trigger: otpTrigger
  } = useForm();


  const handleSubmitLogin = async (e) => {
    const { email, password } = e;
    const loginResponse = await AuthService.userLogin({ email, password });
    if (!loginResponse) {
      return;
    }
    if (loginResponse && loginResponse.status && (loginResponse.status === 200 || loginResponse.status === '200')) {
      const accessToken = loginResponse.data.accessToken;
      const user = JSON.stringify(loginResponse.data.user);
      setUserLogin(loginResponse.data)
      setToken(accessToken);
      dispatch({ type: 'user', user: user }) // setting user in redux
      toast.success('Log in successful');
      if (loginResponse.data.user.isSubscribed) {
        if (loginResponse.data.user.isDocVerified) {
          const userSubscritpionResponse = await UserSubscriptionService.getActiveSubscriptions(loginResponse.data.user.userId);
          if (!userSubscritpionResponse) {
            return;
          }
          const userActiveAddonsResponse = await AddSellerOnService.getActiveAddOns(loginResponse.data.user.userId);
          if (!userActiveAddonsResponse) {
            return;
          }
          dispatch({ type: 'getSubscription', subscription: userSubscritpionResponse.data.subscriptionPlanId });
          dispatch({ type: 'userSubscriptionId', userSubscriptionId: userSubscritpionResponse.data.rows });
          dispatch({ type: 'userAddons', userAddons: userActiveAddonsResponse.data.rows });
          // navigate('/dashboard');
        }
      }
    }
  }

  const handleOTPSubmitLogin = async (e) => {
    try {
      const getOTPResponse = await AuthService.getOTP(e);
      if (!getOTPResponse) {
        return;
      }
      if (getOTPResponse.status === 200 || getOTPResponse.status === '200') {
        setMobileNo(e.mobileNo)
        const PhoneNumber = e.mobileNo
        // navigate('/componentB',{state:{id:1,name:'sabaoon'}});
        navigate('/submit-otp', { state: { mobileNo: PhoneNumber } });
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center login justify-content-center">
      <CRow className="justify-content-center">
        <CCol lg={10} xl={10}>
          <CCardGroup className='mx-3'>
            <CCard className="p-2 p-md-4">
              <CCardBody>
                <CForm onSubmit={handleSubmit(handleSubmitLogin)}>
                  <h1>Login</h1>
                  <p className="text-medium-emphasis">Sign In to your account</p>

                  <div className='mb-3'>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        id="email"
                        placeholder="Email"
                        autoComplete="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i,
                            message: "Invalid email address",
                          },
                        })}
                        onKeyUp={() => {
                          trigger("email");
                        }}
                      />
                    </CInputGroup>
                    {errors.email && (
                      <small className="error-msg">{errors.email?.message}</small>
                    )}
                  </div>
                  <div className='mb-4'>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type={showPass ? 'text' : 'password'}
                        id="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters long",
                          },
                        })}
                        onKeyUp={() => {
                          trigger("password");
                        }}
                      />
                      <span className='showPass' onClick={() => setShowPass(!showPass)}>
                        {
                          showPass ? (<>
                            <img src={hide} />
                          </>) : (<>
                            <img src={show} />
                          </>)
                        }
                      </span>

                    </CInputGroup>
                    {errors.password && (
                      <small className="error-msg">{errors.password?.message}</small>
                    )}
                  </div>
                  <CRow className='align-items-center'>
                    <CCol xs={6}>
                      <CButton type="submit" color="primary" className="px-4">
                        Login
                      </CButton>
                    </CCol>
                    <CCol xs={6} className="text-right">
                      <div color="link" className="forgot" onClick={() => navigate('/forgetPassword')}>
                        Forgot password?
                      </div>
                    </CCol>
                  </CRow>
                </CForm>
                <Divider>Or</Divider>
                <CForm onSubmit={handleOTPSubmit(handleOTPSubmitLogin)}>
                  <p className="text-medium-emphasis">Sign In with your mobile number </p>
                  {otpErrors.mobileNo && (
                    <span className='error-msg'>
                      {otpErrors.mobileNo?.message}
                    </span>
                  )}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilPhone} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      id="mobileNo"
                      name="mobileNo"
                      placeholder="Mobile Number"
                      {...otpRegister("mobileNo", {
                        required: "Mobile number is required",
                        pattern: {
                          value: /^(0|91)?[6-9][0-9]{9}$/,
                          message: "Invalid mobile number"
                        },
                      })}
                      onKeyUp={() => {
                        otpTrigger("mobileNo");
                      }}
                    />
                  </CInputGroup>
                  <div className="d-grid gap-2">
                    <CButton type="submit">Get OTP</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard className="text-white login-right bg-primary py-5">
              <CCardBody className="text-center">
                <div>
                  <h2>Get Started!</h2>
                  <p>
                    Log in or sign up using your mobile number.
                  </p>
                  <p>
                    If you are an existing user then you can login with your email and password too!.
                  </p>
                  <img src={LoginImg} className="mt-4" alt='Image' />
                  {/* <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link> */}
                </div>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </div>

  )
}

export default Login
