import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CImage,
  CAvatar
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import SearchBar from '../../common/SearchBar'
import NoOfRecords from '../../common/NoOfRecords'
import Pagination from '../../common/Pagination'
import { prodService } from 'src/services/products'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ComfirmationModal from 'src/common/modal/ConfirmationModal'
import { imageUrl } from 'src/constants/constants'
import upsort from "../../assets/images/up-sort.svg";
import downsort from '../../assets/images/down-sort.svg';
import { sortData } from 'src/utils/sorting'
import LoadingSpinner from 'src/common/loadingSpinner/LoadingSpinner'
const Products = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);

  // State for products list
  const [products, setProducts] = useState([]);

  // States for pagination
  const [totalData, setTotalData] = useState(0)
  const [currPage, setCurrPage] = useState(1)
  const [noOfRecords, setNoOfRecords] = useState(10)
  const [searchVal, setSearchVal] = useState('')

  // State for delete modal
  const [confirmDialog, setConfirmDialog] = useState({
    visible: false,
    title: '',
    subTitle: ''
  });

  // State for sorting
  const [arrowClass, setArrowClass] = useState({
    productName: ['', ''],
  });
  const [sorting, setSorting] = useState({
    sortBy: 'productName',
    order: 'ASC'
  });

  // Fetch products
  const fetchProducts = async () => {
    setIsLoading(true);
    const getProductsResponse = await prodService.getProducts({
      search: searchVal,
      pageRecord: noOfRecords,
      pageNo: currPage,
      sortBy: sorting.sortBy,
      order: sorting.order,
    });
    if (!getProductsResponse) {
      return;
    }
    if (getProductsResponse.data.count > 0) {
      setProducts(getProductsResponse.data.rows);
      setTotalData(getProductsResponse.data.count);
      setIsLoading(false);
    } else {
      setTotalData(0);
      setProducts([]);
    }

  }

  useEffect(() => {
    fetchProducts();
  }, [currPage, noOfRecords, searchVal, sorting]);

  const paginationFunction = () => {
    return (
      <React.Fragment>
        {totalData > 0 ? (
          <Pagination currPage={currPage} totalData={totalData} setPageNumber={setCurrPage} noOfRecords={noOfRecords} />
        ) : ''}
      </React.Fragment>
    );
  }

  // Delete Function
  const removeProduct = async (id) => {
    setConfirmDialog({
      ...confirmDialog,
      visible: false
    });
    const deleteProductResponse = await prodService.deleteProduct(id);
    if (!deleteProductResponse) {
      return;
    }
    if (deleteProductResponse.status === 200 || deleteProductResponse.status === '200') {
      toast.success('Product deleted successfully');
      fetchProducts();
    } else {
      toast.error(deleteProductResponse.data.message);
    }

  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <div className='app-table'>
            {/* {isLoading ? <LoadingSpinner /> : fetchProducts()} */}
            <CCard className="mb-4 overflow-auto ">
              <CCardHeader>
                <strong>Products</strong>
                <CButton
                  title="Edit"
                  color="primary"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/inventory/products/productdetails', { state: { operation: 'Add' } })}
                >
                  Add Product
                </CButton>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol sm={1} className="text-start">
                    <NoOfRecords setNoOfRecords={setNoOfRecords} />
                  </CCol>
                  <CCol sm={5} className="text-start">
                    <SearchBar searchVal={searchVal} setSearchVal={setSearchVal} />
                  </CCol>
                </CRow>
                {products.length <= 0 ?
                  <h4 className='no-data-found'>No data Found</h4>
                  : <></>}
                {products.length > 0 ?
                  <CTable hover>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>#</CTableHeaderCell>
                        <CTableHeaderCell onClick={(e) => sortData(e, 'productName', setSorting, setArrowClass)}>
                          <div className="sorting-th">
                            Product Name
                            <span className="sorting">
                              <img src={upsort} alt="sort" className={arrowClass.productName ? `${arrowClass.productName[0]}` : ''} />
                              <img src={downsort} alt="sort" className={arrowClass.productName ? `${arrowClass.productName[1]}` : ''} />
                            </span>
                          </div>

                        </CTableHeaderCell>
                        <CTableHeaderCell>Product Image</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {
                        products.map((product, index) => {
                          return (
                            <CTableRow key={product.productId}>
                              <CTableDataCell>{index + 1}</CTableDataCell>
                              <CTableDataCell>{product.productName}</CTableDataCell>
                              <CTableDataCell>
                                {/* <CImage src={imageUrl + product.productImages[0].imagePath} height='50px' /> */}
                                <CAvatar size='md' src={imageUrl + product.productImages[0].imagePath} />
                              </CTableDataCell>
                              <CTableDataCell>
                                <CButton
                                  title="Edit"
                                  color="warning"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate('/inventory/products/productdetails', { state: { operation: 'Edit', buttonText: 'Save', product } })}
                                >
                                  <CIcon icon={cilPencil} />
                                </CButton>
                                &nbsp;
                                <CButton
                                  title="Delete"
                                  color="danger"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setConfirmDialog({
                                    visible: true,
                                    title: `Delete ${product.productName} product?`,
                                    subTitle: "You can't undo this operation!",
                                    onConfirm: () => { removeProduct(product.productId) }
                                  })}
                                >
                                  <CIcon icon={cilTrash} />
                                </CButton>
                              </CTableDataCell>
                            </CTableRow>
                          )
                        })
                      }
                      <ComfirmationModal confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
                    </CTableBody>
                  </CTable>
                  : <></>}

                <CCol sm={12} className="text-end">
                  {paginationFunction()}
                </CCol>
              </CCardBody>
            </CCard>
          </div>
        </CCol>
      </CRow>
    </>
  )
}

export default Products
