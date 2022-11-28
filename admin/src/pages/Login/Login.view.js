import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import Toast from "../../utils/toast";
import { AuthPost, tokenCheck } from "../../services/auth.service";
import "./Login.css";
import show from "../../assets/images/show.svg"
import hide from "../../assets/images/hide.svg"

const Login = () => {
  const history = useHistory();
  const [showPswd, setShowPswd] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm();

  const handleSubmitLogin = async (e) => {
    console.log(e)
    const loginResponse = await AuthPost(e);
    if (!loginResponse) {
      return;
    }
    const accessToken = loginResponse.data.accessToken;
    const user = JSON.stringify(loginResponse.data.user);
    localStorage.setItem("userAccess", `Bearer ${accessToken}`);
    localStorage.setItem("user", user);
    const verifyUser = await tokenCheck();
    if (!verifyUser) {
      return;
    }
    if (verifyUser.status === 200 || verifyUser.status === "200") {
      if (loginResponse.status === 200 || loginResponse.status === "200") {
        Toast("success", "Log in successful");
        history.push("/dashboard");
      } else {
        Toast("error", "Log in failed");
      }
    } else {
      Toast("error", "You are not authorized");
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center auth px-0">
        <div className="row w-100 mx-0">
          <div className="col-sm-10 col-md-8 col-lg-6 col-xl-4 mx-auto">
            <div className="auth-form-light text-left py-5 px-2 px-sm-4 px-sm-5">
              <div className="brand-logo">
                <img src={require("../../assets/images/logo.svg")} alt="logo" />
              </div>
              <h4>Hello! let's get started</h4>
              <h6 className="font-weight-light">Sign in to continue.</h6>
              <form className="pt-3" onSubmit={handleSubmit(handleSubmitLogin)}>
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
                  <div className="pwd-container">
                    <input
                      type={showPswd ? 'text' : 'password'}
                      className="form-control form-control-lg pr-5"
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
                    <span className="showpass" onClick={() => setShowPswd(!showPswd)}>
                      {
                        showPswd ? (<>
                          <img src={hide} alt="hide" />
                        </>) : (<>
                          <img src={show} alt="show" />
                        </>)
                      }
                    </span>
                  </div>
                  {errors.password && (
                    <span className="error-msg">
                      {errors.password?.message}
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <input
                    type="submit"
                    className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                    value="Sign In"
                  />
                </div>
                <div className="my-2 d-flex justify-content-between align-items-center">
                  <div className="form-check">
                    <label className="form-check-label text-muted">
                      <input type="checkbox" className="form-check-input" />
                      <i className="input-helper"></i>
                      Keep me signed in
                    </label>
                  </div>
                  <Link to="/forgot-password" className="auth-link text-black">
                    Forgot password?
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

export default Login;
