import React, { useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Toast from "../../utils/toast";
import { resetPassword } from "../../services/auth.service/index";
import show from "../../assets/images/show.svg"
import hide from "../../assets/images/hide.svg"

const Signup = () => {
  const history = useHistory();
  const { token } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm();

  const handleResetPassword = async (e) => {
    const payload = {
      token,
      newPassword: e.password,
    };
    const resetPasswordRes = await resetPassword(payload);
    if (!resetPasswordRes) {
      return;
    }
    if (resetPasswordRes.status === "200" || resetPasswordRes.status === 200) {
      Toast("success", "Your password has been reset successfully");
      history.push("/");
    } else {
      Toast("error", "Something went wrong, try again");
    }
  };

  const [showPass, setShowPass] = useState(false)

  return (
    <div>
      <div className="d-flex align-items-center auth px-0">
        <div className="row w-100 mx-0">
          <div className="col-lg-4 mx-auto">
            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
              <div className="brand-logo">
                <img src={require("../../assets/images/logo.svg")} alt="logo" />
              </div>
              <h4>New here?</h4>
              <h6 className="font-weight-light">
                Signing up is easy. It only takes a few steps
              </h6>
              <form
                className="pt-3"
                onSubmit={handleSubmit(handleResetPassword)}
              >
                <div className="form-group">
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="form-control form-control-lg"
                    id="exampleInputPassword1"
                    placeholder="Password"
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value: /^((?!.*[\s])(?=.*[A-Z])(?=.*\d).{8,15})+$/i,
                        message: 'Password should include at least one uppercase, one numeric value and one special character'
                      },
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters long",
                      },
                    })}
                    onKeyUp={() => {
                      trigger("password");
                    }}
                  />
                  {errors.password && (
                    <span className="error-msg">
                      {errors.password?.message}
                    </span>
                  )}
                  <span className="showpass" onClick={() => setShowPass(!showPass)}>
                    {
                      showPass ? (<>
                        <img src={hide} />
                      </>) : (<>
                        <img src={show} />
                      </>)
                    }
                  </span>
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    {...register("confirmPassword", {
                      required: "Confirm password is required",
                      validate: (val) => {
                        if (watch("password") !== val) {
                          return "Your passwords do no match";
                        }
                      },
                    })}
                    onKeyUp={() => {
                      trigger("confirmPassword");
                    }}
                  />
                  {errors.confirmPassword && (
                    <span className="error-msg">
                      {errors.confirmPassword?.message}
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <input
                    type="submit"
                    className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                    value="Reset Password"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
