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
} from "@coreui/react";
import { useForm } from "react-hook-form";
import Toast from "../../../utils/toast";
import { addUser, updateUser } from "../../../services/user.service";

const UserAddEditModal = ({ operation, buttonText, user, fetchUsers }) => {
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
        name: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formSubmitted]);

  const addEditUserSubmit = async (e) => {
    if (operation === "Add") {
      const addUserResponse = await addUser(e);
      if (!addUserResponse) {
        return;
      }
      if (addUserResponse.status === 200 || addUserResponse.status === "200") {
        Toast("success", "User added successfully");
        setVisible(false);
        setFormSubmitted(true);
        fetchUsers();
      } else {
        Toast("error", "Failed to add user");
      }
    }
    if (operation === "Edit") {
      const editUserResponse = await updateUser("/updateUsers", e);
      if (!editUserResponse) {
        return;
      }
      if (
        editUserResponse.status === 200 ||
        editUserResponse.status === "200"
      ) {
        Toast("success", "User edited successfully");
        setVisible(false);
        setFormSubmitted(true);
        fetchUsers();
      } else {
        Toast("error", "Failed to edit user");
      }
    }
  };

  const userBindData = () => {
    reset({
      name: "",
    });

    setValue("name", user.name);
    setVisible(!visible);
  };

  const close = () => {
    reset({
      name: "",
    });
    setVisible(false);
  };

  return (
    <>
      {operation === "Edit" ? (
        <button
          className="btn-sm btn-gradient-dark btn-icon-text"
          color="warning"
          title="Edit"
          variant="outline"
          size="sm"
          onClick={() => userBindData()}
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
          <CModalTitle> {operation} User</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit(addEditUserSubmit)}>
          <CModalBody>
            <CContainer>
              <CRow>
                <CCol sm={12}>
                  <CFormLabel htmlFor="exampleFormControlInput1">
                    User Name
                  </CFormLabel>
                  {operation === "Edit" ? (
                    <CFormInput
                      type="hidden"
                      value={user.userId}
                      {...register("id")}
                    />
                  ) : null}
                  <CFormInput
                    type="text"
                    name="referenceName"
                    placeholder="Enter the category name"
                    defaultValue={user ? user.name : ""}
                    {...register("name", {
                      required: "Username name is Required",
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
            </CContainer>
          </CModalBody>
          <CModalFooter>
            <CContainer>
              <CRow>
                <CCol sm={12}>
                  <div className="d-grid gap-2">
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
  );
};

export default UserAddEditModal;
