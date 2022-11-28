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
    CFormInput
} from "@coreui/react";
import { useForm } from "react-hook-form";
import Toast from "../../../utils/toast";
import { addModule, updateModulePermission } from "../../../services/module.service";

const ModuleAddEditModel = ({
    operation,
    buttonText,
    fetchModule,
    module
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
                moduleName: "",
                acronym: ""
            });
        }
    }, [formSubmitted]);


    const addEditModuleSubmit = async (e) => {
        const payload = {
            moduleName: e.moduleName,
            acronym: e.acronym,
        };

        if (operation === "Add") {
            const addModuleResponse = await addModule(payload);
            if (!addModuleResponse) {
                return;
            }
            if (addModuleResponse.status === 200 || addModuleResponse.status === "200") {
                Toast("success", addModuleResponse.data);
                setVisible(false);
                setFormSubmitted(true);
                fetchModule();
                reset({
                    moduleName: "",
                    acronym: ""
                });
            } else {
                Toast("error", "Failed to add module");
            }
        }
        if (operation === 'Edit') {
            console.log("edit")
            console.log("payload", payload)
            const updateModuleResponse = await updateModulePermission(module.moduleId, payload);
            if (!updateModuleResponse) {
                return;
            }
            if (updateModuleResponse.status === 200 || updateModuleResponse.status === "200") {
                Toast("success", updateModuleResponse.data);
                setVisible(false);
                setFormSubmitted(true);
                fetchModule();
                reset({
                    roleName: "",
                    acronym: ""
                });
            } else {
                Toast("error", "Failed to add role");
            }
        }

    };

    const moduleBindData = () => {
        reset({
            moduleName: "",
            acronym: ""
        });

        setValue("moduleName", module.moduleName);
        setValue("acronym", module.acronym);

        setVisible(!visible);
       
    };

    console.log(module)

    const close = () => {
        reset({
            moduleName: "",
            acronym: ""
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
                    onClick={() => moduleBindData()}
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
                    <CModalTitle> {operation} Module</CModalTitle>
                </CModalHeader>
                <CForm onSubmit={handleSubmit(addEditModuleSubmit)}>
                    <CModalBody>
                        <CContainer>
                            <CRow>
                                <CCol sm={12} className="mb-2">
                                    <CFormLabel htmlFor="moduleName">Module Name</CFormLabel>
                                    {operation === "Edit" ? (
                                        <CFormInput
                                            type="hidden"
                                            // value={category.categoryId}
                                            {...register("moduleId")}
                                        />
                                    ) : null}
                                    <CFormInput
                                        type="text"
                                        id="moduleName"
                                        name="moduleName"
                                        placeholder="Enter the Module name"
                                        // defaultValue={category ? category.name : ""}
                                        {...register("moduleName", {
                                            required: "Module name is required",
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
                                            trigger("moduleName");
                                        }}
                                    />
                                    {errors.moduleName && (
                                        <small className="text-danger">{errors.moduleName.message}</small>
                                    )}
                                </CCol>
                                <CCol sm={12} className="mb-2">
                                    <CFormLabel htmlFor="acronymName">Acronym Name</CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id="acronym"
                                        name="acronym"
                                        placeholder="Enter the acronym name"
                                        {...register("acronym", {
                                            required: "Acronym name is required",
                                            pattern: {
                                                value: /^[A-Za-z ]+$/i,
                                                message: "Please input alphabet characters only"
                                            },
                                            pattern: {
                                                value: /^[A-Z]*$/,
                                                message: "Please input uppercase characters only"
                                            },
                                            minLength: {
                                                value: 3,
                                                message: 'Acronym name must be minimum 3 characters long',
                                            },
                                            maxLength: {
                                                value: 3,
                                                message: "Acronym name must be maximum 3 characters long"
                                            },

                                        })}
                                        onKeyUp={() => {
                                            trigger("acronym");
                                        }}
                                    />
                                    {errors.acronym && (
                                        <small className="text-danger">{errors.acronym.message}</small>
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
}

export default ModuleAddEditModel