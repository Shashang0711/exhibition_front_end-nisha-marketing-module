import React, { useEffect, useState } from "react";
import {
    CButton,
    CModalBody,
    CRow,
    CCol,
    CForm,
    CFormLabel,
    CFormInput
} from "@coreui/react";
import { useForm } from "react-hook-form";
import Toast from "../../utils/toast";
import {
    addFAQ,
    updateFAQ
} from '../../services/faq.service';

const AddEditSellerRegistration = ({
    operation,
    buttonText,
}) => {
    const [visible, setVisible] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        trigger,
        setValue,
        watch
    } = useForm();

    useEffect(() => {
        reset({
            name: '',
            email: ''
        });
    }, [formSubmitted]);

    const faqBindData = () => {
        reset({
            name: '',
            email: '',
            password: '',
            mobileNo: ''
        });
        // setValue('name', faq.name);
        // setValue('email', faq.email);
        setVisible(!visible);
    }

    const addEditSellerRegistrations = async (e) => {
        if (operation === "Add") {
            const addSellerRgRes = await addFAQ(e);
            if (!addSellerRgRes) {
                return;
            }
            if (
                addSellerRgRes.status === 200 ||
                addSellerRgRes.status === "200"
            ) {
                Toast("success", "Seller added successfully");
                setVisible(false);
                setFormSubmitted(true);
                // fetchFAQs();
            }
        } else {
            const editSellerRgRes = await updateFAQ(e);
            if (!editSellerRgRes) {
                return;
            }
            if (
                editSellerRgRes.status === 200 ||
                editSellerRgRes.status === "200"
            ) {
                Toast("success", "Seller updated successfully");
                setVisible(false);
                setFormSubmitted(true);
                // fetchFAQs();
            }
        }
    }

    const close = () => {
        reset({
            name: '',
            email: ''
        });
        setVisible(false)
    }

    return (
        <>

            <div className="page-header">
                <h3 className="page-title">
                    <span className="page-title-icon bg-gradient-primary text-white mr-2">
                        <i className="mdi mdi-home"></i>
                    </span>{" "}
                    Register
                </h3>

            </div>
            <div className="row">
                <div className="col-lg-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body scrollableCard">
                            <CForm onSubmit={handleSubmit(addEditSellerRegistrations)}>
                                <CModalBody>
                                    <div className="col-xl-8">
                                        <CRow>
                                            <CCol sm={12}>
                                                <CFormLabel htmlFor="name">Name</CFormLabel>
                                                {operation === "Edit" ? (
                                                    <CFormInput
                                                        type="hidden"
                                                        // value={faq.faqId}
                                                        {...register("faqId")}
                                                    />
                                                ) : null}
                                                <CFormInput
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    placeholder="Enter name"
                                                    // defaultValue={faq ? faq.name : ""}
                                                    {...register("name", {
                                                        required: "Name is Required",
                                                    })}
                                                    onKeyUp={() => {
                                                        trigger("name");
                                                    }}
                                                />
                                                {errors.name && (
                                                    <small className="text-danger">{errors.name.message}</small>
                                                )}
                                            </CCol>
                                            &nbsp;
                                        </CRow>
                                        <CRow>
                                            <CCol sm={12}>
                                                <CFormLabel htmlFor="email">
                                                    Email
                                                </CFormLabel>
                                                <CFormInput
                                                    id="email"
                                                    rows="3"
                                                    placeholder="Enter email"
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
                                                ></CFormInput>
                                                {errors.email && (
                                                    <small className="text-danger">{errors.email.message}</small>
                                                )}
                                            </CCol>
                                            &nbsp;
                                        </CRow>
                                        <CRow>
                                            <CCol sm={12}>
                                                <CFormLabel htmlFor="Password">
                                                    Password
                                                </CFormLabel>
                                                <CFormInput
                                                    id="Password"
                                                    rows="3"
                                                    placeholder="Enter password"
                                                    {...register("password", {
                                                        required: 'Password is required',
                                                        pattern: {
                                                            value: /^((?!.*[\s])(?=.*[A-Z])(?=.*\d).{8,15})+$/i,
                                                            message: 'Password should include at least one uppercase, one numeric value and one special character'
                                                        },
                                                        minLength: {
                                                            value: 6,
                                                            message: 'Password must be at least 6 characters long',
                                                        },
                                                    })}
                                                    onKeyUp={() => {
                                                        trigger("Password");
                                                    }}
                                                ></CFormInput>
                                                {errors.password && (
                                                    <small className="text-danger">{errors.password.message}</small>
                                                )}
                                            </CCol>
                                            &nbsp;
                                        </CRow>
                                        <CRow>
                                            <CCol sm={12}>
                                                <CFormLabel htmlFor="confirmPassword">
                                                    Confirm password
                                                </CFormLabel>
                                                <CFormInput
                                                    id="confirmPassword"
                                                    rows="3"
                                                    placeholder="Enter confirm password"
                                                    {...register('confirmPassword', {
                                                        required: 'Confirm password is required',
                                                        validate: (val) => {
                                                            if (watch('password') !== val) {
                                                                return 'Your passwords do not match';
                                                            }
                                                        },
                                                        pattern: {
                                                            value: /^((?!.*[\s])(?=.*[A-Z])(?=.*\d).{8,15})+$/i,
                                                            message: "Not allow whitespaces"
                                                        },
                                                    })}
                                                    onKeyUp={() => {
                                                        trigger('confirmPassword');
                                                    }}
                                                ></CFormInput>
                                                {errors.confirmPassword && (
                                                    <small className="text-danger">{errors.confirmPassword.message}</small>
                                                )}
                                            </CCol>
                                            &nbsp;
                                        </CRow>
                                        <CRow>
                                            <CCol sm={12}>
                                                <CFormLabel htmlFor="mobileNo">
                                                    Mobile Number
                                                </CFormLabel>
                                                <CFormInput
                                                    id="mobileNo"
                                                    rows="3"
                                                    placeholder="Enter mobile number"
                                                    {...register("mobileNo", {
                                                        required: "Mobile number is required",
                                                        pattern: {
                                                            value: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
                                                            message: "Invalid mobile number"
                                                        },
                                                    })}
                                                    onKeyUp={() => {
                                                        trigger("mobileNo");
                                                    }}
                                                ></CFormInput>
                                                {errors.mobileNo && (
                                                    <small className="text-danger">{errors.mobileNo.message}</small>
                                                )}
                                            </CCol>
                                            &nbsp;
                                        </CRow>
                                        <CRow>
                                            <CCol sm={12}>
                                                <div className="d-flex justify-content-start">
                                                    <CButton
                                                        color="success"
                                                        size="sm"
                                                        variant="outline"
                                                        type="submit"
                                                    >
                                                        Register
                                                    </CButton>
                                                </div>
                                            </CCol>
                                        </CRow>
                                    </div>
                                </CModalBody>

                                

                            </CForm>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
};

export default AddEditSellerRegistration;
