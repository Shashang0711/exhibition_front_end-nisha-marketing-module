import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { AuthService } from '../../../services/auth';
import { setMobileNo, setToken } from '../../../utils/localstorage';
import { userAuth } from '../../../redux/action/action';
import google from '../../../assets/images/icon/google.svg';
import facebook from '../../../assets/images/icon/facebook.svg';
import instagram from '../../../assets/images/icon/instagram.svg';
import loginPng from '../../../assets/images/login.png';
import user_input from '../../../assets/images/icon/user-input.svg';
import password_input from '../../../assets/images/icon/password-input.svg';
import phone_input from '../../../assets/images/icon/phone-input.svg';
import Register from '../register/Register';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState(0);
    const [mobileNum, setMobileNum] = useState(null);


    // Configuring React-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
        reset
    } = useForm();

    const {
        register: otpRegister,
        handleSubmit: handleOTPSubmit,
        formState: { errors: otpErrors },
        trigger: otpTrigger,
        reset: otpReset
    } = useForm();

    const handleSubmitLogin = async (e) => {
        const { email, password } = e;
        const loginResponse = await AuthService.userLogin({ email, password });
        if (!loginResponse) {
            return;
        }
        if (loginResponse.status === 200 || loginResponse.status === '200') {
            const accessToken = loginResponse.data.accessToken;
            setToken(accessToken);
            const user = loginResponse.data.buyer;
            console.log("loginResponse.data.buyer",loginResponse.data.buyer)
            console.log("user login", user)
            dispatch(userAuth(user)) // setting user in redux
            navigate('/home');
            toast.success(loginResponse.data.message);
            console.log("e", loginResponse);
        }
        reset();
    }

    const handleOTPSubmitLogin = async (e) => {
        const getOtpResponse = await AuthService.getOTP(e);
        if (!getOtpResponse) {
            return;
        }
        if (getOtpResponse.status === 200 || getOtpResponse.status === '200') {
            console.log(getOtpResponse.data.otp);
            if (getOtpResponse.data.registered === false) {
                // setMobileNo(e.mobileNo);
                console.log("getOtpResponse", getOtpResponse)
                alert("Your new user")
                setMobileNum(e.mobileNo)
                setMobileNo(e.mobileNo)
                setActiveTab(1)
            } else {
                console.log("11");
                setMobileNo(e.mobileNo);
                navigate('/submit-otp');
            }
        }
        otpReset();
    }


    return (
        <div className="app-sc login-sc">
            <div className="app-img">
                <img src={loginPng} alt="loginPng" />
            </div>
            <ul className="nav nav-pills" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation" onClick={() => setActiveTab(0)}>
                    {activeTab === 0 ?
                        <button className="nav-link active" id="login-tab" data-bs-toggle="pill" data-bs-target="#login"
                            type="button" role="tab" aria-controls="login" aria-selected="true">Log in</button>

                        : <button className="nav-link" id="login-tab" data-bs-toggle="pill" data-bs-target="#login"
                            type="button" role="tab" aria-controls="login" aria-selected="false">Log in</button>}
                </li>
                <li className="nav-item" role="presentation" onClick={() => setActiveTab(1)}>
                    {activeTab === 1 ?
                        <button className="nav-link active" id="signup-tab" data-bs-toggle="pill" data-bs-target="#signup" type="button"
                            role="tab" aria-controls="signup" aria-selected="true">Sign up</button>
                        :
                        <button className="nav-link" id="signup-tab" data-bs-toggle="pill" data-bs-target="#signup" type="button"
                            role="tab" aria-controls="signup" aria-selected="false">Sign up</button>
                    }
                </li>
            </ul>
            {/* "tab-pane fade show active" */}
            <div className="tab-content" id="pills-tabContent">
                <div className={activeTab ? 'tab-pane fade' : 'tab-pane fade show active'} id="login" role="tabpanel" aria-labelledby="login-tab" tabIndex="0">
                    <form method="POST" className="form wow fadeIn" data-wow-duration="1.5s" onSubmit={handleSubmit(handleSubmitLogin)}>
                        <div className="form-row">
                            <div className="form-group col-12 icon">
                                <label className="app-label">Email</label>
                                <input type="text" name="email" required=""
                                    className={`app-input ${errors.email && "invalid"}`}
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address",
                                        },
                                    })}
                                    onKeyUp={() => {
                                        trigger("email");
                                    }}
                                />
                                <div className="icon"><img src={user_input} alt="Icon" /></div>
                            </div>
                            {errors.email && (
                                <small className="error-msg text-danger">{errors.email?.message}</small>
                            )}
                        </div>
                        <div className="form-row">
                            <div className="form-group col-12 icon">
                                <label className="app-label">Password</label>
                                <input type="password" name="password" required=""
                                    className={`app-input ${errors.password && "invalid"}`}
                                    {...register("password", {
                                        required: 'Password is required',
                                        pattern: {
                                            // value: /^(\S)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])[a-zA-Z0-9~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]{10,16}$/,
                                            value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/i,
                                            message: 'Password should include at least one uppercase, one numeric value and one special character'
                                        },
                                        minLength: {
                                            value: 8,
                                            message: 'Minimum Required length is 8'
                                        },
                                        maxLength: {
                                            value: 20,
                                            message: "Maximum Required length is 20",
                                        },
                                    })}
                                    onKeyUp={() => {
                                        trigger("password");
                                    }}

                                />
                                <div className="icon"><img src={password_input} alt="Icon"
                                /></div>
                            </div>
                            {errors.password && (
                                <small className="text-danger">{errors.password.message}</small>
                            )}
                        </div>
                        <div className="remember">
                            <label className="custom-check-box">Remember Me<input type="checkbox" name="terms" id="terms" /><span
                                className="checkmark"></span></label>
                            <a className="forgot-pass" href="#!" data-bs-toggle="modal"
                                data-bs-target="#forgot-modal" onClick={() => navigate('/forgetpassword')}>Forgot Password?</a>
                        </div>
                        <div className="theme-button">
                            <button type="submit" className="app-btn w-100"> Sign In</button>
                        </div>
                    </form>
                    <form method="POST" className="form wow fadeIn" data-wow-duration="1.5s" onSubmit={handleOTPSubmit(handleOTPSubmitLogin)}>
                        <div className="form-row">
                            <div className="form-group col-12">
                                <h6 className="or">OR</h6>
                            </div>
                            <div className="form-group col-12 icon">
                                <label className="app-label">Phone No</label>
                                <input type="text" name="phone" required=""
                                    className={`app-input ${errors.mobileNo && "invalid"}`}
                                    {...otpRegister("mobileNo", {
                                        required: "Mobile number is required",
                                        pattern: {
                                            value: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
                                            message: "Invalid mobile number"
                                        },
                                    })}

                                    onKeyUp={() => {
                                        otpTrigger("mobileNo");
                                    }}


                                />
                                <div className="icon"><img src={phone_input} alt="Icon" /></div>
                            </div>
                            {otpErrors.mobileNo && (
                                <span className="text-danger">
                                    {otpErrors.mobileNo?.message}
                                </span>
                            )}
                        </div>
                        <div className="theme-button">
                            <button type="submit" className="app-btn w-100"> Get OTP</button>
                        </div>
                        <div className="already justify-content-center">
                            <p>Don’t have an account ? <a onClick={() => setActiveTab(1)}> Sign Up </a></p>
                        </div>
                    </form>
                </div>

                <Register activeTab={activeTab} setActiveTab={setActiveTab} mobileNum={mobileNum} />

            </div>
            <div className="social-login">
                <ul>
                    <li><a href="#!"><img src={google} alt="Google" /></a></li>
                    <li><a href="#!"><img src={facebook} alt="Facebook" /></a></li>
                    <li><a href="#!"><img src={instagram} alt="Instagram" /></a></li>
                </ul>
            </div>
        </div>
    )
}

export default Login