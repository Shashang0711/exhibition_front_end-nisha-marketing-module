import React from 'react';
import { useNavigate } from 'react-router-dom';
import { setMobileNo } from '../../../utils/localstorage';
import { useForm } from 'react-hook-form';
import '../../../assets/style/style.css';
import { AuthService } from '../../../services/auth';
import user_input from '../../../assets/images/icon/user-input.svg';
import phone_input from '../../../assets/images/icon/phone-input.svg';
import password_input from '../../../assets/images/icon/password-input.svg'

const Register = ({
    activeTab,
    setActiveTab,
    mobileNum
}) => {
  
    // Configuring React-hook-form
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
        watch,
        reset
    } = useForm();

    const handleRegister = async (e) => {
        const payLoad = {
            email: e.email,
            password: e.password,
            mobileNo: e.mobileNo,
        }
        setMobileNo(e.mobileNo);
        const regiterResponse = await AuthService.registerBuyer(payLoad);
        if (!regiterResponse) {
            return;
        }
        if (regiterResponse.status === 200 || regiterResponse.status === '200') {
            navigate('/submit-otp');
        }
        reset();
    }


    return (
        <>
            <div className={activeTab ? 'tab-pane fade show active' : 'tab-pane fade'} id="signup" role="tabpanel" aria-labelledby="signup-tab" tabIndex="0">
                <form method="POST" className="form wow fadeIn" data-wow-duration="1.5s" onSubmit={handleSubmit(handleRegister)}>
                    <div className="form-row">
                        <div className="form-group col-12 icon">
                            <label className="app-label">Email address</label>
                            <input type="email" name="email" className="app-input" required=""
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
                            <span className='text-danger'>
                                {errors.email?.message}
                            </span>
                        )}
                    </div>
                    <div className="form-row">
                        <div className="form-group col-12 icon">
                            <label className="app-label">Phone No</label>
                            <input type="text" name="phone" className="app-input" required=""
                                {...register("mobileNo", {
                                    required: "Mobile number is required",
                                    pattern: {
                                        value: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
                                        message: "Invalid mobile number"
                                    },
                                })}
                                defaultValue={mobileNum ? mobileNum : ""}
                                // value={getMobileNo()}
                                onKeyUp={() => {
                                    trigger("mobileNo");
                                }}
                            />
                            <div className="icon"><img src={phone_input} alt="Icon" /></div>
                        </div>
                        {errors.mobileNo && (
                            <span className='text-danger'>
                                {errors.mobileNo?.message}
                            </span>
                        )}
                    </div>
                    <div className="form-row">
                        <div className="form-group col-12 icon">
                            <label className="app-label">Password</label>
                            <input type="password" name="password" className="app-input" required=""
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
                            <div className="icon"><img src={password_input} alt="Icon" /></div>
                        </div>
                        {errors.password && (
                            <small className="text-danger">{errors.password.message}</small>
                        )}
                    </div>
                    <div className="form-row">
                        <div className="form-group col-12 icon">
                            <label className="app-label">Confirm Password</label>
                            <input type="password" name="password" className="app-input" required=""
                                {...register('confirmPassword', {
                                    required: 'Confirm password is required',
                                    validate: (val) => {
                                        if (watch('password') !== val) {
                                            return 'Your passwords do not match';
                                        }
                                    }
                                })}
                                onKeyUp={() => {
                                    trigger('confirmPassword');
                                }}

                            />
                            <div className="icon"><img src={password_input} alt="Icon" /></div>
                        </div>
                        {errors.confirmPassword && (
                            <span className='text-danger'>
                                {errors.confirmPassword?.message}
                            </span>
                        )}
                    </div>
                    <div className="remember justify-content-center">
                        <label className="custom-check-box">I Agree With <a href="#!">privacy</a> and <a
                            href="#!">policy</a> <input type="checkbox" name="terms"
                                id="terms"

                                {...register("privacy", {
                                    required: "term condition is required",

                                })}
                                onKeyUp={() => {
                                    trigger("privacy");
                                }}
                            /><span className="checkmark"></span></label>
                        {errors.privacy && (
                            <span className='text-danger'>
                                {errors.privacy?.message}
                            </span>
                        )}
                    </div>
                    <div className="theme-button">
                        <button type="submit" className="app-btn w-100"> Sign Up</button>
                    </div>
                    <div className="already justify-content-center">
                        <p>Already have an account ? <a onClick={() => setActiveTab(0)}> Log in </a></p>
                    </div>
                </form>
            </div>
         

            {/* {getMobileNo() ? */}
            {/* <>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit(handleRegister)}>
                        <label>email</label>
                        <input type="text"
                            className={`${errors.email && "invalid"}`}
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

                        ></input>

                        <label>phone</label>
                        <input type="text"
                            className={`${errors.mobileNo && "invalid"}`}
                            {...register("mobileNo", {
                                required: "Mobile number is required",
                                pattern: {
                                    value: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
                                    message: "Invalid mobile number"
                                },
                            })}
                            // defaultValue={getMobileNo()}
                            // value={getMobileNo()}
                            onKeyUp={() => {
                                trigger("mobileNo");
                            }}
                        ></input>
                        {errors.mobileNo && (
                            <span className='error-msg'>
                                {errors.mobileNo?.message}
                            </span>
                        )}

                        <label>password</label>
                        <input type="password"
                            className={`${errors.password && "invalid"}`}
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

                        ></input>

                        {errors.password && (
                            <small className="text-danger">{errors.password.message}</small>
                        )}

                        <label>conform password</label>
                        <input type="password"
                            {...register('confirmPassword', {
                                required: 'Confirm password is required',
                                validate: (val) => {
                                    if (watch('password') !== val) {
                                        return 'Your passwords do not match';
                                    }
                                }
                            })}
                            onKeyUp={() => {
                                trigger('confirmPassword');
                            }}
                        ></input>
                        {errors.confirmPassword && (
                            <span className='error-msg'>
                                {errors.confirmPassword?.message}
                            </span>
                        )}
                        <button type="submit">submit</button>
                    </form>
                </> */}
            {/* : <Page404 />} */}

        </>
    )
}

export default Register


