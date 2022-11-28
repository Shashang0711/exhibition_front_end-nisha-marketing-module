import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import Toast from "../../utils/toast";
import { forgotPassword } from "../../services/auth.service";

const ForgotPassword = () => {
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm();

  const handleForgotPassword = async (e) => {
    const forgotPasswordRes = await forgotPassword(e);
    if (!forgotPasswordRes) {
      return;
    }
    if (
      forgotPasswordRes.status === 200 ||
      forgotPasswordRes.status === "200"
    ) {
      const { resetPasswordLink } = forgotPasswordRes.data;
      Toast("success", "Please check the email");
      history.push(resetPasswordLink);
    } else {
      Toast("error", "Something went wrong, try again");
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center auth px-0">
        <div className="row w-100 mx-0">
          <div className="col-lg-4 mx-auto">
            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
              <div className="brand-logo">
                <img src={require("../../assets/images/logo.svg")} alt="logo" />
              </div>
              <h4>Forgot your password?</h4>
              <h6 className="font-weight-light">
                Enter your email to receive a link to reset your password.
              </h6>
              <form
                className="pt-3"
                onSubmit={handleSubmit(handleForgotPassword)}
              >
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    id="exampleInputEmail1"
                    placeholder="Email"
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
                  {errors.email && (
                    <span className="error-msg">{errors.email?.message}</span>
                  )}
                </div>
                <div className="my-2 mt-3">
                  <input
                    type="submit"
                    className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                    value="Submit"
                  />
                </div>
                <div style={{ textAlign: "center" }}>
                  Back to?

                  <u>
                    <span color="link" className="ms-2" onClick={() => history.push('/')}>
                      <strong> login</strong>
                    </span>
                  </u>
                </div>
              </form >
            </div >
          </div >
        </div >
      </div >
    </div >
  );
};

export default ForgotPassword;
