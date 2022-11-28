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
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CFormCheck
} from "@coreui/react";
import { useForm } from "react-hook-form";
import Toast from "../../../utils/toast";

import "../Roles.css"
import { getModule } from "../../../services/module.service";
import { addRolePermission, updateRolePermission } from "../../../services/rolePermission.service";

const RoleAddEditModel = ({
    operation,
    buttonText,
    fetchRoles,
    role,
    menu
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
    } = useForm();

    useEffect(() => {
        if (operation === "Add") {
            reset({
                roleName: "",
                permissions: []
            });
        }
    }, [formSubmitted]);


    const addEditRoleSubmit = async (e) => {
        const payload = {
            roleName: e.roleName,
            permissions: e.permissions,
        };

        if (operation === "Add") {
            const addRoleResponse = await addRolePermission(payload);
            if (!addRoleResponse) {
                return;
            }
            if (addRoleResponse.status === 200 || addRoleResponse.status === "200") {
                Toast("success", addRoleResponse.data);
                setVisible(false);
                setFormSubmitted(true);
                fetchRoles();
                reset({
                    roleName: "",
                    permissions: []
                });
            } else {
                Toast("error", "Failed to add role");
            }
        }
        if (operation === 'Edit') {
            console.log("edit")
            console.log("payload", payload)
            const updateRoleResponse = await updateRolePermission(role.roleId, payload);
            if (!updateRoleResponse) {
                return;
            }
            if (updateRoleResponse.status === 200 || updateRoleResponse.status === "200") {
                Toast("success", updateRoleResponse.data);
                setVisible(false);
                setFormSubmitted(true);
                fetchRoles();
                reset({
                    roleName: "",
                    permissions: []
                });
            } else {
                Toast("error", "Failed to add role");
            }
        }

    };

    const rolePermissionBindData = () => {
        reset({
            roleName: "",
            permissions: []
        });

        setValue("roleName", role.roleName);
        setValue("permissions", role.permissions);

        setVisible(!visible);
    };

    const close = () => {
        reset({
            roleName: "",
            permissions: []
        });
        setVisible(false);
    };
    return (
        <>
            {operation === "Edit" ? (
                <button
                    className="btn btn-xs btn-gradient-dark btn-icon-text"
                    color="warning"
                    title="Edit"
                    variant="outline"
                    size="sm"
                    onClick={() => rolePermissionBindData()}
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

            <CModal alignment="center" visible={visible} onClose={() => close()} >
                <CModalHeader>
                    <CModalTitle> {operation} Role</CModalTitle>
                </CModalHeader>
                <CForm onSubmit={handleSubmit(addEditRoleSubmit)}>
                    <CModalBody>
                        <CContainer>
                            <CRow>
                                <CCol sm={12} className="mb-2">
                                    <CFormLabel htmlFor="roleName">Role Name</CFormLabel>
                                    {operation === "Edit" ? (
                                        <CFormInput
                                            type="hidden"
                                            // value={category.categoryId}
                                            {...register("roleId")}
                                        />
                                    ) : null}
                                    <CFormInput
                                        type="text"
                                        id="roleName"
                                        name="roleName"
                                        placeholder="Enter the Role name"
                                        // defaultValue={category ? category.name : ""}
                                        {...register("roleName", {
                                            required: "Role name is required",
                                            pattern: {
                                                value: /^[A-Za-z ]+$/i,
                                                message: "Please input alphabet characters only"
                                            },
                                            minLength: {
                                                value: 3,
                                                message: 'Username must be at least 3 characters long',
                                            },
                                            maxLength: {
                                                value: 25,
                                                message: "Username must be not so characters long"
                                            },

                                        })}
                                        onKeyUp={() => {
                                            trigger("roleName");
                                        }}

                                        defaultValue={role ? role.roleName : ""}
                                    />
                                    {errors.roleName && (
                                        <small className="text-danger">{errors.roleName.message}</small>
                                    )}
                                </CCol>
                                <CCol sm={12}>
                                    <CFormLabel htmlFor="name">Permissions</CFormLabel>
                                </CCol>
                                <CCol sm={12}>
                                    <CTable className="roleModal">
                                        <CTableHead>
                                            <CTableRow>
                                                <CTableHeaderCell scope="col">Sr.No</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">Add</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">Edit</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">Delete</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">View</CTableHeaderCell>

                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {menu.length > 0 && menu.map((menu, index) =>
                                                <CTableRow key={index}>
                                                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                                    <CTableDataCell>{menu.moduleName}</CTableDataCell>
                                                    <CTableDataCell className="text-center"><CFormCheck value={menu.acronym + '-C'} {...register("permissions[]")} defaultChecked={role && role?.permissions.find(ele => ele === menu.acronym + '-C')} /></CTableDataCell>
                                                    <CTableDataCell className="text-center"><CFormCheck value={menu.acronym + '-U'} {...register("permissions[]")} defaultChecked={role && role?.permissions.find(ele => ele === menu.acronym + '-U')} /></CTableDataCell>
                                                    <CTableDataCell className="text-center"><CFormCheck value={menu.acronym + '-D'} {...register("permissions[]")} defaultChecked={role && role?.permissions.find(ele => ele === menu.acronym + '-D')} /></CTableDataCell>
                                                    <CTableDataCell className="text-center"><CFormCheck value={menu.acronym + '-R'} {...register("permissions[]")} defaultChecked={role && role?.permissions.find(ele => ele === menu.acronym + '-R')} /></CTableDataCell>
                                                </CTableRow>
                                            )}
                                        </CTableBody>
                                    </CTable>
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
}

export default RoleAddEditModel