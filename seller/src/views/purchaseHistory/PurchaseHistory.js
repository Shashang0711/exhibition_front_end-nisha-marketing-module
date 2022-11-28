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
} from '@coreui/react'
import SearchBar from '../../common/SearchBar'
import NoOfRecords from '../../common/NoOfRecords'
import Pagination from '../../common/Pagination'
import 'react-toastify/dist/ReactToastify.css';
import ComfirmationModal from 'src/common/modal/ConfirmationModal'
import { imageUrl } from 'src/constants/constants'
import upsort from "../../assets/images/up-sort.svg";
import downsort from '../../assets/images/down-sort.svg';
import { sortData } from 'src/utils/sorting'
import { paymentService } from 'src/services/payment'
import { useSelector } from 'react-redux'
import LoadingSpinner from 'src/common/loadingSpinner/LoadingSpinner'
const PurchaseHistory = () => {
    const [isLoading, setIsLoading] = useState(false);

    // State for PurchaseHistorys list
    const [PurchaseHistorys, setPurchaseHistorys] = useState([]);

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
        amount: ['', ''],
        subscriptionPlan: ['', ''],
        addOns: ['', ''],

    });
    const [sorting, setSorting] = useState({
        sortBy: 'amount',
        order: 'ASC'
    });

    // Fetch PurchaseHistorys
    const fetchPurchaseHistory = async () => {
        setIsLoading(true);
        const getpurchaseResponse = await paymentService.getSellerPayments({
            search: searchVal,
            pageRecord: noOfRecords,
            pageNo: currPage,
            sortBy: sorting.sortBy,
            order: sorting.order,
        });
        if (!getpurchaseResponse) {
            return;
        }
        if (getpurchaseResponse.data.count > 0) {
            setPurchaseHistorys(getpurchaseResponse.data.rows);
            setTotalData(getpurchaseResponse.data.count);
            setIsLoading(false);

        } else {
            setTotalData(0);
            setPurchaseHistorys([]);
        }

    }

    useEffect(() => {
        fetchPurchaseHistory();
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

    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <div className='app-table'>
                        {/* {isLoading ? <LoadingSpinner /> : fetchPurchaseHistory()} */}
                        <CCard className="mb-4 overflow-auto ">
                            <CCardHeader>
                                <strong>Purchase History</strong>

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
                                {PurchaseHistorys.length <= 0 ?
                                    <h4 className='no-data-found'>No Data Found</h4>
                                    : <></>}
                                {PurchaseHistorys.length > 0 ?
                                    <CTable hover>
                                        <CTableHead>
                                            <CTableRow>
                                                <CTableHeaderCell>#</CTableHeaderCell>
                                                <CTableHeaderCell onClick={(e) => sortData(e, 'subscriptionPlan', setSorting, setArrowClass)}>
                                                    <div className="sorting-th">
                                                        Subscription Plan
                                                        <span className="sorting">
                                                            <img src={upsort} alt="sort" className={arrowClass.subscriptionPlan ? `${arrowClass.subscriptionPlan[0]}` : ''} />
                                                            <img src={downsort} alt="sort" className={arrowClass.subscriptionPlan ? `${arrowClass.subscriptionPlan[1]}` : ''} />
                                                        </span>
                                                    </div>
                                                </CTableHeaderCell>

                                                <CTableHeaderCell onClick={(e) => sortData(e, 'addOns', setSorting, setArrowClass)}>
                                                    <div className="sorting-th">
                                                        Add Ons
                                                        <span className="sorting">
                                                            <img src={upsort} alt="sort" className={arrowClass.addOns ? `${arrowClass.addOns[0]}` : ''} />
                                                            <img src={downsort} alt="sort" className={arrowClass.addOns ? `${arrowClass.addOns[1]}` : ''} />
                                                        </span>
                                                    </div>


                                                </CTableHeaderCell>

                                                <CTableHeaderCell onClick={(e) => sortData(e, 'amount', setSorting, setArrowClass)}>
                                                    <div className="sorting-th">
                                                        Amount
                                                        <span className="sorting">
                                                            <img src={upsort} alt="sort" className={arrowClass.amount ? `${arrowClass.amount[0]}` : ''} />
                                                            <img src={downsort} alt="sort" className={arrowClass.amount ? `${arrowClass.amount[1]}` : ''} />
                                                        </span>
                                                    </div>

                                                </CTableHeaderCell>

                                                <CTableHeaderCell>OrderId</CTableHeaderCell>
                                                <CTableHeaderCell>PaymentId</CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {
                                                PurchaseHistorys.map((product, index) => {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <CTableRow key={product.productId}>
                                                                <CTableDataCell>{index + 1}</CTableDataCell>
                                                                <CTableDataCell>
                                                                    {product.subscriptionPlan}
                                                                </CTableDataCell>
                                                                <CTableDataCell>
                                                                    {product && product.addOns ? product.addOns : "NA"}
                                                                </CTableDataCell>
                                                                <CTableDataCell>{product.amount}</CTableDataCell>
                                                                <CTableDataCell>
                                                                    {product.orderId}
                                                                </CTableDataCell>
                                                                <CTableDataCell>
                                                                    {product.paymentId}
                                                                </CTableDataCell>
                                                            </CTableRow>
                                                        </React.Fragment>
                                                    )
                                                })
                                            }

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

export default PurchaseHistory
