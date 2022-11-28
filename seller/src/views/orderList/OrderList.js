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
import { prodService } from 'src/services/products'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import upsort from "../../assets/images/up-sort.svg";
import downsort from '../../assets/images/down-sort.svg';
import { sortData } from 'src/utils/sorting'
import { orderService } from 'src/services/order'
import ViewOrderList from './components/ViewOrderList'
import LoadingSpinner from 'src/common/loadingSpinner/LoadingSpinner'
const OrderList = () => {
    const [isLoading, setIsLoading] = useState(false);

    // State for products list
    const [ordes, setOrder] = useState([]);

    // States for pagination
    const [totalData, setTotalData] = useState(0)
    const [currPage, setCurrPage] = useState(1)
    const [noOfRecords, setNoOfRecords] = useState(10)
    const [searchVal, setSearchVal] = useState('')


    // State for sorting
    const [arrowClass, setArrowClass] = useState({
        amount: ['', ''],
        status: ['', ''],
    });
    const [sorting, setSorting] = useState({
        sortBy: 'createdAt',
        order: 'DESC'
    });

    // Fetch ordes
    const fetchOrders = async () => {
        setIsLoading(true);
        const getOrderResponse = await orderService.getOrders({
            search: searchVal,
            pageRecord: noOfRecords,
            pageNo: currPage,
            sortBy: sorting.sortBy,
            order: sorting.order,
        });
        if (!getOrderResponse) {
            return;
        }
        if (getOrderResponse.data.count > 0) {
            setOrder(getOrderResponse.data.rows);
            setTotalData(getOrderResponse.data.count);
            setIsLoading(false);
        } else {
            setTotalData(0);
            setOrder([]);
        }
    }

    useEffect(() => {
        fetchOrders();
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
                        {/* {isLoading ? <LoadingSpinner /> : fetchOrders()} */}
                        <CCard className="mb-4 overflow-auto ">
                            <CCardHeader>
                                <strong>Order List</strong>

                            </CCardHeader>
                            <CCardBody>
                                <div className='table-header'>
                                    <NoOfRecords setNoOfRecords={setNoOfRecords} />
                                    <SearchBar searchVal={searchVal} setSearchVal={setSearchVal} />
                                </div>
                                {ordes.length <= 0 ?
                                    <h4 className='no-data-found'>No data Found</h4>
                                    : <></>}
                                {ordes.length > 0 ?
                                    <CTable hover>
                                        <CTableHead>
                                            <CTableRow>
                                                <CTableHeaderCell>#</CTableHeaderCell>
                                                <CTableHeaderCell>
                                                    Order ID
                                                </CTableHeaderCell>
                                                <CTableHeaderCell>
                                                    Payment ID
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
                                                <CTableHeaderCell onClick={(e) => sortData(e, 'status', setSorting, setArrowClass)}>
                                                    <div className="sorting-th">
                                                        Status
                                                        <span className="sorting">
                                                            <img src={upsort} alt="sort" className={arrowClass.status ? `${arrowClass.status[0]}` : ''} />
                                                            <img src={downsort} alt="sort" className={arrowClass.status ? `${arrowClass.status[1]}` : ''} />
                                                        </span>
                                                    </div>
                                                </CTableHeaderCell>
                                                <CTableHeaderCell>View Order Item</CTableHeaderCell>

                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {
                                                ordes.map((ele, index) => {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <CTableRow>
                                                                <CTableDataCell>{index + 1}</CTableDataCell>
                                                                <CTableDataCell>{ele.generatedOrderId}</CTableDataCell>
                                                                <CTableDataCell>{ele.paymentId}</CTableDataCell>
                                                                <CTableDataCell>{ele.amount}</CTableDataCell>
                                                                <CTableDataCell>{ele && ele?.orderCartItems[index] ? ele?.orderCartItems[index]?.status : "NA"}</CTableDataCell>
                                                                <CTableDataCell>
                                                                    <ViewOrderList orderList={ele} />
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
            <ToastContainer />
        </>
    )
}

export default OrderList
