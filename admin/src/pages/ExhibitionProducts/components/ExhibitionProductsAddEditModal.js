import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  CButton,
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import Select from "react-select";
import Toast from "../../../utils/toast";
import {
  getProduct,
  getSellerAllProducts,
} from "../../../services/product.service";
import {
  addExhProduct,
  updateExhProduct,
} from "../../../services/exhibitionProduct.service";
import { useHistory, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "../../../components/editor/Editor.css";
import "react-quill/dist/quill.snow.css";
import parser from "html-react-parser";
import { quillConfig } from "../../../constants/constants";

const ExhibitionProductsAddEditModal = ({
  operation,
  buttonText,
  exhProduct,
  fetchExhProducts,
  exhProducts,
  exhibition
}) => {
  // Configuring React-Quill Editor
  const modules = quillConfig.modules;
  const formats = quillConfig.formats;
  const placeholder = quillConfig.placeholder;
  const history = useHistory();

  // State for editor
  const [productDesc, setProductDesc] = useState({ editorHtml: "" });
  // changeHandler
  const onDescChange = (html) => {
    setProductDesc({ editorHtml: html });
  };

  useEffect(() => {
    if (exhProduct) {
      setProductDesc(exhProduct.productDetail);
    }
  }, [exhProduct]);



  // Setting state for modal
  const [visible, setVisible] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // useForm for react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
    setValue,
  } = useForm();

  // Make form fields empty if the form is submitted
  useEffect(() => {
    if (operation === "Add") {
      reset({
        totalQuantity: 0,
      });
      setProductDesc({ editorHtml: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formSubmitted]);

  // Function to add and edit Exhibition Product
  const addEditExhProductSubmit = async (e) => {
    // Setting product description in payload
    e.productDetail = productDesc.editorHtml;

    if (operation === "Add") {
      const addExhProductResponse = await addExhProduct(e);
      if (!addExhProductResponse) {
        return;
      }
      if (
        addExhProductResponse.status === 200 ||
        addExhProductResponse.status === 200
      ) {
        Toast("success", "Product added successfully");
        setVisible(false);
        setFormSubmitted(true);
        fetchExhProducts();
      } else {
        Toast("error", "Failed to add product");
      }
    } else {
      const editExhProductResponse = await updateExhProduct(e);
      if (!editExhProductResponse) {
        return;
      }
      if (
        editExhProductResponse.status === 200 ||
        editExhProductResponse.status === "200"
      ) {
        Toast("success", "Product updated successfully");
        setVisible(false);
        setFormSubmitted(true);
        fetchExhProducts();
      } else {
        Toast("error", "Failed to update product");
      }
    }
  };

  // Function to display specific product detail for edit modal
  const exhProductBindData = () => {
    reset({
      totalQuantity: 0,
      productId: "",
      exhibitionProductId: "",
    });

    setValue("totalQuantity", exhProduct.totalQuantity);
    setValue("productId", exhProduct.productId);
    setValue("exhibitionProductId", exhProduct.exhibitionProductId);

    setProductDesc({ editorHtml: parser(exhProduct.productDetail) });

    setVisible(!visible);
  };

  // Function to close modal when clicked in background
  const close = () => {
    reset({
      totalQuantity: 0,
      productId: "",
    });
    setProductDesc("");
    setVisible(false);
  };

  /* ********************************* */
  /*  Code For Select Tag Begins Here  */
  /* ********************************* */
  const { user_id, ex_id } = useParams();
  // const [exhibition, setExhibition] = useState({});

  // Setting state for products list
  const [payload, setPayload] = useState({
    userId: user_id,
    search: "",
  });

  useEffect(() => {
    setPayload({
      userId: user_id,
      search: "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Function to get all products of specific user
  const productsList = async () => {
    const listProductsResponse = await getSellerAllProducts(payload);
    if (!listProductsResponse) {
      return [];
    }
    if (
      listProductsResponse.status === 200 ||
      listProductsResponse.status === "200"
    ) {
      return listProductsResponse.data;
    }
  };

  const products = [];
  // Function to convert userProducts into key value pair
  const selectProductsList = async () => {
    const productsFromApi = await productsList();
    productsFromApi.map((product) => {
      products.push({
        value: product.productId,
        label: product.productName,
      });
    });
  };

  useEffect(() => {
    selectProductsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  // Function to get a product by its Id
  const getProductById = async (id) => {
    const res = await getProduct(id);
    return res;
  };

  // Function to set new value to productId on change of product and display its detail
  const changeProduct = async (e) => {
    setValue("productId", e.value);
    const getProductResponse = await getProductById(e.value);
    if (!getProductResponse) {
      return;
    }
    if (
      getProductResponse.status === 200 ||
      getProductResponse.status === "200"
    ) {
      setProductDesc({
        editorHtml: parser(getProductResponse.data.productDescription),
      });
    }
  };

  return (
    <>
      {operation === "Edit" ? (
        <button
          type="button"
          className="btn btn-xs btn-gradient-dark btn-icon-text"
          onClick={() => exhProductBindData()}
        >
          Edit
        </button>
      ) : (
        <CButton
          className="addbtn"
          color="primary"
          variant="outline"
          size="sm"
          onClick={() => setVisible(!visible)}
        >
          Select Product
        </CButton>
      )}

      {exhibition && exhibition?.exhibitionSellerAddOns && exhibition?.exhibitionSellerAddOns.map((element, index) => {

        if (element && element?.sellerAddOn?.addOn?.addOnName === "Data Entry") {
          return (
            <React.Fragment key={index}>
              <CButton
                className="addbtn"
                color="primary"
                variant="outline"
                size="sm"
                onClick={() => setVisible(!visible)}
              >
                Select Product
              </CButton>
            </React.Fragment>

          )
        }

      })

      }







      {
        exhProducts && exhProducts.length >= 20 ? (
          <CModal
            alignment="top"
            visible={visible}
            onClose={() => setVisible(false)}
          >
            <CModalHeader>
              <CModalTitle>Product limit reached</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CContainer>
                <CRow>
                  <CCol sm={12}>
                    Upgrade your subscription to add more products
                  </CCol>
                </CRow>
              </CContainer>
            </CModalBody>
          </CModal>
        ) : (
          <CModal
            size="xl"
            alignment="top"
            visible={visible}
            onClose={() => close()}
          >
            <CModalHeader className="">
              <CModalTitle>{operation} Product</CModalTitle>
            </CModalHeader>
            <CForm onSubmit={handleSubmit(addEditExhProductSubmit)}>
              <CModalBody>
                <CContainer>
                  <CRow>
                    <CCol sm={12}>
                      <CFormLabel htmlFor="productId">Product Name</CFormLabel>
                      {operation === "Edit" ? (
                        <CFormInput
                          type="hidden"
                          value={exhProduct.exhibitionProductId}
                          {...register("exhibitionProductId")}
                        />
                      ) : null}
                      <Select
                        id="productId"
                        name="productId"
                        defaultValue={
                          exhProduct
                            ? {
                              value: Number(exhProduct.productId),
                              label: exhProduct.product.productName,
                            }
                            : null
                        }
                        isDisabled={exhProduct ? true : false}
                        options={products}
                        {...register("productId", {
                          required: "Product is required",
                        })}
                        onKeyUp={() => {
                          trigger("productId");
                        }}
                        onChange={changeProduct}
                      />
                      {errors.productId && (
                        <small className="text-danger">
                          {errors.productId.message}
                        </small>
                      )}
                    </CCol>
                    &nbsp;
                    <CCol sm={12}>
                      <CFormLabel htmlFor="productDetail">
                        Product Detail
                      </CFormLabel>
                      <div className="app">
                        <ReactQuill
                          theme={"snow"}
                          onChange={onDescChange}
                          defaultValue={
                            exhProduct
                              ? parser(`${productDesc.editorHtml}`)
                              : null
                          }
                          value={productDesc.editorHtml || ""}
                          modules={modules}
                          formats={formats}
                          bounds={".app"}
                          placeholder={placeholder}
                        />
                      </div>
                    </CCol>
                    &nbsp;
                    <CCol sm={12}>
                      <CFormLabel htmlFor="totalQuantity">
                        Total Quantity
                      </CFormLabel>
                      <CFormInput
                        type="number"
                        id="totalQuantity"
                        name="totalQuantity"
                        defaultValue={exhProduct ? exhProduct.totalQuantity : 0}
                        {...register("totalQuantity", {
                          required: "Total Quantity of product is required",
                        })}
                        onKeyUp={() => {
                          trigger("totalQuantity");
                        }}
                      />
                      {errors.totalQuantity && (
                        <small className="text-danger">
                          {errors.totalQuantity.message}
                        </small>
                      )}
                    </CCol>
                    <CFormInput
                      type="hidden"
                      id="exhibitionId"
                      name="exhibitionId"
                      defaultValue={ex_id}
                      {...register("exhibitionId")}
                    />
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
        )
      }
    </>
  );
};

export default ExhibitionProductsAddEditModal;
