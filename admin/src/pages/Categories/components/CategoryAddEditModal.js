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
  getCategories,
  addCategory,
  updateCategory,
  catImagePost,
} from "../../../services/category.service";

const CategoryAddEditModal = ({
  operation,
  buttonText,
  category,
  fetchCategories,
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
        name: "",
        categoryDesc: "",
        categoryImg: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formSubmitted]);

  const handleCategoryImage = async (imageFromClient) => {
    const formData = new FormData();
    formData.append("image", imageFromClient);
    const imageFromServer = await catImagePost(formData);
    return imageFromServer;
  };

  const addEditCategorySubmit = async (e) => {
    let categoryImage = await handleCategoryImage(e.categoryImg[0]);
    if (!categoryImage) {
      return;
    }
    const payload = {
      name: e.name,
      description: e.categoryDesc,
      image: categoryImage.data.filename,
    };

    console.log("payload",payload)
    if (operation === "Add") {
      const addCategoryResponse = await addCategory(payload);
      if (!addCategoryResponse) {
        return;
      }
      if (
        addCategoryResponse.status === 200 ||
        addCategoryResponse.status === "200"
      ) {
        Toast("success", "Category added successfully");
        setVisible(false);
        setFormSubmitted(true);
        fetchCategories();
      } else {
        Toast("error", "Failed to add category");
      }
    }
    if (operation === "Edit") {
      payload.id = e.id;
      const editCategoryResponse = await updateCategory(payload);
      if (!editCategoryResponse) {
        return;
      }
      if (
        editCategoryResponse.status === 200 ||
        editCategoryResponse.status === "200"
      ) {
        Toast("success", "Category edited successfully");
        setVisible(false);
        setFormSubmitted(true);
        fetchCategories();
      } else {
        Toast("error", "Failed to edit category");
      }
    }
  };

  const categoryBindData = () => {
    reset({
      name: "",
      categoryDesc: "",
      categoryImg: "",
    });

    setValue("name", category.name);
    setValue("categoryDesc", category.description);
    setValue("categoryImg", category.image);
    setVisible(!visible);
  };

  const close = () => {
    reset({
      name: "",
      categoryDesc: "",
      categoryImg: "",
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
          onClick={() => categoryBindData()}
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
        <CForm onSubmit={handleSubmit(addEditCategorySubmit)}>
          <CModalBody>
            <CContainer>
              <CRow>
                <CCol sm={12}>
                  <CFormLabel htmlFor="name">Category Name</CFormLabel>
                  {operation === "Edit" ? (
                    <CFormInput
                      type="hidden"
                      value={category.categoryId}
                      {...register("id")}
                    />
                  ) : null}
                  <CFormInput
                    type="text"
                    id="name"
                    name="referenceName"
                    placeholder="Enter the category name"
                    defaultValue={category ? category.name : ""}
                    {...register("name", {
                      required: "Category name is required",
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
                  <CFormLabel htmlFor="categoryDesc">
                    Category Description
                  </CFormLabel>
                  <CFormTextarea
                    id="categoryDesc"
                    placeholder="Enter the category description"
                    rows="3"
                    {...register("categoryDesc", {
                      required: "Category description is required",
                    })}
                    onKeyUp={() => {
                      trigger("categoryDesc");
                    }}
                  ></CFormTextarea>
                  {errors.categoryDesc && (
                    <small className="text-danger">{errors.categoryDesc.message}</small>
                  )}
                </CCol>
              </CRow>
              &nbsp;
              <CRow>
                <CCol sm={12}>
                  <CFormLabel>
                    Upload Category Image{" "}
                    <small className="text-muted">
                      (Maximum upload size: 5 MB & Upload only png and jpg files)
                    </small>
                  </CFormLabel>
                  {operation === "Add" ? (
                    <>
                      <CFormInput
                        type="file"
                        name="categoryImg"
                        {...register("categoryImg", {
                          required: "Category image is required",
                        })}
                      />
                      {errors.categoryImg && (
                        <small className="text-danger">
                          {errors.categoryImg.message}
                        </small>
                      )}
                    </>
                  ) : (
                    <CFormInput
                      type="file"
                      name="categoryImg"
                      {...register("categoryImg")}
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

export default CategoryAddEditModal;
