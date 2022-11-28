import React from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { userAuth } from '../../../redux/action/action';
import { AuthService } from '../../../services/auth'
import { UserService } from '../../../services/user';
import home from '../../../assets/images/icon/home.svg';
import back from '../../../assets/images/icon/back-arrow.svg';

function ProfilUpdate() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
        watch,
        reset,
        setValue
    } = useForm();

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const userFromRedux = useSelector((state) => state.user);
    const user = JSON.parse(JSON.stringify(userFromRedux));
    const updateProfile = async (e) => {
        console.log(e)
        const payload = {
            email: e.email,
            mobileNo: e.mobileNo,
            userName: e.userName
        }
        const profileRes = await UserService.updateProfile(payload)
        if (profileRes.status === 200 || profileRes.status === '200') {
            console.log("profileRes", profileRes.data)
            const profileUser =  profileRes.data
            dispatch(userAuth(profileUser))
            navigate('/profileupdate')

        }
    }

    return (
        <div className='app-sc profile-edit-sc'>
            <div className='app-header'>
                <div className='back'>
                    <a href="#!"><img src={back} alt="Back" /></a>  
                </div>
                <div className='title'>
                    Your Information
                </div>
                <div className='wishlist mr-3'>
                    <a href='#!'><img src={home} alt="Home" onClick={()=>navigate('/')}/></a>
                </div>
            </div>
            <form onSubmit={handleSubmit(updateProfile)}>
                <div className='row'>
                    <div className='form-group col-12 col-sm-6'>
                        <label>Name</label>
                        <input type="text" className='app-input' placeholder="Enter Your Name"
                            {...register("userName", {
                                required: "Email is required",

                            })}
                            onKeyUp={() => {
                                trigger("userName");
                            }}
                            defaultValue={user.userName}
                        ></input>
                        {errors.userName && (
                            <span className='error-msg text-danger'>
                                {errors.userName?.message}
                            </span>
                        )}
                    </div>
                    <div className='form-group col-12 col-sm-6'>
                        <label>Email</label>
                        <input type="text" className='app-input' placeholder="Enter Your Email"
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
                            defaultValue={user.email}
                        ></input>
                        {errors.email && (
                            <span className='error-msg text-danger'>
                                {errors.email?.message}
                            </span>
                        )}
                    </div>
                    <div className='form-group col-12 col-sm-6'>
                        <label>Phone Number</label>
                        <input type="text" className='app-input' placeholder="Enter Your Phone Number"
                            {...register("mobileNo", {
                                required: "Mobile number is required",
                                pattern: {
                                    value: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
                                    message: "Invalid mobile number"
                                },
                            })}
                            defaultValue={user.mobileNo}
                            // value={getMobileNo()}
                            onKeyUp={() => {
                                trigger("mobileNo");
                            }}
                        ></input>
                            {errors.mobileNo && (
                            <span className='error-msg text-danger'>
                                {errors.mobileNo?.message}
                            </span>
                        )}
                    </div>
                </div>
                <button className='app-btn w-100' type="submit">Submit Details</button>
            </form>

        </div>
    )
}

export default ProfilUpdate