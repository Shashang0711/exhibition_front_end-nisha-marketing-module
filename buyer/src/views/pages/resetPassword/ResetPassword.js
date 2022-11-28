import React from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthService } from '../../../services/auth';
// import forgot from '../../../assets/images/forgot.svg';
import userInput from '../../../assets/images/icon/user-input.svg';
import bottomImg from '../../../assets/images/bottom-img.svg';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
        watch,
        reset
    } = useForm();
    const handleResetPassword = async (e) => {
        const payload = {
            token,
            newPassword: e.password,
        };
        const resetPasswordRes = await AuthService.resetPassword(payload);
        if (!resetPasswordRes) {
            return;
        }
        if (resetPasswordRes.status === "200" || resetPasswordRes.status === 200) {
            toast.success("success", "Your password has been reset successfully");
            navigate('/')


        } else {
            toast.error("error", "Something went wrong, try again");
        }
    };
    return (
        <>
            <div className="app-sc login-sc forgot-password-sc">
                <div>
                    <div className="app-img">
                        <img src="assets/images/forgot.svg" alt="Image_sr" />
                    </div>
                    <div className="forgot-title">
                        <h2>Reset Your Password ?</h2>
                    </div>
                    <form method="POST" className="form wow fadeIn" data-wow-duration="1.5s" onSubmit={handleSubmit(handleResetPassword)}>
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
                                <div className="icon"><img src={userInput} alt="Icon" /></div>
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
                                <div className="icon"><img src={userInput} alt="Icon" /></div>
                            </div>
                            {errors.confirmPassword && (
                                <span className='text-danger'>
                                    {errors.confirmPassword?.message}
                                </span>
                            )}
                        </div>
                        <div className="theme-button">
                            <button type="submit" className="app-btn w-100"> Forgot Password</button>
                        </div>
                        <div className="already justify-content-center">
                            <p>Back to login ? <a onClick={() => navigate('/')}> Log in </a></p>
                        </div>
                    </form>
                </div>
                <div className="bottom-img">
                    <img src={bottomImg} alt="Image_src" />
                </div>
            </div>
            {/* <h1>reset password</h1>
            <form  onSubmit={handleSubmit(handleResetPassword)}>
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
                        {/* <div className="icon"><img src={password_input} alt="Icon" /></div> */}
            {/* </div>
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
                       
                    </div>
                    {errors.confirmPassword && (
                        <span className='text-danger'>
                            {errors.confirmPassword?.message}
                        </span>
                    )}
                </div>
                <button type='submit'>submit</button>
            </form> */}
        </>
    )
}

export default ResetPassword