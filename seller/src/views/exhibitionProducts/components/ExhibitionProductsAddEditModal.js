import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector } from "react-redux";
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CForm,
  CModalBody,
  CModalFooter,
  CRow,
  CCol,
  CFormLabel,
  CFormInput,
  CFormSelect
} from '@coreui/react';
import Select from "react-select";
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import ReactQuill from 'react-quill';
import "../../../components/editor/Editor.css";
import 'react-quill/dist/quill.snow.css';
import parser from 'html-react-parser';
import { quillConfig } from '../../../constants/constants';
import { prodService } from 'src/services/products';
import { exhProdService } from 'src/services/exhibitionProduct';
import { toast } from 'react-toastify';
import { getUserFromRedux } from 'src/utils/userFromredux/getUserFromRedux';

const ExhibitionProductsAddEditModal = ({ operation, exhProduct, fetchExhibitionProduct, exhProducts, buttonText }) => {
  // Configuring React-Quill Editor
  const modules = quillConfig.modules;
  const formats = quillConfig.formats;
  const placeholder = quillConfig.placeholder;
  // State for editor
  const [productDesc, setProductDesc] = useState({ editorHtml: '' });
  // Setting state for modal
  const [visible, setVisible] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const userFromRedux = useSelector((state) => state.user);
  const user = getUserFromRedux(userFromRedux);
  const { exId } = useParams();


  // useForm for react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
    setValue
  } = useForm();
  // changeHandler
  const onDescChange = (html) => {
    setProductDesc({ editorHtml: html })
  }

  useEffect(() => {
    if (exhProduct) {
      setProductDesc(exhProduct.productDetail);
    }
  }, [exhProduct]);

  // Make form fields empty if the form is submitted
  useEffect(() => {
    if (operation === 'Add') {
      reset({
        totalQuantity: 0
      });
      setProductDesc({ editorHtml: '' });
    }
  }, [formSubmitted]);

  const addEditExhProductSubmit = async (e) => {
    e.exhibitionId = exId;
    e.productDetail = productDesc.editorHtml;

    try {
      // Setting product description in payload
      e.productDetail = productDesc.editorHtml;

      if (operation === 'Add') {
        const addExhProductResponse = await exhProdService.addExhibitonProduct(e);
        if (!addExhProductResponse) {
          return;
        }
        if (addExhProductResponse.status === 200 || addExhProductResponse.status === 200) {

          toast.success(addExhProductResponse.data);
          setVisible(false);
          setFormSubmitted(true);
          fetchExhibitionProduct();
        } else {
          toast.error('Failed to add product');
        }
      } else {
        const editExhProductResponse = await exhProdService.updateExhibitionProduct(e);
        if (!editExhProductResponse) {
          return;
        }
        if (editExhProductResponse.status === 200 || editExhProductResponse.status === '200') {
          toast.success(editExhProductResponse.data);
          setVisible(false);
          setFormSubmitted(true);
          fetchExhibitionProduct();
        } else {
          toast.error('error', 'Failed to update product');
        }
      }
    } catch (error) {
      toast.error('error', error.message);

    }

  }

  const exhProductBindData = () => {
    reset({
      totalQuantity: 0,
      productId: '',
      exhibitionProductId: ''
    });

    setValue('totalQuantity', exhProduct.totalQuantity);
    setValue('productId', exhProduct.productId);
    setValue('exhibitionProductId', exhProduct.exhibitionProductId);

    setProductDesc({ editorHtml: parser(exhProduct.productDetail) });

    setVisible(!visible);
  }

  // Function to close modal when clicked in background
  const close = () => {
    reset({
      totalQuantity: 0,
      productId: ''
    });
    setProductDesc('');
    setVisible(false);
  }


  /* ********************************* */
  /*  Code For Select Tag Begins Here  */
  /* ********************************* */

  // Setting state for products list
  const [payload, setPayload] = useState({
    userId: user.userId,
    search: ''
  });

  useEffect(() => {
    setPayload({
      userId: user.userId,
      search: ''
    })
  }, []);

  //Function to get all products of specific user
  const productsList = async () => {
    const listProductsResponse = await prodService.getAllProducts(payload);
    if (!listProductsResponse) {
      return;
    }
    if (listProductsResponse.status === 200 || listProductsResponse.status === '200') {
      return listProductsResponse.data;
    }
  }

  const products = [];
  // Function to convert userProducts into key value pair
  const selectProductsList = async () => {
    const productsFromApi = await productsList();
    if (!productsFromApi) {
      return;
    }
    productsFromApi.map((product) => {
      products.push({
        value: product.productId,
        label: product.productName
      })
    })
  }

  useEffect(() => {
    selectProductsList();
  }, [products]);

  // Function to get a product by its Id
  const getProductById = async (id) => {
    const res = await prodService.getProduct(id);
    if (!res) {
      return;
    }
    return res;
  }

  // Function to set new value to productId on change of product and display its detail
  const changeProduct = async (e) => {
    setValue('productId', e.value);
    const getProductResponse = await getProductById(e.value);
    if (!getProductResponse) {
      return;
    }
    if (getProductResponse.status === 200 || getProductResponse.status === '200') {
      setProductDesc({ editorHtml: parser(getProductResponse.data.productDescription) });
    }
  }

  return (
    <>
      {
        operation === 'Edit' ?
          <CButton
            title="Edit"
            color="warning"
            variant="outline"
            size="sm"
            onClick={() => exhProductBindData()}
          >
            <CIcon icon={cilPencil} />
          </CButton>
          :
          <CButton
            title="Add"
            color="primary"
            variant="outline"
            size="sm"
            onClick={() => setVisible(!visible)}
          >
            Select Product
          </CButton>
      }
      {exhProducts && exhProducts.length >= 20 ?
        <CModal alignment='top' visible={visible} onClose={() => setVisible(false)}>
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
        :
        <CModal size="xl" alignment='top' visible={visible} onClose={() => close()}>
          <CModalHeader className=''>
            <CModalTitle>{operation} Product</CModalTitle>
          </CModalHeader>
          <CForm onSubmit={handleSubmit(addEditExhProductSubmit)} >
            <CModalBody>
              <CRow>
                <CCol sm={12}>
                  <CFormLabel htmlFor='productId'>Product Name</CFormLabel>
                  {
                    operation === 'Edit' ? <CFormInput type='hidden' value={exhProduct.exhibitionProductId} {...register('exhibitionProductId')} /> : null
                  }

                  <Select
                    id='productId'
                    name='productId'
                    defaultValue={exhProduct ? { value: Number(exhProduct.productId), label: exhProduct.product.productName } : null}
                    isDisabled={exhProduct ? true : false}
                    options={products}
                    {...register('productId', { required: 'Product is required' })}
                    onKeyUp={() => {
                      trigger('productId');
                    }}
                    onChange={changeProduct}
                  />
                  {errors.productId && (
                    <small className='text-danger'>{errors.productId.message}</small>
                  )}
                </CCol>
                &nbsp;
                <CCol sm={12}>
                  <CFormLabel htmlFor='productDetail'>Product Detail</CFormLabel>
                  <div className='app'>
                    <ReactQuill
                      theme={"snow"}
                      onChange={onDescChange}
                      defaultValue={exhProduct ? parser(`${productDesc.editorHtml}`) : null}
                      value={productDesc.editorHtml || ''}
                      modules={modules}
                      formats={formats}
                      bounds={'.app'}
                      placeholder={placeholder}
                    />
                  </div>
                </CCol>
                &nbsp;
                <CCol sm={12}>
                  <CFormLabel htmlFor='totalQuantity'>Total Quantity</CFormLabel>
                  <CFormInput
                    type='number'
                    id='totalQuantity'
                    name='totalQuantity'
                    defaultValue={exhProduct ? exhProduct.totalQuantity : 0}
                    {...register('totalQuantity', { required: 'Total Quantity of product is required' })}
                    onKeyUp={() => {
                      trigger('totalQuantity')
                    }}
                  />
                  {errors.totalQuantity && (
                    <small className="text-danger">{errors.totalQuantity.message}</small>
                  )}
                </CCol>
                <CFormInput
                  type='hidden'
                  id='exhibitionId'
                  name='exhibitionId'
                  defaultValue={exId}
                  {...register('exhibitionId')}
                />
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CRow>
                <CCol sm={12}>
                  <div className="d-flex justify-content-end">
                    <CButton color="danger" size='sm' variant="outline" onClick={close}>Close</CButton>
                    &nbsp;
                    <CButton color="primary" size='sm' variant="outline" type="submit">{buttonText}</CButton>
                  </div>
                </CCol>
              </CRow>
            </CModalFooter>
          </CForm>
        </CModal>
      }
    </>
  );
}

export default ExhibitionProductsAddEditModal;
