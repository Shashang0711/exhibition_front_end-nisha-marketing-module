import React from 'react'
import { useNavigate } from 'react-router-dom'
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
import { cilUser } from '@coreui/icons'
import { AuthService } from 'src/services/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        if (!forgetPassword) {
            return;
        }
        if (forgetPassword.status === 200 || forgetPassword.status === '200') {
            toast.success("Please check email.")
        }
    }

    return (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center login">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={8} lg={6} xl={5} xxl={4}>
                        <CCardGroup>
                            <CCard className="p-2 p-md-4">
                                <CCardBody>
                                    <CForm onSubmit={handleSubmit(handleSubmitforgetPwd)}>
                                        <h3 className='text-center'>Forgot Your Password?</h3>
                                        <p className="text-medium-emphasis text-center">Sign In to your account</p>
                                        <div className='mb-3'>
                                            <CInputGroup>
                                                <CInputGroupText>
                                                    <CIcon icon={cilUser} />
                                                </CInputGroupText>
                                                <CFormInput
                                                    type="email"
                                                    id="email"
                                                    placeholder="Email"
                                                    autoComplete="email"
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
                                            </CInputGroup>
                                            {errors.email && (
                                                <small className="error-msg">{errors.email?.message}</small>
                                            )}

                                        </div>
                                        <CRow>
                                            <CCol xs={12}>
                                                <CButton type="submit" color="primary" className="px-4 w-100 mb-2">
                                                    Forgot Password
                                                </CButton>
                                            </CCol>
                                            <CCol xs={12} className="text-center back-to-login">
                                                Back to ?
                                                <span color="link" className="ms-2" onClick={() => navigate('/')}>
                                                    login
                                                </span>
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

export default ForgetPassword
