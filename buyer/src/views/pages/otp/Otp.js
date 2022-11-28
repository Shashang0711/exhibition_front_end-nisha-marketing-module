import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import OtpInput from 'react18-input-otp';
import { AuthService } from '../../../services/auth';
import { getMobileNo, setToken } from '../../../utils/localstorage';
import { userAuth } from '../../../redux/action/action';
import bottom from '../../../assets/images/bottom-img.svg';
import otp_svg from '../../../assets/images/otp.png';
// import OtpListener from '../../../services/otpListener';

const Otp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState();
  const mobileNo = getMobileNo();

  const [timer, setTimer] = useState(30);    
  const timeOutCallback = useCallback(() => setTimer(currTimer => currTimer - 1), []);

  useEffect(() => {
    timer > 0 && setTimeout(timeOutCallback, 1000);
  }, [timer, timeOutCallback]);

  const handleOTPChange = (otp) => {
    setOtp(otp);
  }

  const submitOTP = async (e) => {
    e.preventDefault();
    const otpResponse = await AuthService.submitOTP({ mobileNo, otp });
    console.log("otpResponse", otpResponse);
    if (!otpResponse) {
      return;
    }
    if (otpResponse.status === 200 || otpResponse.status === '200') {
      const accessToken = otpResponse.data.accessToken;
      setToken(accessToken);
      const user = otpResponse.data.buyer;
      console.log("user otp", user)
      dispatch(userAuth(user)) // setting user in redux
      navigate("/home");
      toast.success(otpResponse.data.message);
    }
  }

  const resendOtp = async () => {
    const mobileNo = getMobileNo();
    console.log("mobileNo", mobileNo)
    const resendOtp = await AuthService.resendOtp({ mobileNo });
    if (resendOtp.status === 200 || resendOtp.status === '200') {
      setTimer(30);
    }

  }

  return (
    <>
      {/* <OtpListener /> */}
      <div className="app-sc otp-sc">
        <div>
          <div className="app-img">
            <img src={otp_svg} alt="img-otp" />
          </div>
          <div className="otp-title">
            <h2>OTP Vertification</h2>
            <p>Please enter 4-digit code sent to you at
              +91 {mobileNo}</p>
          </div>
          <form method="POST" className="form wow fadeIn" data-wow-duration="1.5s" onSubmit={submitOTP}>
            <div className="form-row">
              <div className="form-group">
                <div className="otp-inputs">
                  <OtpInput
                    value={otp}
                    onChange={handleOTPChange}
                    numInputs={4}
                    separator={<span style={{ width: "8px" }}></span>}
                    isInputNum={true}
                    shouldAutoFocus={true}
                    inputStyle={
                      {
                        borderBottom: "3px solid #000",
                        margin: "0 10px",
                        maxWidth: "40px",
                        transition: "0.3s all",
                        fontSize: "30px",
                        color: "#000",
                        fontWeight: "500",
                        lineHeight: "1.5",
                        textAlign: "center",
                        caretColor: "#F9C337",
                      }
                    }
                    focusStyle={
                      {
                        borderBottom: "3px solid #F9C337",
                        outline: "none"
                      }
                    }
                    containerStyle={
                      {
                        justifyContent: 'center'
                      }
                    }
                  />
                  {/* <input type="text" maxlength="1" data-index="0" />
                  <input type="text" maxlength="1" data-index="1" />
                  <input type="text" maxlength="1" data-index="2" />
                  <input type="text" maxlength="1" data-index="3" /> */}
                </div>
              </div>
              {
                timer 
                ? 
                <div className="form-group col-12 ">
                  <p className="resend-otp">Resend OTP in 00:{String(timer).padStart(2, '0')}</p>
                </div>
                :
                <div className="form-group col-12 " onClick={resendOtp}>
                  <a href="#!" className="resend-otp">Resend OTP</a>
                </div>  
              }

            </div>
            <div className="theme-button">
              {
                otp && otp.length === 4 ?
                  <button type="submit" className="app-btn w-100"> Verify </button>
                  :
                  <button type="submit" className="app-btn w-100" disabled> Verify </button>
              }

            </div>
          </form>

        </div>
        <div className="bottom-img">
          <img src={bottom} alt="image_btn" />
        </div>
      </div>


    </>
  )
}

export default Otp