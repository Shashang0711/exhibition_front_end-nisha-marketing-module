/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  CButton,
  CRow,
  CCol,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
} from "@coreui/react";
import { Form } from "react-bootstrap";
import Select from "react-select";
import Creatable from "react-select/creatable";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import parser from "html-react-parser";
import Toast from "../../../utils/toast";
import "../../../components/editor/Editor.css";
import {
  addProduct,
  filePost,
  updateProduct,
} from "../../../services/product.service";
import { fetchAllCategories } from "../../../services/category.service";
import { getAllSellers } from "../../../services/user.service";
import { getAllTags } from "../../../services/tag.service";
import { getProductImages } from "../../../services/productImages.service";
import bsCustomFileInput from "bs-custom-file-input";
import "../Products.css";
import { quillConfig, imageUrl } from "../../../constants/constants";

const ProductAddEditModal = (props) => {
  let sellerId;
  if (localStorage.getItem("sellerId")) {
    sellerId = localStorage.getItem("sellerId");
  }
  const user = JSON.parse(localStorage.getItem("user"));

  // Setting up history and destructuring props for add/edit
  const history = useHistory();
  const location = useLocation();
  const { operation, buttonText, product } = location.state;

  // Configuring React-Quill Editor
  const modules = quillConfig.modules;
  const formats = quillConfig.formats;
  const placeholder = quillConfig.placeholder;

  // State for editor
  const [productDesc, setProductDesc] = useState({ editorHtml: "" });
  // changeHandler
  const onDescChange = (html) => {
    setProductDesc({ editorHtml: html });
  };

  useEffect(() => {
    if (product) {
      setProductDesc(product.productDescription);
    }
  }, [product]);

  useEffect(() => {
    bsCustomFileInput.init();
  }, [bsCustomFileInput]);

  // Setting state for form submission
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Setting state for users list
  const [searchPayload, setSearchPayload] = useState({
    search: "",
  });

  // Setting state for category
  const [categories, setCategories] = useState([]);

  const [catSearchVal, setCatSearchVal] = useState("");

  // Setting state for tags
  const [tags, setTags] = useState([]);
  const [tagSearchVal, setTagSearchVal] = useState("");

  // useForm for react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    setValue,
    getValues,
    control,
  } = useForm();

  useEffect(() => {
    if (operation === "Add") {
      reset({
        productName: "",
        userId: "",
        categoryIds: [],
        tagIds: [],
        productImages: "",
      });
      // If user is admin logged in as seller
      if (user.role === "admin" && sellerId) {
        setValue("userId", sellerId);
      }
      //If user is seller
      if (user.role === "seller") {
        setValue("userId", user.userId);
      }
      setSelectedOptions([]);
      setAddedTags([]);
      setProductDesc({ editorHtml: "" });
    } else {
      productBindData();
    }
  }, [formSubmitted]);

  // Fetch all categories first time and fetch again as per search value
  useEffect(() => {
    fetchCategories();
  }, [catSearchVal]);

  // Fetch all categories
  const fetchCategories = async () => {
    const getCategoryResponse = await fetchAllCategories({
      search: catSearchVal,
    });
    if (!getCategoryResponse) {
      return;
    }
    if (
      getCategoryResponse.status === 200 ||
      getCategoryResponse.status === "200"
    ) {
      const allCategories = getCategoryResponse.data;
      allCategories.forEach((category) => {
        setCategories((existingCategories) => [
          ...existingCategories,
          { value: category.categoryId, label: category.name },
        ]);
      });
    }
  };

  // Add or Edit product
  const addEditProductSubmit = async (e) => {
    // Only in case of edit we will get values without useForm
    if (operation === "Edit") {
      e.productImages = document.getElementById("productImages").files;
    }

    // Adding Variants in payload
    e.options = combinations;
    for (let i = 0; i < combinations.length; i++) {
      e.options[i]["price"] = e[`priceIndex${i}`];
      e.options[i]["compareAtPrice"] = e[`comparePriceIndex${i}`];
      delete e[`priceIndex${i}`];
      delete e[`comparePriceIndex${i}`];
    }
    let productImages = await handleFile(e.productImages);

    const payload = {
      categoryIds: e.categoryIds,
      id: e.id,
      options: e.options,
      productName: e.productName,
      tagIds: e.tagIds,
      userId: e.userId,
      productImages: productImages.data, // Formatting productImage value as it returns array & we have to send string
      metaTagTitle: e.metaTagTitle,
      metaTagDescription: e.metaTagDescription,
      metaTagKeywords: e.metaTagKeywords,
    };

    // Setting product description in payload
    payload.productDescription = productDesc.editorHtml;

    // Setting attributes in payload
    payload.attributes = attributes;

    if (operation === "Add") {
      // Setting categoryIds key value as per req body
      let categoryIds = [];
      selectedOptions.map((option) => {
        categoryIds.push({ categoryProductId: 0, categoryId: option.value });
      });
      // Adding categoryIds in payload
      payload.categoryIds = categoryIds;

      let tagIds = [];
      addedTags.map((tag) => {
        if (tag.__isNew__) {
          tagIds.push({ tagProductId: 0, tagId: "", tagName: tag.label });
        } else {
          tagIds.push({
            tagProductId: 0,
            tagId: tag.value,
            tagName: tag.label,
          });
        }
      });
      payload.tagIds = tagIds;

      const addProductResponse = await addProduct(payload);
      if (!addProductResponse) {
        return;
      }
      if (
        addProductResponse.status === 200 ||
        addProductResponse.status === "200"
      ) {
        Toast("success", "Product added successfully");
        setFormSubmitted(true);
        history.push("/products");
      } else {
        Toast("error", "Failed to add product");
      }
    } else {
      // Setting existing images
      payload.existingImages = existingImages;

      // Setting categoryIds key value as per req body
      let categoryIds = [];
      selectedOptions &&
        selectedOptions.map((option) => {
          if (!option.categoryProductId) {
            categoryIds.push({
              categoryProductId: 0,
              categoryId: option.value,
            });
          }
          if (option.categoryProductId) {
            categoryIds.push({
              categoryProductId: option.categoryProductId,
              categoryId: option.value,
            });
          }
        });
      // Adding categoryIds in payload
      payload.categoryIds = categoryIds;

      let tagIds = [];
      addedTags &&
        addedTags.map((tag) => {
          if (tag.__isNew__) {
            tagIds.push({ tagProductId: 0, tagId: "", tagName: tag.label });
          } else {
            if (tag.tagProductId) {
              tagIds.push({
                tagProductId: tag.tagProductId,
                tagId: tag.value,
                tagName: tag.label,
              });
            } else {
              tagIds.push({
                tagProductId: 0,
                tagId: tag.value,
                tagName: tag.label,
              });
            }
          }
        });

      payload.tagIds = tagIds;

      const editProductResponse = await updateProduct(payload);
      if (!editProductResponse) {
        return;
      }
      if (
        editProductResponse.status === 200 ||
        editProductResponse.status === "200"
      ) {
        Toast("success", "Product updated successfully");
        setFormSubmitted(true);
        history.push("/products");
      } else {
        Toast("error", "Failed to update product");
      }
    }
  };

  // Fetch all tags first timen and fetch again as per search value
  useEffect(() => {
    fetchTags();
  }, [tagSearchVal]);

  // Fetch all tags
  const fetchTags = async () => {
    const getTagsResponse = await getAllTags({ search: "" });
    if (getTagsResponse.status === 200 || getTagsResponse.status === "200") {
      const allTags = getTagsResponse.data;
      allTags.forEach((tag) => {
        setTags((existingTags) => [
          ...existingTags,
          { value: tag.tagId, label: tag.tagName },
        ]);
      });
    }
  };

  // Function to display specific product detail in edit modal
  const productBindData = async () => {
    reset({
      productName: "",
      userId: "",
      categoryIds: [],
      tagIds: [],
      productImages: "",
    });

    setValue("productName", product.productName);
    setValue("userId", product.userId);
    setValue("categoryIds", getExistingCategories());
    setValue("tagIds", getExistingTags());
    setValue("productImages", product.productImages);
    setCategories(categories);
    setTags(tags);

    setProductDesc({ editorHtml: parser(product.productDescription) });
    formatOptionFromAPI(product.variants);
    setCombinations(product.variants);
    if (product.attributes[0]) {
      setAttributes(JSON.parse(product.attributes[0].attributes));
    } else {
      setAttributes([]);
    }

    await getExistingImages(product.productId);
  };

  const handleFile = async (imagesFromClient) => {
    const formData = new FormData();
    for (const image of imagesFromClient) {
      formData.append("images", image);
    }
    const imagesFromServer = await filePost(formData);
    return imagesFromServer;
  };

  // Function to get all users list
  const usersList = async () => {
    const listUsersResponse = await getAllSellers(searchPayload);
    if (!listUsersResponse) {
      return [];
    }
    if (
      listUsersResponse.status === 200 ||
      listUsersResponse.status === "200"
    ) {
      return listUsersResponse.data;
    }
  };

  const users = [];
  // Function to convert users to label value pair
  const selectUsersList = async () => {
    const usersFromApi = await usersList();
    usersFromApi.map((user) => {
      users.push({
        value: user.userId,
        label: user.userName,
      });
    });
  };

  useEffect(() => {
    selectUsersList();
  }, [users]);

  const [selectedOptions, setSelectedOptions] = useState();

  function handleSelect(data) {
    setSelectedOptions(data);
  }

  const [addedTags, setAddedTags] = useState();

  function handleTags(data) {
    setAddedTags(data);
  }

  // Function to get existing categories of product in value and label format
  const getExistingCategories = () => {
    const productCategories = [];
    product.categoryProducts.map((prodCat) => {
      productCategories.push({
        value: prodCat.categoryId,
        label: prodCat.category.name,
        categoryProductId: prodCat.categoryProductId,
      });
    });
    return productCategories;
  };

  // Function to get existing tags of product in value and label format
  const getExistingTags = () => {
    const productTags = [];
    product.tagProducts.map((prodTag) => {
      productTags.push({
        value: prodTag.tagId,
        label: prodTag.tag.tagName,
        tagProductId: prodTag.tagProductId,
      });
    });
    return productTags;
  };

  // ************************ //
  // Variant Code Starts Here //
  // ************************ //

  // Setting State for Each option
  const [options, setOptions] = useState([
    {
      optionName: "",
      optionValue: [""],
    },
  ]);
  const [combinations, setCombinations] = useState([]);

  // Function to add new option
  const addOptionValue = (index) => {
    const newOption = JSON.parse(JSON.stringify(options));
    newOption[index].optionValue.push("");
    setOptions(newOption);
    formatOptions(newOption);
  };
  const addOption = () => {
    const newTempArr = JSON.parse(JSON.stringify(options));
    newTempArr.push({
      optionName: "",
      optionValue: [""],
    });
    setOptions(newTempArr);
    formatOptions(newTempArr);
  };

  const updateOptionName = (optionIndex, value) => {
    const newOption = JSON.parse(JSON.stringify(options));
    newOption[optionIndex].optionName = value || "";
    setOptions(newOption);
    formatOptions(newOption);
  };

  const updateOptionValue = (optionIndex, optionValueIndex, value) => {
    const newOption = JSON.parse(JSON.stringify(options));
    newOption[optionIndex].optionValue[optionValueIndex] = value;
    setOptions(newOption);
    formatOptions(newOption);
  };

  const removeOption = (optionIndex) => {
    const tempOption = JSON.parse(JSON.stringify(options));
    tempOption.splice(optionIndex, 1);
    setOptions(tempOption);
    formatOptions(tempOption);
  };

  const removeOptionValue = (optionIndex, optionValueIndex) => {
    const tempOption = JSON.parse(JSON.stringify(options));
    tempOption[optionIndex].optionValue.splice(optionValueIndex, 1);
    setOptions(tempOption);
    formatOptions(tempOption);
  };

  const formatOptionFromAPI = (variants) => {
    const tempVariation = {};
    const allVariation = Object.keys(variants[0].variant);
    for (const varaintKey of allVariation) {
      tempVariation[varaintKey] = new Set();
    }

    for (const variantData of variants) {
      for (const varaintKey of allVariation) {
        tempVariation[varaintKey].add(variantData.variant[varaintKey]);
      }
    }

    const tempOptions = [];
    for (const [i, opt] of allVariation.entries()) {
      const tempOpt = {
        optionName: opt,
        optionValue: Array.from(tempVariation[opt]),
      };
      tempOptions.push(tempOpt);
    }
    setOptions(tempOptions);
  };

  const formatOptions = (optionsParam) => {
    const formattedOptions = {};
    optionsParam.map((option) => {
      formattedOptions[option.optionName] = option.optionValue;
    });
    const variationPriceArray = [];
    const optArr = Object.keys(formattedOptions);
    const firstElement = optArr.shift();
    if ((optArr && optArr.length > 0) || firstElement) {
      for (const optionValue of formattedOptions[firstElement]) {
        let tempObject = { variant: {}, price: 0, compareAtPrice: 0 };
        tempObject.variant[firstElement] = optionValue;
        variationPriceArray.push(tempObject);
      }
      const newData = createVariation(
        variationPriceArray,
        optArr,
        formattedOptions
      );
      setCombinations(newData);
    }
    if (optionsParam && optionsParam.length === 0) {
      setCombinations([]);
    }
  };

  const getDataFromVariations = (index) => {
    if (combinations && combinations[index] && combinations[index].variant) {
      const parsedValues = combinations[index].variant;
      const values = Object.values(parsedValues);
      let tempString = "";
      if (values && values.length) {
        values.forEach((data) => {
          tempString = `${tempString}/${data}`;
        });
      }
      return <p>{tempString.slice(1)}</p>;
    } else {
      return <p></p>;
    }
  };

  // Function to make combinations of variantions
  const createVariation = (varationArray, optArr, formattedOptions) => {
    if (optArr.length === 0) {
      return varationArray;
    }
    const keyName = optArr[0];
    const emptyVarriationArr = [];
    if (formattedOptions[keyName] && formattedOptions[keyName].length > 0) {
      for (const optionValue of formattedOptions[keyName]) {
        const fakeArr = [];
        for (let i = 0; i < varationArray.length; i++) {
          let tempObject = JSON.parse(JSON.stringify(varationArray[i]));
          tempObject.variant[keyName] = optionValue;
          fakeArr.push(tempObject);
        }
        emptyVarriationArr.push(...fakeArr);
      }
      varationArray = JSON.parse(JSON.stringify(emptyVarriationArr));
    }
    optArr.shift();
    return createVariation(varationArray, optArr, formattedOptions);
  };

  // ************************ //
  // Attribute Code Starts Here //
  // ************************ //
  const [attributes, setAttributes] = useState([]);

  const addAttribute = () => {
    const tempArray = JSON.parse(JSON.stringify(attributes));
    tempArray.push({
      attributeName: "",
      attributeValue: "",
    });
    setAttributes(tempArray);
  };

  const updateAttributeName = (index, attributeName) => {
    const tempArray = JSON.parse(JSON.stringify(attributes));
    tempArray[index].attributeName = attributeName;
    setAttributes(tempArray);
  };

  const updateAttributeValue = (index, attributeValue) => {
    const tempArray = JSON.parse(JSON.stringify(attributes));
    tempArray[index].attributeValue = attributeValue;
    setAttributes(tempArray);
  };

  const removeAttribute = (index) => {
    const tempArray = JSON.parse(JSON.stringify(attributes));
    tempArray.splice(index, 1);
    setAttributes(tempArray);
  };

  // ************************ //
  // Product Image Code Starts Here //
  // ************************ //

  // Display already uploaded images

  // State to store already uploaded images
  const [existingImages, setExistingImages] = useState([]);

  // Function to get already uploaded images from server
  const getExistingImages = async (productId) => {
    const existingImageResponse = await getProductImages({ productId });
    if (!existingImageResponse) {
      return;
    }
    setExistingImages(existingImageResponse.data.rows);
  };

  // Function to remove already uploaded image
  const removeProductImage = async (id) => {
    try {
      setExistingImages(existingImages.filter((image) => id !== image.id));
    } catch (error) {
      Toast("error", error.message);

    }
  };

  return (
    <>
      <div>
        <div className="page-header">
          <h3 className="page-title"> {buttonText} </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/products">Products</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {buttonText}
              </li>
            </ol>
          </nav>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">{buttonText}</h4>
                <p className="card-description">{`${operation} Product Details`}</p>
                <CForm onSubmit={handleSubmit(addEditProductSubmit)}>
                  {user.role === "admin" ? (
                    sellerId ? (
                      <CFormInput
                        type="hidden"
                        value={sellerId}
                        {...register("userId")}
                      />
                    ) : (
                      <CRow>
                        <CCol sm={12}>
                          <CFormLabel htmlFor="userId">
                            Select Seller
                          </CFormLabel>
                          <Select
                            aria-label="Default select example"
                            id="userId"
                            name="userId"
                            defaultValue={
                              product
                                ? {
                                  value: Number(product.userId),
                                  label: product.user.userName,
                                }
                                : null
                            }
                            options={users}
                            {...register("userId", {
                              required: "User is required",
                            })}
                            onKeyUp={() => {
                              trigger("userId");
                            }}
                            onChange={(e) => {
                              setValue("userId", e.value); // Set value of react-hook-form if user is changed
                            }}
                          />
                          {errors.userId && (
                            <small className="text-danger">
                              {errors.userId.message}
                            </small>
                          )}
                        </CCol>
                      </CRow>
                    )
                  ) : (
                    <CFormInput
                      type="hidden"
                      value={user.userId}
                      {...register("userId")}
                    />
                  )}
                  &nbsp;
                  <CRow>
                    <CCol sm={12}>
                      <CFormLabel htmlFor="productName">
                        Product Name
                      </CFormLabel>
                      {operation === "Edit" ? (
                        <CFormInput
                          type="hidden"
                          value={product.productId}
                          {...register("id")}
                        />
                      ) : null}
                      <CFormInput
                        type="text"
                        name="referenceName"
                        id="productName"
                        placeholder="Enter the product name"
                        defaultValue={product ? product.productName : ""}
                        {...register("productName", {
                          required: "Product name is required",
                        })}
                        onKeyUp={() => {
                          trigger("productName");
                        }}
                      />
                      {errors.productName && (
                        <small className="text-danger">
                          {errors.productName.message}
                        </small>
                      )}
                    </CCol>
                  </CRow>
                  &nbsp;
                  <CRow>
                    <CCol sm={12}>
                      <CFormLabel htmlFor="productDescription">
                        Product Description
                      </CFormLabel>
                      <div className="app">
                        <ReactQuill
                          theme={"snow"}
                          onChange={onDescChange}
                          defaultValue={
                            product ? parser(`${productDesc.editorHtml}`) : null
                          }
                          value={productDesc.editorHtml || ""}
                          modules={modules}
                          formats={formats}
                          bounds={".app"}
                          placeholder={placeholder}
                        />
                      </div>
                    </CCol>
                  </CRow>
                  &nbsp;
                  {operation === "Edit" ? (
                    <CFormInput
                      type="hidden"
                      value={product.id}
                      {...register("id")}
                    />
                  ) : null}
                  &nbsp;
                  <CRow>
                    <CCol sm={12}>
                      <CFormLabel className="underlineStyle">
                        Attributes
                      </CFormLabel>
                      <br />
                      {attributes &&
                        attributes.length > 0 &&
                        attributes.map((attribute, index) => {
                          return (
                            <div>
                              &nbsp;
                              <CRow>
                                <CCol sm={5}>
                                  <CFormLabel htmlFor={`attrName${index}`}>
                                    Attribute Name
                                  </CFormLabel>
                                  <CFormInput
                                    type="text"
                                    name={`attrName${index}`}
                                    id={`attrName${index}`}
                                    value={attribute.attributeName}
                                    onChange={(e) => {
                                      updateAttributeName(
                                        index,
                                        e.target.value
                                      );
                                    }}
                                    required
                                  />
                                </CCol>
                                <CCol sm={5}>
                                  <CFormLabel htmlFor={`attrVal${index}`}>
                                    Attribute Value
                                  </CFormLabel>
                                  <CFormInput
                                    type="text"
                                    name={`attrVal${index}`}
                                    id={`attrVal${index}`}
                                    value={attribute.attributeValue}
                                    onChange={(e) => {
                                      updateAttributeValue(
                                        index,
                                        e.target.value
                                      );
                                    }}
                                    required
                                  />
                                </CCol>
                                <CCol sm={2}>
                                  <br />
                                  <button
                                    type="button"
                                    className="btn btn-xs btn-gradient-danger btn-icon-text"
                                    onClick={() => removeAttribute(index)}
                                  >
                                    Delete
                                  </button>
                                </CCol>
                              </CRow>
                            </div>
                          );
                        })}
                      <CButton
                        type="button"
                        color="primary"
                        size="sm"
                        variant="outline"
                        onClick={addAttribute}
                      >
                        Add Attribute
                      </CButton>
                    </CCol>
                  </CRow>
                  &nbsp;
                  <CRow>
                    <CCol sm={12}>
                      <CFormLabel className="underlineStyle">
                        Options
                      </CFormLabel>
                      <br />
                      {options &&
                        options.length > 0 &&
                        options.map((opt, optIndex) => {
                          return (
                            <div key={optIndex}>
                              <CFormLabel htmlFor={`${optIndex}`}>
                                Option Name
                              </CFormLabel>
                              <CRow>
                                <CCol sm={11}>
                                  <CFormInput
                                    type="text"
                                    name={optIndex}
                                    defaultValue={opt.optionName}
                                    onChange={(e) =>
                                      updateOptionName(optIndex, e.target.value)
                                    }
                                    required
                                  />
                                </CCol>
                                {
                                  // Deletion disabled for first option (at least one option(variant) is required)
                                  optIndex !== 0 ? (
                                    <CCol sm={1}>
                                      <button
                                        type="button"
                                        className="btn btn-xs btn-gradient-danger btn-icon-text"
                                        onClick={() => removeOption(optIndex)}
                                      >
                                        Delete
                                      </button>
                                    </CCol>
                                  ) : null
                                }
                              </CRow>
                              {options[optIndex] &&
                                options[optIndex].optionValue &&
                                options[optIndex].optionValue.map(
                                  (optvalue, optvalueIndex) => {
                                    return (
                                      <React.Fragment key={optvalueIndex}>
                                        <CFormLabel
                                          htmlFor={`${optvalueIndex}`}
                                        >
                                          Enter value
                                        </CFormLabel>
                                        <CRow>
                                          <CCol sm={11}>
                                            <CFormInput
                                              type="text"
                                              name={optvalueIndex}
                                              defaultValue={optvalue}
                                              onChange={(e) =>
                                                updateOptionValue(
                                                  optIndex,
                                                  optvalueIndex,
                                                  e.target.value
                                                )
                                              }
                                              required
                                            />
                                          </CCol>
                                          <CCol sm={1}>
                                            {optvalueIndex !== 0 ? (
                                              <button
                                                type="button"
                                                className="btn btn-xs btn-gradient-danger btn-icon-text"
                                                onClick={() =>
                                                  removeOptionValue(
                                                    optIndex,
                                                    optvalueIndex
                                                  )
                                                }
                                              >
                                                <i className="mdi mdi-delete-outline text-danger"></i>
                                              </button>
                                            ) : null}
                                          </CCol>
                                        </CRow>
                                      </React.Fragment>
                                    );
                                  }
                                )}
                              <br />
                              <button
                                type="button"
                                className="btn btn-xs btn-outline-secondary btn-rounded btn-icon"
                                onClick={() => addOptionValue(optIndex)}
                              >
                                <i className="mdi mdi-plus text-info"></i>
                              </button>
                              <hr />
                            </div>
                          );
                        })}

                      <CButton
                        type="button"
                        color="primary"
                        size="sm"
                        variant="outline"
                        onClick={addOption}
                      >
                        Add Option
                      </CButton>
                    </CCol>
                  </CRow>
                  &nbsp;
                  {combinations && combinations.length > 0 ? (
                    <CCol sm={12}>
                      <div className="card">
                        <div className="card-body">
                          <h4 className="card-title">Variants</h4>
                          <p className="card-description">
                            {`${operation} price for different variants`}
                          </p>
                          <div className="table-responsive">
                            <table className="table table-hover">
                              <thead>
                                <tr>
                                  <th>Variants</th>
                                  <th>Price</th>
                                  <th>Compare at price</th>
                                </tr>
                              </thead>
                              <tbody>
                                {combinations &&
                                  combinations.map((combination, index) => {
                                    return (
                                      <React.Fragment key={index}>
                                        <tr>
                                          <td>
                                            {combinations &&
                                              combinations.length > 0 &&
                                              getDataFromVariations(index)}
                                          </td>
                                          <td>
                                            <CFormInput
                                              type="number"
                                              defaultValue={
                                                product &&
                                                  product.variants &&
                                                  product.variants[index] &&
                                                  product.variants[index].price
                                                  ? product.variants[index]
                                                    .price
                                                  : 0
                                              }
                                              onChange={(e) => {
                                                combination["price"] =
                                                  e.target.value;
                                              }}
                                              {...register(
                                                `priceIndex${index}`,
                                                {
                                                  required: "Price is required",
                                                }
                                              )}
                                            />
                                          </td>
                                          <td>
                                            <CFormInput
                                              type="number"
                                              defaultValue={
                                                product &&
                                                  product.variants &&
                                                  product.variants[index] &&
                                                  product.variants[index]
                                                    .compareAtPrice
                                                  ? product.variants[index]
                                                    .compareAtPrice
                                                  : 0
                                              }
                                              onChange={(e) => {
                                                combination["compareAtPrice"] =
                                                  e.target.value;
                                              }}
                                              {...register(
                                                `comparePriceIndex${index}`,
                                                {
                                                  required:
                                                    "Compare at price is required",
                                                }
                                              )}
                                            />
                                          </td>
                                        </tr>
                                      </React.Fragment>
                                    );
                                  })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </CCol>
                  ) : null}
                  &nbsp;
                  <CRow>
                    <CCol sm={12}>
                      {operation === "Add" ? (
                        <>
                          <Form.Group>
                            <CFormLabel htmlFor="productImages">
                              Upload Product Images{" "}
                              <span className="text-muted">
                                (Maximum upload size: 5 MB)
                              </span>
                            </CFormLabel>
                            <div className="custom-file">
                              <Form.Control
                                type="file"
                                className="form-control visibility-hidden"
                                multiple
                                id="productImages"
                                lang="es"
                                accept="image/png, image/jpg, image/jpeg"
                                {...register("productImages", {
                                  required: "Product image is required",
                                })}
                              />
                              <label
                                className="custom-file-label"
                                htmlFor="productImages"
                              >
                                Upload images
                              </label>
                              {errors.productImages && (
                                <small className="text-danger">
                                  {errors.productImages.message}
                                </small>
                              )}
                            </div>
                          </Form.Group>
                        </>
                      ) : (
                        <Form.Group>
                          <CFormLabel htmlFor="productImages">
                            Upload Product Images
                          </CFormLabel>
                          {existingImages && existingImages.length > 0 ? (
                            <div className="custom-file">
                              <Form.Control
                                type="file"
                                name="productImages"
                                className="form-control visibility-hidden"
                                multiple
                                id="productImages"
                                lang="es"
                                accept="image/png, image/jpg, image/jpeg"
                              />
                              <label
                                className="custom-file-label"
                                htmlFor="productImages"
                              >
                                Upload images
                              </label>
                            </div>
                          ) : (
                            <div className="custom-file">
                              <Form.Control
                                type="file"
                                name="productImages"
                                multiple
                                id="productImages"
                                lang="es"
                                accept="image/png, image/jpg, image/jpeg"
                                required
                              />
                              <label
                                className="custom-file-label"
                                htmlFor="productImages"
                              >
                                Upload images
                              </label>
                            </div>
                          )}
                        </Form.Group>
                      )}
                    </CCol>
                  </CRow>
                  {existingImages && existingImages.length > 0 ? (
                    <CRow>
                      <CFormLabel>Existing Product Image(s)</CFormLabel>
                      <CCol sm={12} className="wrapper">
                        {existingImages.map((image) => (
                          <div key={image.id} className="imageContainer">
                            <img
                              className="image"
                              src={imageUrl + image.imagePath}
                              alt="existing product"
                            />
                            <i
                              className="mdi mdi-close-outline text-info"
                              style={{
                                position: "absolute",
                                top: "0",
                                right: "0",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                removeProductImage(image.id);
                              }}
                            ></i>
                          </div>
                        ))}
                      </CCol>
                    </CRow>
                  ) : (
                    <></>
                  )}
                  &nbsp;
                  <CRow>
                    <CCol sm={12}>
                      <CFormLabel htmlFor="categoryId">
                        Select Categories
                      </CFormLabel>
                      <Select
                        id="categoryIds"
                        name="categoryIds"
                        options={categories}
                        placeholder="Select categories"
                        defaultValue={product ? getExistingCategories() : null}
                        value={selectedOptions}
                        onChange={handleSelect}
                        isSearchable={true}
                        isMulti
                      />
                    </CCol>
                  </CRow>
                  &nbsp;
                  <CRow>
                    <CCol sm={12}>
                      <CFormLabel htmlFor="tagIds">Add Tags</CFormLabel>
                      <Creatable
                        id="tagIds"
                        name="tagIds"
                        options={tags}
                        placeholder="Add Tags"
                        defaultValue={product ? getExistingTags() : null}
                        value={addedTags}
                        onChange={handleTags}
                        isSearchable={true}
                        isMulti
                      />
                    </CCol>
                  </CRow>
                  &nbsp;
                  <CRow>
                    <CCol sm={12}>Meta Details</CCol>
                  </CRow>
                  <hr />
                  <CRow>
                    <CCol sm={12}>
                      <CFormLabel htmlFor="metaTagTitle">
                        Meta Tag Title
                      </CFormLabel>
                      <CFormInput
                        type="text"
                        placeholder="Meta Tag Title"
                        name="metaTagTitle"
                        id="metaTagTitle"
                        defaultValue={product ? product.metaTagTitle : ""}
                        {...register("metaTagTitle", {
                          required: "Meta tag title is required",
                        })}
                        onKeyUp={() => {
                          trigger("metaTagTitle");
                        }}
                      />
                      {errors.metaTagTitle && (
                        <small className="text-danger">
                          {errors.metaTagTitle.message}
                        </small>
                      )}
                    </CCol>
                  </CRow>
                  &nbsp;
                  <CRow>
                    <CCol sm={12}>
                      <CFormLabel htmlFor="metaTagDescription">
                        Meta Tag Description
                      </CFormLabel>
                      <CFormTextarea
                        rows="3"
                        placeholder="Meta Tag Description"
                        name="metaTagDescription"
                        id="metaTagDescription"
                        defaultValue={product ? product.metaTagDescription : ""}
                        {...register("metaTagDescription")}
                      ></CFormTextarea>
                    </CCol>
                  </CRow>
                  &nbsp;
                  <CRow>
                    <CCol sm={12}>
                      <CFormLabel htmlFor="metaTagKeywords">
                        Meta Tag Keywords
                      </CFormLabel>
                      <CFormTextarea
                        row="3"
                        placeholder="Meta Tag Keywords"
                        name="metaTagKeywords"
                        id="metaTagKeywords"
                        defaultValue={product ? product.metaTagKeywords : ""}
                        {...register("metaTagKeywords")}
                      ></CFormTextarea>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol sm={12} className="mt-5">
                      <div className="d-flex justify-content-center">
                        <CButton
                          color="danger"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            history.push("/products");
                          }}
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
                </CForm>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductAddEditModal;
