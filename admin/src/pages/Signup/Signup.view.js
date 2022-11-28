import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import Toast from "../../utils/toast";
import { registerSeller } from "../../services/auth.service/index";

const Signup = () => {
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm();

  const handleSubmitRegister = async (e) => {
    const payload = {
      userName: e.userName,
      email: e.email,
      password: e.password,
      mobileNo: e.mobileNo,
    };
    const registerResponse = await registerSeller(payload);
    if (!registerResponse) {
      return;
    }
    if (registerResponse.status === "201" || registerResponse.status === 201) {
      Toast("success", "User created");
      history.push("/");
    } else {
      Toast("error", "Use not created");
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
              <h4>New here?</h4>
              <h6 className="font-weight-light">
                Signing up is easy. It only takes a few steps
              </h6>
              <form
                className="pt-3"
                onSubmit={handleSubmit(handleSubmitRegister)}
              >
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="exampleInputUserName1"
                    placeholder="Username"
                    {...register("userName", {
                      required: "Username is required",
                      minLength: {
                        value: 3,
                        message: "Username must be at least 3 characters long",
                      },
                    })}
                    onKeyUp={() => {
                      trigger("userName");
                    }}
                  />
                  {errors.userName && (
                    <span className="error-msg">
                      {errors.userName?.message}
                    </span>
                  )}
                </div>
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
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    id="exampleInputPassword1"
                    placeholder="Password"
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
                  {errors.password && (
                    <span className="error-msg">
                      {errors.password?.message}
                    </span>
                  )}
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
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="exampleInputMobileNo1"
                    placeholder="Mobile Number"
                    {...register("mobileNo", {
                      required: "Mobile number is required",
                      pattern: {
                        value:
                          /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
                        message: "Invalid mobile number",
                      },
                    })}
                    onKeyUp={() => {
                      trigger("mobileNo");
                    }}
                  />
                  {errors.mobileNo && (
                    <span className="error-msg">
                      {errors.mobileNo?.message}
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <div className="form-check">
                    <label className="form-check-label text-muted">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        {...register("terms", {
                          required:
                            "You can't continue without accepting our terms & conditions",
                        })}
                        onKeyUp={() => {
                          trigger("terms");
                        }}
                      />
                      <i className="input-helper"></i>I agree to all Terms &
                      Conditions
                    </label>
                    {errors.terms && (
                      <span className="error-msg">{errors.terms?.message}</span>
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <input
                    type="submit"
                    className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                    value="Sign Up"
                  />
                </div>
                <div className="text-center mt-4 font-weight-light">
                  Already have an account?{" "}
                  <Link to="/" className="text-primary">
                    Login
                  </Link>
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
