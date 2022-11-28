import React, { useEffect, useState } from "react";
import {
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CContainer,
    CRow,
    CCol,
    CForm,
    CFormLabel,
    CFormInput,
    CFormTextarea,
} from "@coreui/react";
import { useForm } from "react-hook-form";
import Toast from "../../../utils/toast";
import { addEmployeeService, updateEmployeeService } from "../../../services/employee.service";
import { updateRolePermission } from "../../../services/rolePermission.service";

const EmployeeAddEdit = ({
    operation,
    buttonText,
    fetchEmployee,
    employee,
    role

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
            userName: '',
            email: '',
            password: '',
            mobileNo: ''
        });
    }, [formSubmitted]);

    const empBindData = () => {
        reset({
            userName: '',
            email: '',
            password: '',
            mobileNo: ''
        });
        setValue('userName', employee.userName);
        setValue('email', employee.email);
        setValue('password', employee.password);
        setValue('mobileNo', employee.mobileNo);
        if (employee && employee.role) {
            setValue('roleName', employee.role.roleName);
            setValue(
                "roleId",
                employee.role.roleId
            );
        }
        setVisible(!visible);
    }

    const addEditEmployee = async (e) => {
        const payload = {
            userName: e.userName,
            email: e.email,
            password: e.password,
            roleId: e.roleId,
            mobileNo: e.mobileNo
        }
        if (operation === "Add") {
            const addEmpRes = await addEmployeeService(payload);
            if (!addEmpRes) {
                return;
            }
            if (
                addEmpRes.status === 200 ||
                addEmpRes.status === "200"
            ) {
                Toast("success", "Employee added successfully");
                setVisible(false);
                setFormSubmitted(true);
                fetchEmployee();
            } else {
                Toast("error", "Failed to add employee");
            }
        }
        if (operation === 'Edit') {
            const payloadEdit = {
                userName: e.userName,
                password: e.password,
                roleId: e.roleId,
                mobileNo: e.mobileNo
            }
            console.log("payloadEdit", payloadEdit)
            const editEmpRes = await updateEmployeeService(employee.userId, payloadEdit);
            if (!editEmpRes) {
                return;
            }
            if (
                editEmpRes.status === 200 ||
                editEmpRes.status === "200"
            ) {
                Toast("success", "Employee updated successfully");
                setVisible(false);
                setFormSubmitted(true);
                fetchEmployee();
            }
        }
    }

    // console.log("role", role)

    const close = () => {
        reset({
            userName: '',
            email: '',
            password: '',
            mobileNo: ''
        });
        setVisible(false)
    }

    return (
        <>
            {operation === 'Edit' ? (
                <button
                    className="btn btn-xs btn-gradient-dark btn-icon-text"
                    color="warning"
                    title="Edit"
                    variant="outline"
                    size="sm"
                    onClick={() => empBindData()}
                >
                    {buttonText}
                </button>
            ) : (
                <CButton
                    className="addbtn"
                    color="primary"
                    variant="outline"
                    size="sm"
                    onClick={() => setVisible(!visible)}
                >
                    {buttonText}
                </CButton>
            )}

            <CModal alignment="center" visible={visible} onClose={() => close()}>
                <CModalHeader>
                    <CModalTitle> {operation} Employee</CModalTitle>
                </CModalHeader>
                <CForm onSubmit={handleSubmit(addEditEmployee)}>
                    <CModalBody>
                        <CContainer>
                            {employee && employee.role && employee?.role?.roleName === 'admin' ?
                                <>
                                    <CRow className="mb-2">
                                        <CCol sm={12}>
                                            <CFormLabel htmlFor="name">Role name</CFormLabel>
                                            {/* {operation === "Edit" ? ( */}
                                            <CFormInput
                                                type="hidden"
                                                value={employee && employee.role ? employee.role.roleId : ""}
                                                {...register("roleId")}
                                            />
                                            {/* ) : null} */}
                                            <CFormInput
                                                readOnly
                                                type="text"
                                                id="roleName"
                                                name="roleName"
                                                placeholder="Enter name"
                                                defaultValue={employee && employee.role ? employee.role.roleName : ""}
                                                {...register("roleName", {
                                                    required: "roleName is Required",
                                                })}
                                                onKeyUp={() => {
                                                    trigger("roleName");
                                                }}
                                            />
                                        </CCol>
                                    </CRow>
                                </>
                                :
                                <>
                                    <CRow className="mb-2">
                                        <CCol sm={12}>
                                            <CFormLabel htmlFor="name">Select Role</CFormLabel>
                                            <select
                                                className='form-select form-control'
                                                aria-label="Default select example"
                                                {...register('roleId', { required: 'Select role name' })}
                                                onKeyUp={() => {
                                                    trigger('roleId')
                                                }}
                                                name="roleId"
                                            >
                                                <option hidden value=''>Select Role Name</option>
                                                {role.map((roleElement, index) =>
                                                    <option key={index} value={roleElement.roleId}>
                                                        {roleElement.roleName}
                                                    </option>
                                                )}

                                            </select>
                                            {errors.roleId && (
                                                <small className="text-danger">{errors.roleId.message}</small>
                                            )}
                                        </CCol>
                                    </CRow>
                                </>

                            }




                            {/* // } */}

                            <CRow className="mb-2">
                                <CCol sm={12}>
                                    <CFormLabel htmlFor="name">Name</CFormLabel>

                                    <CFormInput
                                        type="text"
                                        id="userName"
                                        name="userName"
                                        placeholder="Enter name"
                                        defaultValue={employee ? employee.userName : ""}
                                        {...register("userName", {
                                            required: "userName is Required",
                                        })}
                                        onKeyUp={() => {
                                            trigger("userName");
                                        }}
                                    />
                                    {errors.userName && (
                                        <small className="text-danger">{errors.userName.message}</small>
                                    )}
                                </CCol>
                            </CRow>
                            <CRow className="mb-2">
                                <CCol sm={12}>
                                    <CFormLabel htmlFor="email">
                                        Email
                                    </CFormLabel>
                                    <CFormInput
                                        id="email"
                                        rows="3"
                                        defaultValue={employee ? employee.email : ""}
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
                            </CRow>
                            {operation === 'Edit' ?
                                <>
                                </>
                                :
                                <>
                                    <CRow className="mb-2">
                                        <CCol sm={12}>
                                            <CFormLabel htmlFor="Password">
                                                Password
                                            </CFormLabel>
                                            <CFormInput
                                                type="password"
                                                id="password"
                                                name="password"
                                                placeholder="Password*"
                                                // autoComplete="new-password"
                                                {...register('password', {
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
                                                    trigger('password');
                                                }}
                                            ></CFormInput>
                                            {errors.password && (
                                                <small className="text-danger">{errors.password.message}</small>
                                            )}
                                        </CCol>
                                    </CRow>
                                    <CRow className="mb-2">
                                        <CCol sm={12}>
                                            <CFormLabel htmlFor="confirmPassword">
                                                Confirm password
                                            </CFormLabel>
                                            <CFormInput
                                                type="password"
                                                id='confirmPassword'
                                                name='confirmPassword'
                                                placeholder="Confirm password*"
                                                // autoComplete="new-password"
                                                {...register('confirmPassword', {
                                                    required: 'Confirm password is required',
                                                    validate: (val) => {
                                                        if (watch('password') !== val) {
                                                            return 'Your passwords do not match';
                                                        }
                                                    },
                                                    pattern: {
                                                        value: /^((?!.*[\s])(?=.*[A-Z])(?=.*\d).{8,15})+$/i,
                                                        message: 'Password should include at least one uppercase, one numeric value and one special character'
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
                                    </CRow>
                                </>
                            }


                            <CRow className="mb-2">
                                <CCol sm={12}>
                                    <CFormLabel htmlFor="mobileNo">
                                        Mobile Number
                                    </CFormLabel>
                                    <CFormInput
                                        id="mobileNo"
                                        rows="3"
                                        placeholder="Enter mobile number"
                                        defaultValue={employee ? employee.mobileNo : ""}
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
                            </CRow>
                        </CContainer>
                    </CModalBody>
                    <CModalFooter>
                        <CContainer>
                            <CRow>
                                <CCol sm={12}>
                                    <div className="d-flex justify-content-end">
                                        <CButton
                                            color="danger"
                                            size="sm"
                                            variant="outline"
                                            onClick={close}
                                        >
                                            Close
                                        </CButton>
                                        &nbsp;
                                        <CButton
                                            color="success"
                                            size="sm"
                                            variant="outline"
                                            type="submit"
                                        >
                                            {operation}
                                        </CButton>
                                    </div>
                                </CCol>
                            </CRow>
                        </CContainer>
                    </CModalFooter>
                </CForm>
            </CModal>
        </>
    )
};

export default EmployeeAddEdit;
