import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import ExhibitionProductsAddEditModal from './components/ExhibitionProductsAddEditModal'
import SearchBar from '../../common/SearchBar'
import NoOfRecords from '../../common/NoOfRecords'
import Pagination from '../../common/Pagination'
import { exhProdService } from 'src/services/exhibitionProduct'
import { exhService } from 'src/services/exhibitions'
import ConfirmationModal from '../../common/modal/ConfirmationModal'
import { toast, ToastContainer } from 'react-toastify'
import ComfirmationModal from '../../common/modal/ConfirmationModal'
import upsort from "../../assets/images/up-sort.svg";
import downsort from '../../assets/images/down-sort.svg';
import { sortData } from 'src/utils/sorting'

const ExhibitionProducts = () => {

  const navigate = useNavigate()

  // State for products list
  const [exhibitionProduct, setExhibitionProduct] = useState([]);
  const [listExhibition, setListExhibition] = useState(null)
  const { exId } = useParams();
  // States for pagination
  const [totalData, setTotalData] = useState(0)
  const [currPage, setCurrPage] = useState(1)
  const [noOfRecords, setNoOfRecords] = useState(10)
  const [searchVal, setSearchVal] = useState('')


  // State for sorting
  const [arrowClass, setArrowClass] = useState({
    productName: ['', ''],
  });
  const [sorting, setSorting] = useState({
    sortBy: 'productName',
    order: 'ASC'
  });


  // State for delete modal
  const [confirmDialog, setConfirmDialog] = useState({
    visible: false,
    title: '',
    subTitle: ''
  });

  // Fetch products
  const fetchExhibitionProduct = async () => {
    const getProductsResponse = await exhProdService.getExhibitonProduct({
      search: searchVal,
      pageRecord: noOfRecords,
      pageNo: currPage,
      sortBy: sorting.sortBy,
      order: sorting.order,
      exhibitionId: exId
    });
    if (!getProductsResponse) {
      return;
    }
    if (getProductsResponse.data.count > 0) {
      setExhibitionProduct(getProductsResponse.data.rows);
      setTotalData(getProductsResponse.data.count);
    } else {
      setTotalData(0);
      setExhibitionProduct([]);
    }
  }

  useEffect(() => {
    fetchExhibitionProduct();
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
  const deleteExhibitionProduct = async (id) => {
    try {
      setConfirmDialog({
        ...confirmDialog,
        visible: false
      });
      const deleteExhibitionProductRes = await exhProdService.deleteExhibitionProduct(id);
      if (!deleteExhibitionProductRes) {
        return;
      }
      if (deleteExhibitionProductRes.status === 200 || deleteExhibitionProductRes.status === '200') {
        toast.success(deleteExhibitionProductRes.data);
        fetchExhibitionProduct();
      } else {
        toast.error(deleteExhibitionProductRes.data.message);
      }
    } catch (error) {
      s
      toast.error('error', error.message);
    }
  }


  useEffect(() => {
    fetchExhibitionName()
  }, [])

  const fetchExhibitionName = async () => {
    const getExhibitionRes = await exhService.getExhibiton(exId)
    if (!getExhibitionRes) {
      return;
    }
    if (getExhibitionRes.status === 200) {
      setListExhibition(getExhibitionRes.data.exhibitionName)
    }

  }

  return (
    <>
      <CRow>
        <div className='app-table'>
          <CCol xs={12}>
            <CCard className="mb-4 overflow-auto">
              <CCardHeader>
                <strong>{listExhibition}</strong>
                <div>
                  <CButton color="secondary"
                    // variant="outline"
                    size="sm"
                    onClick={() => {
                      navigate("/inventory/exhibitions")
                    }}>Back</CButton>
                  &nbsp;
                  <ExhibitionProductsAddEditModal buttonText='Add' exhProducts={exhibitionProduct} fetchExhibitionProduct={fetchExhibitionProduct} operation='Add' />
                </div>
              </CCardHeader>
              <CCardBody>
                <div className='table-header'>
                  <NoOfRecords setNoOfRecords={setNoOfRecords} />
                  <SearchBar searchVal={searchVal} setSearchVal={setSearchVal} />
                </div>
                {exhibitionProduct.length <= 0 ?
                  <h4 className='no-data-found'>No Data Found</h4>
                  : <></>}
                {exhibitionProduct.length > 0 ?
                  <CTable hover className="mt-10">
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
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {
                        exhibitionProduct.map((product, index) => {
                          return (

                            <React.Fragment key={index}>
                              <CTableRow>
                                <CTableDataCell>{index + 1}</CTableDataCell>
                                <CTableDataCell>{product.product.productName}</CTableDataCell>
                                {/* <CTableDataCell>20</CTableDataCell> */}
                                <CTableDataCell>
                                  <ExhibitionProductsAddEditModal operation='Edit' buttonText='Edit' exhProduct={product} fetchExhibitionProduct={fetchExhibitionProduct} />
                                  &nbsp;
                                  <CButton title="Delete" color="danger" variant="outline" size="sm"
                                    onClick={() =>
                                      setConfirmDialog({
                                        visible: true,
                                        title: `Delete ${product.product.productName}?`,
                                        subTitle: "You can't undo this operation!",
                                        onConfirm: () => { deleteExhibitionProduct(product.exhibitionProductId) }
                                      })}
                                  >
                                    <CIcon icon={cilTrash} />
                                  </CButton>
                                </CTableDataCell>
                              </CTableRow>
                            </React.Fragment>
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
          </CCol>
        </div>
      </CRow>
      <ToastContainer />
    </>
  )
}

export default ExhibitionProducts
