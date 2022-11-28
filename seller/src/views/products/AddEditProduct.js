import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CategorySelect from 'src/components/categorySelect/CategorySelect';
import TagsSelect from 'src/components/tagsSelect/TagsSelect';
import parser from "html-react-parser";
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import '../../components/editor/Editor.css'
import { quillConfig, imageUrl, filesFormats } from 'src/constants/constants'
import Attributes from 'src/components/attributes/Attributes'
import { CatService } from 'src/services/categories';
import { TagService } from 'src/services/tags';
import { prodService } from 'src/services/products';
import { prodImgService } from 'src/services/productImages';
import { useSelector } from 'react-redux';
import Variants from './components/variants/Variants';
import Combinations from './components/combinations/Combinations';
import './Products.css';

const AddEditProduct = () => {
  const user = JSON.parse(useSelector((state) => state.user));
  // Getting props
  const location = useLocation()
  const { operation, buttonText, product } = location.state;
  const navigate = useNavigate();

  // Configuring react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    setValue,
    getValues,
    control
  } = useForm();

  // Configuring React-Quill
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

  // Setting state for form submission
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Setting state for category
  const [categories, setCategories] = useState([]);
  const [catSearchVal, setCatSearchVal] = useState("");

  // Setting state for tags
  const [tags, setTags] = useState([]);
  const [tagSearchVal, setTagSearchVal] = useState("");

  // Fetch all categories first time and fetch again as per search value
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch all categories
  const fetchCategories = async () => {
    const getCategoryResponse = await CatService.getCategories({ search: catSearchVal });
    if (!getCategoryResponse) {
      return;
    }
    if (getCategoryResponse.status === 200 || getCategoryResponse.status === "200") {
      const allCategories = getCategoryResponse.data;
      allCategories.forEach((category) => {
        setCategories((existingCategories) => [
          ...existingCategories,
          { value: category.categoryId, label: category.name },
        ]);
      });
    }
  };

  // Fetch all tags first timen and fetch again as per search value
  useEffect(() => {
    fetchTags();
  }, []);

  // Fetch all tags
  const fetchTags = async () => {
    const getTagsResponse = await TagService.getAllTags({ search: '' });
    if (!getTagsResponse) {
      return;
    }
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

  const handleFile = async (imagesFromClient) => {
    console.log("imagesFromClient", imagesFromClient)
    const formData = new FormData();
    const upload_file = imagesFromClient;
    const fileExtention = imagesFromClient[0].name.split('.')
    if (upload_file && filesFormats.includes(upload_file.type) || filesFormats.includes("." + fileExtention[1])) {
      for (const image of imagesFromClient) {
        formData.append("images", image);
      }
      const imagesFromServer = await prodService.filePost(formData);
      return imagesFromServer;
    } else {
      toast.warning("Only jpg and png files are allowed!")
    }

  };

  const [selectedOptions, setSelectedOptions] = useState();

  const [addedTags, setAddedTags] = useState();

  // Function to get existing categories of product in value and label format
  const getExistingCategories = () => {
    const productCategories = [];
    product?.categoryProducts.map((prodCat) => {
      productCategories.push({
        value: prodCat?.categoryId,
        label: prodCat?.category?.name,
        categoryProductId: prodCat?.categoryProductId,
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

  // State for Attributes
  const [attributes, setAttributes] = useState([]);

  // ****************************** //
  //    Variant Code Starts Here    //
  // ****************************** //
  const [options, setOptions] = useState([{
    optionName: '',
    optionValue: [''],
  }]);
  const [combinations, setCombinations] = useState([]);

  useEffect(() => {

  }, [options])

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

  // ******************************  //
  // Product Image Code Starts Here //
  // ****************************** //

  // Display already uploaded images

  // State to store already uploaded images 
  const [existingImages, setExistingImages] = useState([]);

  // Function to get already uploaded images from server
  const getExistingImages = async (productId) => {
    try {
      const existingImageResponse = await prodImgService.getProductImages({ productId });
      if (!existingImageResponse) {
        return;
      }
      setExistingImages(existingImageResponse.data.rows);
    } catch (error) {
      toast.error(error.message);

    }
  }

  // Function to remove already uploaded image
  const removeProductImage = async (id) => {
    try {
      setExistingImages(existingImages.filter((image) => id !== image.id));
    } catch (error) {
      toast.error('error', error.message);

    }
  }

  useEffect(() => {
    if (operation === "Add") {
      reset({
        productName: "",
        userId: "",
        categoryIds: [],
        tagIds: [],
        productImages: "",
      });
      setValue('userId', user.userId);
      setSelectedOptions([]);
      setAddedTags([]);
      setProductDesc({ editorHtml: "" });
    } else {
      productBindData();
    }
  }, [formSubmitted]);

  // Function to display specific product detail in edit modal
  const productBindData = async () => {
    reset({
      id: "",
      productName: "",
      userId: "",
      categoryIds: [],
      tagIds: [],
      productImages: "",
    });

    setValue("id", product.productId); // Setting productId without input type hidden
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

  const addEditProductSubmit = async (e) => {
    // Only in case of edit we will get values without useForm
    if (operation === 'Edit') {
      e.productImages = document.getElementById('productImages').files;
    }

    // Adding Variants in payload
    e.options = combinations;
    for (let i = 0; i < combinations.length; i++) {
      e.options[i]["price"] = e[`priceIndex${i}`];
      e.options[i]['compareAtPrice'] = e[`comparePriceIndex${i}`];
      delete e[`priceIndex${i}`];
      delete e[`comparePriceIndex${i}`];
    }
    let productImages = await handleFile(e.productImages);
    if (!productImages) {
      return;
    }

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
      metaTagKeywords: e.metaTagKeywords
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

      const addProductResponse = await prodService.addProduct(payload);
      if (!addProductResponse) {
        return;
      }
      if (addProductResponse.status === 200 || addProductResponse.status === '200') {
        toast.success('Product added successfully');
        setFormSubmitted(true);
        navigate('/inventory/products')
      } else {
        toast.error('Failed to add product');
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

      const editProductResponse = await prodService.updateProduct(payload);
      if (!editProductResponse) {
        return;
      }
      if (editProductResponse.status === 200 || editProductResponse.status === '200') {
        toast.success('Product updated successfully');
        setFormSubmitted(true);
        navigate('/inventory/products');
      } else {
        toast.error('Failed to update product');
      }

    }

  }
  return (
    <>
      <CRow className='mb-5'>
        <CForm onSubmit={handleSubmit(addEditProductSubmit)}>
          <div className='app-table'>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader className='d-flex justify-content-between align-itens-center'>
                  <strong>Basic Product Details</strong>
                  <CButton color="secondary"
                    onClick={() => {
                      navigate("/inventory/products")
                    }}
                  >Back</CButton>
                </CCardHeader>
                <CCardBody>
                  <p className="text-medium-emphasis small">
                    Enter product details.
                  </p>
                  <div className="mb-3">
                    <CFormLabel htmlFor="productName">Product Name</CFormLabel>
                    <CFormInput
                      type="text"
                      id="productName"
                      name="productName"
                      placeholder="Enter product name"
                      {...register("productName", {
                        required: "Product name is required",
                      })}
                      onKeyUp={() => {
                        trigger("productName");
                      }}
                      required
                    />
                    {errors.productName && (
                      <small className="text-danger">
                        {errors.productName.message}
                      </small>
                    )}
                  </div>
                  <div className="mb-3">
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
                  </div>
                  <div className='mb-3'>
                    <Attributes attributes={attributes} setAttributes={setAttributes} />
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>Variants & Pricing</strong>
                </CCardHeader>
                <CCardBody>
                  <p className="text-medium-emphasis small">
                    Add different variants, price and images of products
                  </p>
                  <div className="mb-3">
                    {
                      operation === 'Add' ?
                        <>
                          <CFormLabel htmlFor="productImages">
                            Upload Product Images <small className='text-muted'>(Maximum upload file size: 5MB & You can upload multiple images)</small>
                          </CFormLabel>
                          <CFormInput
                            type="file"
                            id="productImages"
                            name="productImages"
                            multiple
                            accept="image/png, image/jpg, image/jpeg"
                            {...register("productImages", {
                              required: "Product image is required"
                            })}
                          />
                          {errors.productImages && (
                            <small className="text-danger">
                              {errors.productImages.message}
                            </small>
                          )}
                        </>
                        :
                        <>
                          {
                            existingImages && existingImages.length > 0 ?
                              <>
                                <CFormLabel htmlFor="productImages">
                                  Upload Product Images < small > (Maximum upload file size: 5MB & You can upload multiple images)</small >
                                </CFormLabel >
                                <CFormInput
                                  type="file"
                                  id="productImages"
                                  name="productImages"
                                  multiple
                                  accept="image/png, image/jpg, image/jpeg"
                                />
                              </>
                              :
                              <>
                                <CFormLabel htmlFor="productImages">
                                  Upload Product Images < small > (Maximum upload file size: 5MB & You can upload multiple images)</small >
                                </CFormLabel >
                                <CFormInput
                                  type="file"
                                  id="productImages"
                                  name="productImages"
                                  multiple
                                  accept="image/png, image/jpg, image/jpeg"
                                />
                              </>
                          }
                        </>
                    }
                  </div >
                  {
                    existingImages &&
                      existingImages.length > 0 ?
                      <CRow>
                        <CFormLabel>Existing Product Image(s)</CFormLabel>
                        <CCol sm={12} className="wrapper1">
                          {
                            existingImages.map((image) => (
                              <div key={image.id} className="imageContainer">
                                <img className="image" src={imageUrl + image.imagePath} alt="existing product" />
                                <i
                                  className="mdi mdi-close-outline text-info"
                                  style={{
                                    position: "absolute",
                                    top: "0",
                                    right: "0",
                                    cursor: "pointer"
                                  }}
                                  onClick={() => {
                                    removeProductImage(image.id);
                                  }}
                                >
                                </i>
                              </div>
                            ))
                          }
                        </CCol>
                      </CRow>
                      :
                      <></>
                  }
                  <div className='mb-3'>
                    <Variants options={options} setOptions={setOptions} formatOptions={formatOptions} />
                  </div>
                  <div className='mb-3'>
                    <Combinations
                      combinations={combinations}
                      getDataFromVariations={getDataFromVariations}
                      product={product}
                      register={register}
                    />
                  </div>
                </CCardBody >
              </CCard >
            </CCol >
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>Categories & Tags</strong>
                </CCardHeader>
                <CCardBody>
                  <p className="text-medium-emphasis small">
                    Select categories and tags that your product belongs to
                  </p>
                  <div className='mb-3'>
                    <CFormLabel htmlFor="categoryId">
                      Select Categories
                    </CFormLabel>
                    <CategorySelect
                      categories={categories}
                      defaultValue={product ? getExistingCategories() : null}
                      selectedOptions={selectedOptions}
                      setSelectedOptions={setSelectedOptions}
                    />
                  </div>
                  <div className="mb-3">
                    <CFormLabel htmlFor="metaTagTitle">Tags</CFormLabel>
                    <TagsSelect
                      tags={tags}
                      defaultValue={product ? getExistingTags() : null}
                      addedTags={addedTags}
                      setAddedTags={setAddedTags}
                    />
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>SEO Details</strong>
                </CCardHeader>
                <CCardBody>
                  <p className="text-medium-emphasis small">
                    Provide information that will help improve the snippet and bring your product to the top of search engines.
                  </p>
                  <div className="mb-3">
                    <CFormLabel htmlFor="metaTagTitle">Meta Tag Title</CFormLabel>
                    <CFormInput
                      type="text"
                      id="metaTagTitle"
                      name="metaTagTitle"
                      placeholder="Enter meta tag title"
                      defaultValue={product ? product.metaTagTitle : ''}
                      {...register('metaTagTitle', { required: 'Meta tag title is required' })}
                      onKeyUp={() => {
                        trigger('metaTagTitle')
                      }}
                    />
                    {errors.metaTagTitle && (
                      <small className='text-danger'>
                        {errors.metaTagTitle.message}
                      </small>
                    )}
                  </div>
                  <div className="mb-3">
                    <CFormLabel htmlFor="metaTagDescription">Meta Tag Description</CFormLabel>
                    <CFormTextarea
                      rows="3"
                      id="metaTagDescription"
                      name="metaTagDescription"
                      placeholder="Enter meta tag description"
                      defaultValue={product ? product.metaTagDescription : ''}
                      {...register('metaTagDescription')}
                    >
                    </CFormTextarea>
                  </div>
                  <div className="mb-3">
                    <CFormLabel htmlFor="metaTagKeywords">Meta Tag Keywords</CFormLabel>
                    <CFormTextarea
                      rows="3"
                      id="metaTagKeywords"
                      name="metaTagKeywords"
                      placeholder="Enter meta tag keywords"
                      defaultValue={product ? product.metaTagKeywords : ''}
                      {...register('metaTagKeywords')}
                    >
                    </CFormTextarea>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol>
              <CButton type="submit" variant="outline">
                {operation}
              </CButton>
              &nbsp;
              <CButton
                color="danger"
                variant="outline"
                onClick={() => {
                  navigate('/inventory/products')
                }}
              >
                Cancel
              </CButton>
            </CCol>
          </div >
        </CForm >
      </CRow >
    </>
  )
}

export default AddEditProduct
