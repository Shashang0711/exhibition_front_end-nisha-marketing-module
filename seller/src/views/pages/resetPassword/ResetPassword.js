import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import {
    CButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
import { AuthService } from 'src/services/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import show from '../../../assets/images/show.svg';
import hide from '../../../assets/images/hide.svg';

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

    const [showPass, setShowPass] = useState(false);

    return (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center login">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={8} lg={6} xl={5} xxl={4}>
                        <CCardGroup>
                            <CCard className="p-2 p-md-4">
                                <CCardBody>
                                    <CForm onSubmit={handleSubmit(handleResetPassword)}>
                                        <h1 className='text-center'>Reset Password</h1>
                                        <p className="text-medium-emphasis text-center">Reset your password</p>
                                        <div className='mb-3'>
                                            <CInputGroup>
                                                <CInputGroupText>
                                                    <CIcon icon={cilLockLocked} />
                                                </CInputGroupText>
                                                <CFormInput
                                                    type={showPass ? 'text' : 'password'}
                                                    id="password"
                                                    placeholder="Enter password"
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
                                                <span className='showPass' onClick={() => setShowPass(!showPass)}>
                                                    {
                                                        showPass ? (<>
                                                            <img src={hide}></img>
                                                        </>) : (<>
                                                            <img src={show}></img>
                                                        </>)
                                                    }
                                                </span>
                                            </CInputGroup>
                                            {errors.password && (
                                                <small className="text-danger">{errors.password.message}</small>
                                            )}
                                        </div>

                                        <div className='mb-3'>
                                            <CInputGroup>
                                                <CInputGroupText>
                                                    <CIcon icon={cilLockLocked} />
                                                </CInputGroupText>
                                                <CFormInput
                                                    type="password"
                                                    id="password"
                                                    placeholder="Enter confirm password"
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
                                            </CInputGroup>
                                            {errors.confirmPassword && (
                                                <span className='text-danger'>
                                                    {errors.confirmPassword?.message}
                                                </span>
                                            )}
                                        </div>

                                        <CRow>
                                            <CCol xs={12}>
                                                <CButton type="submit" color="primary" className="px-4 w-100">
                                                    Update Password
                                                </CButton>
                                            </CCol>

                                        </CRow>
                                    </CForm>
                                </CCardBody>
                            </CCard>

                        </CCardGroup>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}

export default ResetPassword