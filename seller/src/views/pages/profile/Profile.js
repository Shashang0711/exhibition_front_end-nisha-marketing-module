import React from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput, CFormLabel, CRow } from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserService } from 'src/services/user';
import { getUserFromRedux } from 'src/utils/userFromredux/getUserFromRedux';
import { toast } from 'react-toastify';

const Profile = () => {
    const userFromRedux = useSelector((state) => state.user);
    const user = getUserFromRedux(userFromRedux);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
    } = useForm();

    const updateProfile = async (e) => {
        e.email = user.email;
        e.mobileNo = user.mobileNo;
        const payload = {
            email: e.email,
            mobileNo: e.mobileNo,
            userName: e.userName
        }
        const profileRes = await UserService.updateProfile(payload);
        if (!profileRes) {
            return;
        }
        if (profileRes.status === 200 || profileRes.status === '200') {
            const userProfile = JSON.stringify(profileRes.data);
            dispatch({ type: 'user', user: userProfile })
            toast.success("Profile updated succesfully.")
            navigate('/profile')
        }
    }

    return (
        <>
            <CRow>
                <div className='app-table'>
                    <CCol xs={12}>
                        <CCard className="mb-4 overflow-auto">
                            <CCardHeader>
                                <h3>Profile Update</h3>
                                <CButton color="dark" variant="outline" onClick={() => navigate('/dashboard')}>Back</CButton>
                            </CCardHeader>
                            <CCardBody>
                                <CForm onSubmit={handleSubmit(updateProfile)}>
                                    <CRow className="mb-3">
                                        <CFormLabel htmlFor="staticUserName" className="col-sm-2 col-form-label">Full Name</CFormLabel>
                                        <CCol sm={6}>
                                            <CFormInput type="text" id="staticUserName"
                                                defaultValue={user.userName}
                                                {...register("userName", {
                                                    required: "Fullname is required",
                                                    minLength: {
                                                        value: 3,
                                                        message: 'Username must be at least 3 characters long',
                                                    },
                                                    maxLength: {
                                                        value: 25,
                                                        message: "Username must be not so characters long"
                                                    },
                                                    pattern: {
                                                        value: /^[A-Za-z ]+$/i,
                                                        message: "Please input alphabet characters only"
                                                    }

                                                })}
                                                onKeyUp={() => {
                                                    trigger("userName");
                                                }}
                                                placeholder="Enter fullname"
                                            />
                                            {errors.userName && (
                                                <span className='error-msg text-danger'>
                                                    {errors.userName?.message}
                                                </span>
                                            )}
                                        </CCol>
                                    </CRow>
                                    <CRow className="mb-3">
                                        <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">Email</CFormLabel>
                                        <CCol sm={6}>
                                            <CFormInput type="text" id="staticEmail"
                                                defaultValue={user.email}
                                                disabled
                                                // {...register("email", {
                                                //     required: "Email is required",
                                                //     pattern: {
                                                //         value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                //         message: "Invalid email address",
                                                //     },
                                                // })}
                                                // onKeyUp={() => {
                                                //     trigger("email");
                                                // }}
                                                placeholder="Enter email"
                                            />
                                            {errors.email && (
                                                <span className='error-msg text-danger'>
                                                    {errors.email?.message}
                                                </span>
                                            )}
                                        </CCol>
                                    </CRow>

                                    <CRow className="mb-3">
                                        <CFormLabel htmlFor="staticNumber" className="col-sm-2 col-form-label">Phone Number</CFormLabel>
                                        <CCol sm={6}>
                                            <CFormInput type="text" id="staticNumber"
                                                defaultValue={user.mobileNo}
                                                disabled
                                                // {...register("mobileNo", {
                                                //     required: "Mobile number is required",
                                                //     pattern: {
                                                //         value: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
                                                //         message: "Invalid mobile number"
                                                //     },
                                                // })}
                                                // onKeyUp={() => {
                                                //     trigger("mobileNo");
                                                // }}
                                                placeholder="Enter mobile number"
                                            />
                                            {errors.mobileNo && (
                                                <span className='error-msg text-danger'>
                                                    {errors.mobileNo?.message}
                                                </span>
                                            )}

                                        </CCol>
                                    </CRow>

                                    <CRow className="mb-3">

                                        <CCol className="mb-3">
                                            <CButton color="primary" type='submit' variant="outline">Update</CButton>

                                        </CCol>

                                    </CRow>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </div>
            </CRow>
        </>
    )
}

export default Profile

