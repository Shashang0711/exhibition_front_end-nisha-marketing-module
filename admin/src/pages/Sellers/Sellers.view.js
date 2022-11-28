import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  CRow,
  CCol,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
} from "@coreui/react";
import { Dropdown } from "react-bootstrap";
import { getSellers } from "../../services/user.service";
import { sellerLogInByAdmin } from "../../services/auth.service";
import Toast from "../../utils/toast";
import ConfirmationModal from "../../components/modal/ConfirmationModal";
import Pagination from "../../common/Pagination";
import NoOfRecords from "../../common/NoOfRecords";
import SearchBar from "../../common/SearchBar";
import { getToken } from "../../utils/token";
import { sortData } from "../../utils/sorting";
import "./Sellers.css";

import upsort from "../../assets/images/up-sort.svg";
import downsort from '../../assets/images/down-sort.svg';

const Sellers = () => {
  const history = useHistory();
  const adminToken = getToken();

  // Setting state for sellers and pagination
  const [sellers, setSellers] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [currPage, setCurrPage] = useState(1);
  const [noOfRecords, setNoOfRecords] = useState(10);
  const [searchVal, setSearchVal] = useState("");

  // State for sorting
  const [arrowClass, setArrowClass] = useState({
    userName: ['', ''],
    email: ['', '']
  });
  const [sorting, setSorting] = useState({
    sortBy: 'userName',
    order: 'ASC'
  });

  // Setting state for delete modal
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  // Fetch all sellers as the component renders
  useEffect(() => {
    fetchSellers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchVal, noOfRecords, currPage, sorting]);

  // Function for pagination
  const paginationFunction = () => {
    return (
      <React.Fragment>
        {totalData > 0 ? (
          <Pagination
            currPage={currPage}
            totalData={totalData}
            setPageNumber={setCurrPage}
            noOfRecords={noOfRecords}
          />
        ) : (
          ""
        )}
      </React.Fragment>
    );
  };

  // Function to fetch sellers
  const fetchSellers = async () => {
    const listSellersResponse = await getSellers({
      search: searchVal,
      pageRecord: noOfRecords,
      pageNo: currPage,
      sortBy: sorting.sortBy,
      order: sorting.order
    });
    if (!listSellersResponse) {
      return;
    }
    if (listSellersResponse.data.count > 0) {
      setSellers(listSellersResponse.data.rows);
      setTotalData(listSellersResponse.data.count);
    } else {
      setTotalData(0);
      setSellers([]);
      Toast("error", listSellersResponse.data.message);
    }
  };

  const loginByAdmin = async (sellerId) => {
    const sellerLogInRes = await sellerLogInByAdmin(sellerId);
    if (!sellerLogInRes) {
      Toast("error", "Something went wrong, trry again");
      return;
    }
    const { loginUrl } = sellerLogInRes.data;
    window.open(loginUrl, "_blank");
  };

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-home"></i>
          </span>{" "}
          Sellers
        </h3>
      </div>
      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body scrollableCard">
              <div className="d-flex">
                <NoOfRecords setNoOfRecords={setNoOfRecords} />
                <SearchBar
                  searchVal={searchVal}
                  setSearchVal={setSearchVal}
                />
              </div>
              {sellers.length <= 0 ? (
                <div className="no-data-found">
                  <h3>No Data Found</h3>
                </div>
              ) : (
                <CTable hover className="mt-10">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Sr. No.</CTableHeaderCell>
                      <CTableHeaderCell onClick={(e) => sortData(e, 'userName', setSorting, setArrowClass)}>
                        <div className="sorting-th">
                          Seller Name
                          <span className="sorting">
                            <img src={upsort} alt="sort" className={arrowClass.userName ? `${arrowClass.userName[0]}` : ''} />
                            <img src={downsort} alt="sort" className={arrowClass.userName ? `${arrowClass.userName[1]}` : ''} />
                          </span>
                        </div>
                      </CTableHeaderCell>
                      <CTableHeaderCell onClick={(e) => sortData(e, 'email', setSorting, setArrowClass)}>
                        <div className="sorting-th">
                          Email
                          <span className="sorting">
                            <img src={upsort} alt="sort" className={arrowClass.email ? `${arrowClass.email[0]}` : ''} />
                            <img src={downsort} alt="sort" className={arrowClass.email ? `${arrowClass.email[1]}` : ''} />
                          </span>
                        </div>
                      </CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {sellers.map((seller, index) => {
                      return (
                        <CTableRow key={index}>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell>{seller.userName}</CTableDataCell>
                          <CTableDataCell>{seller.email}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              className="btn btn-sm"
                              // onClick={() => {
                              //     localStorage.setItem('sellerId', seller.userId);
                              //     history.push({
                              //         pathname: '/dashboard',
                              //         state: { seller: seller }
                              //     });
                              // }}
                              onClick={() => {
                                // localStorage.setItem('sellerId', seller.userId);
                                // window.open(`http://192.168.1.16:3000/seller-login/${adminToken}/${seller.userId}`, '_blank');
                                // Modify the above url with the url returned by API
                                // 1. give a function for onclick
                                // 2. call API there
                                // 3. redirect to link returned by API
                                loginByAdmin(seller.userId);
                              }}
                            >
                              <i className="mdi mdi-login"></i>
                            </CButton>
                            <CButton
                              className="btn btn-sm"
                              onClick={() => {
                                history.push(`/sellerDetails/${seller.userId}`)
                              }}
                            >
                              <i className="mdi mdi-information-outline"></i>
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      );
                    })}
                  </CTableBody>
                  <ConfirmationModal
                    confirmDialog={confirmDialog}
                    setConfirmDialog={setConfirmDialog}
                  />
                </CTable>
              )}
            </div>
            <div className="card-body border-top">
              {paginationFunction()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sellers;
