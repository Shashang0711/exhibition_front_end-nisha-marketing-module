import React, { useState, useEffect } from "react";
import {
  CRow,
  CCol,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import Toast from "../../utils/toast";
import {
  getPaymentMethods,
  deletePaymentMethodFromService,
} from "../../services/paymentMethod.service";
import ConfirmationModal from "../../components/modal/ConfirmationModal";
import PaymentMethodAddEditModal from "./components/PaymentMethodAddEditModal";
import Pagination from "../../common/Pagination";
import NoOfRecords from "../../common/NoOfRecords";
import SearchBar from "../../common/SearchBar";
import { sortData } from "../../utils/sorting";
import "./PaymentMethods.css";

import upsort from "../../assets/images/up-sort.svg";
import downsort from '../../assets/images/down-sort.svg';

const PaymentMethods = () => {
  // Setting state for categories and pagination
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [currPage, setCurrPage] = useState(1);
  const [noOfRecords, setNoOfRecords] = useState(10);
  const [searchVal, setSearchVal] = useState("");

  // State for sorting
  const [arrowClass, setArrowClass] = useState({
    method: ['', '']
  });
  const [sorting, setSorting] = useState({
    sortBy: 'method',
    order: 'ASC'
  });

  // Setting state for delete modal
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  // Fetch all categories as the component renders
  useEffect(() => {
    fetchPaymentMethods();
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

  // Function to fetch categories
  const fetchPaymentMethods = async () => {
    const listPayMethodsResponse = await getPaymentMethods({
      search: searchVal,
      pageRecord: noOfRecords,
      pageNo: currPage,
      sortBy: sorting.sortBy,
      order: sorting.order
    });
    if (!listPayMethodsResponse) {
      return;
    }
    if (listPayMethodsResponse.data.count > 0) {
      setPaymentMethods(listPayMethodsResponse.data.rows);
      setTotalData(listPayMethodsResponse.data.count);
    } else {
      setTotalData(0);
      setPaymentMethods([]);
      Toast("error", listPayMethodsResponse.data.message);
    }
  };

  // Delete Category
  const deletePaymentMethod = async (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    const deletePayMethodResponse = await deletePaymentMethodFromService(id);
    if (!deletePayMethodResponse) {
      return;
    }
    if (
      deletePayMethodResponse.status === 200 ||
      deletePayMethodResponse.status === "200"
    ) {
      Toast("success", "Payment method deleted successfully");
      fetchPaymentMethods();
    } else {
      Toast("error", deletePayMethodResponse.data.message);
    }
  };

  return (
    <div>
      <div className="page-header d-flex justify-content-between flex-wrap">
        <h3 className="page-title mb-2">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-home"></i>
          </span>{" "}
          Payment Methods
        </h3>
        <PaymentMethodAddEditModal
          className="mb-2"
          operation="Add"
          buttonText="Add Payment Method"
          fetchPaymentMethods={fetchPaymentMethods}
        />
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
              {paymentMethods.length <= 0 ? (
                <div className="no-data-found">
                  <h3>No Data Found</h3>
                </div>
              ) : (
                <CTable hover className="mt-10">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Sr. No.</CTableHeaderCell>
                      <CTableHeaderCell onClick={(e) => sortData(e, 'method', setSorting, setArrowClass)}>
                        <div className="sorting-th">
                          Payment Method
                          <span className="sorting">
                            <img src={upsort} alt="sort" className={arrowClass.method ? `${arrowClass.method[0]}` : ''} />
                            <img src={downsort} alt="sort" className={arrowClass.method ? `${arrowClass.method[1]}` : ''} />
                          </span>
                        </div>
                      </CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {paymentMethods.map((paymentMethod, index) => {
                      return (
                        <CTableRow key={index}>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell>
                            {paymentMethod.method}
                          </CTableDataCell>
                          <CTableDataCell>
                            <PaymentMethodAddEditModal
                              operation="Edit"
                              buttonText="Edit"
                              paymentMethod={paymentMethod}
                              fetchPaymentMethods={fetchPaymentMethods}
                            />
                            &nbsp; &nbsp;
                            <button
                              type="button"
                              className="btn btn-xs btn-gradient-danger btn-icon-text"
                              onClick={() =>
                                setConfirmDialog({
                                  isOpen: true,
                                  title: `Delete ${paymentMethod.method} ?`,
                                  subTitle: "You can't undo this operation!",
                                  onConfirm: () => {
                                    deletePaymentMethod(
                                      paymentMethod.paymentMethodId
                                    );
                                  },
                                })
                              }
                            >
                              <i className="mdi mdi-delete-outline text-danger"></i>
                            </button>
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

export default PaymentMethods;
