import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthService } from '../../../services/auth';
// import forgot from '../../../assets/images/forgot.svg';
import userInput from '../../../assets/images/icon/user-input.svg';
import bottomImg from '../../../assets/images/bottom-img.svg';
import forgotImg from '../../../assets/images/forgot.svg'

const ForgetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset
  } = useForm();
  const navigate = useNavigate();

  const handleSubmitforgetPwd = async (e) => {

    const forgetPassword = await AuthService.forgetPassword({
      email: e.email
    })
    console.log("forgetPassword", forgetPassword)
    if (!forgetPassword) {
      return;
    }
    if (forgetPassword.status === 200 || forgetPassword.status === '200') {
      toast.success("Please check email.")
    }


  }
  return (
    <>
      <div className="app-sc login-sc forgot-password-sc">
        <div>
          <div className="app-img">
            <img src={forgotImg} alt="Image_sr" />
          </div>
          <div className="forgot-title">
            <h2>Forgot Your Password ?</h2>
          </div>
          <form method="POST" className="form wow fadeIn" data-wow-duration="1.5s" onSubmit={handleSubmit(handleSubmitforgetPwd)}>
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
                <div className="icon"><img src={userInput} alt="Icon" /></div>
              </div>
                {errors.email && (
                  <small className="error-msg text-danger">{errors.email?.message}</small>
                )}
            </div>
            <div className="theme-button">
              <button type="submit" className="app-btn w-100"> Reset Password</button>
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
      {/* <h1>Forget password</h1>
      <form onSubmit={handleSubmit(handleSubmitforgetPwd)}>
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

          </div>
          {errors.email && (
            <small className="error-msg text-danger">{errors.email?.message}</small>
          )}
        </div>

        <div className="theme-button">
          <button type="submit" className="app-btn w-100"> Get OTP</button>
        </div>
      </form> */}
    </>
  )
}

export default ForgetPassword