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
import {
  getExhCategories,
  addExhCategory,
  updateExhCategory,
  exhCatImagePost,
} from "../../../services/exhCategory.service";

const ExhCategoryAddEditModal = ({
  operation,
  buttonText,
  exhCategory,
  fetchExhCategories,
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
        exhCategoryName: "",
        image: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formSubmitted]);

  const handleExhCategoryImage = async (imageFromClient) => {
    const formData = new FormData();
    formData.append("image", imageFromClient);
    const imageFromServer = await exhCatImagePost(formData);
    return imageFromServer;
  };

  const addEditExhCategorySubmit = async (e) => {
    let exhCategoryImage = await handleExhCategoryImage(e.image[0]);
    if (!exhCategoryImage) {
      return;
    }
    const payload = {
      exhCategoryName: e.exhCategoryName,
      image: exhCategoryImage.data.filename,
    };
    if (operation === "Add") {
      const addExhCategoryResponse = await addExhCategory(payload);
      if (!addExhCategoryResponse) {
        return;
      }
      if (
        addExhCategoryResponse.status === 200 ||
        addExhCategoryResponse.status === "200"
      ) {
        Toast("success", "Exhibition category added successfully");
        setVisible(false);
        setFormSubmitted(true);
        fetchExhCategories();
      } else {
        Toast("error", "Failed to add exhibition category");
      }
    }
    if (operation === "Edit") {
      payload.exhCategoryId = e.exhCategoryId;
      const editExhCategoryResponse = await updateExhCategory(payload);
      if (!editExhCategoryResponse) {
        return;
      }
      if (
        editExhCategoryResponse.status === 200 ||
        editExhCategoryResponse.status === "200"
      ) {
        Toast("success", "Exhibition category edited successfully");
        setVisible(false);
        setFormSubmitted(true);
        fetchExhCategories();
      } else {
        Toast("error", "Failed to edit exhibition category");
      }
    }
  };

  const exhCategoryBindData = () => {
    reset({
      exhCategoryName: "",
      image: "",
    });

    setValue("exhCategoryName", exhCategory.exhCategoryName);
    setValue("image", exhCategory.image);
    setVisible(!visible);
  };

  const close = () => {
    reset({
      exhCategoryName: "",
      image: "",
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
          onClick={() => exhCategoryBindData()}
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
          <CModalTitle> {operation} Category</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit(addEditExhCategorySubmit)}>
          <CModalBody>
            <CContainer>
              <CRow>
                <CCol sm={12}>
                  <CFormLabel htmlFor="name">Exhibition Category Name</CFormLabel>
                  {operation === "Edit" ? (
                    <CFormInput
                      type="hidden"
                      value={exhCategory.exhCategoryId}
                      {...register("exhCategoryId")}
                    />
                  ) : null}
                  <CFormInput
                    type="text"
                    id="exhCategoryName"
                    name="referenceName"
                    placeholder="Enter the exhibition category name"
                    defaultValue={exhCategory ? exhCategory.exhCategoryName : ""}
                    {...register("exhCategoryName", {
                      required: "Exhibition category name is Required",
                    })}
                    onKeyUp={() => {
                      trigger("exhCategoryName");
                    }}
                  />
                  {errors.exhCategoryName && (
                    <small className="text-danger">{errors.exhCategoryName.message}</small>
                  )}
                </CCol>
                &nbsp;
              </CRow>
              &nbsp;
              <CRow>
                <CCol sm={12}>
                  <CFormLabel>
                    Upload Exhibition Category Image{" "}
                    <small className="text-muted">
                      (Maximum upload size: 5 MB)
                    </small>
                  </CFormLabel>
                  {operation === "Add" ? (
                    <>
                      <CFormInput
                        type="file"
                        name="image"
                        {...register("image", {
                          required: "Exhibition Category image is required",
                        })}
                      />
                      {errors.image && (
                        <small className="text-danger">
                          {errors.image.message}
                        </small>
                      )}
                    </>
                  ) : (
                    <CFormInput
                      type="file"
                      name="image"
                      label="Upload exhibition category image"
                      {...register("image")}
                    />
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
  );
};

export default ExhCategoryAddEditModal;
