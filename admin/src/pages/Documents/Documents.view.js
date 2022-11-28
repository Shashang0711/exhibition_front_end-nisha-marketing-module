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
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import Toast from "../../utils/toast";
import {
  getDocuments,
  approveRejectDocuments,
  approveRejectID,
  approveRejectPassbook,
} from "../../services/doc.service";
import Pagination from "../../common/Pagination";
import NoOfRecords from "../../common/NoOfRecords";
import SearchBar from "../../common/SearchBar";
import FilterByStatus from "../../common/FilterByStatus";
import { fileUrl } from "../../constants/constants";
import { sortData } from "../../utils/sorting";

import upsort from "../../assets/images/up-sort.svg";
import downsort from '../../assets/images/down-sort.svg';

const Documents = () => {
  // Setting state for documents and pagination
  const [documents, setDocuments] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [currPage, setCurrPage] = useState(1);
  const [noOfRecords, setNoOfRecords] = useState(10);
  const [searchVal, setSearchVal] = useState("");
  const [filterByStatus, setFilterByStatus] = useState("Pending");

  // State for sorting
  const [arrowClass, setArrowClass] = useState({
    userName: ['', ''],
    email: ['', '']
  });
  const [sorting, setSorting] = useState({
    sortBy: 'userName',
    order: 'ASC'
  });

  useEffect(() => {
    fetchDocuments();
  }, [searchVal, noOfRecords, currPage, filterByStatus, sorting]);

  const fetchDocuments = async () => {
    const getDocumentsResponse = await getDocuments({
      search: searchVal,
      pageRecord: noOfRecords,
      pageNo: currPage,
      status: filterByStatus,
      sortBy: sorting.sortBy,
      order: sorting.order
    });
    if (!getDocumentsResponse) {
      return;
    }
    if (
      getDocumentsResponse.status === 200 ||
      getDocumentsResponse.status === "200"
    ) {
      setDocuments(getDocumentsResponse.data.rows);
      setTotalData(getDocumentsResponse.data.count);
    } else {
      setTotalData(0);
      setDocuments([]);
    }
  };

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

  // const verifyDocuments = async (documentId, operation) => {
  //   const payload = { documentId, operation };
  //   const approveRejectResponse = await approveRejectDocuments(payload);
  //   if (approveRejectResponse.status === 200 || approveRejectResponse.status === '200') {
  //     if (operation === 'Approve') {
  //       Toast('success', 'Documents approved')
  //     } else {
  //       Toast('error', 'Documents rejected')
  //     }
  //   }
  //   await fetchDocuments();
  // }

  const verifyIDProof = async (documentId, operation) => {
    const payload = { documentId, operation };
    const verifyIDRes = await approveRejectID(payload);
    if (!verifyIDRes) {
      return;
    }
    if (verifyIDRes.status === 200 || verifyIDRes.status === "200") {
      if (operation === "Approve") {
        Toast("success", "ID proof approved");
      } else {
        Toast("error", "ID proof is rejected");
      }
    }
    await fetchDocuments();
  };

  const verifyPassbook = async (documentId, operation) => {
    const payload = { documentId, operation };
    const verifyPassbookRes = await approveRejectPassbook(payload);
    if (!verifyPassbookRes) {
      return;
    }
    if (
      verifyPassbookRes.status === 200 ||
      verifyPassbookRes.status === "200"
    ) {
      if (operation === "Approve") {
        Toast("success", "Passbook approved");
      } else {
        Toast("error", "Passbook is rejected");
      }
    }
    await fetchDocuments();
  };

  const getStatusLabel = (document) => {
    if (document.isVerified === "Verified") {
      return <label className="badge badge-gradient-success">Verified</label>;
    } else if (document.isVerified === "Rejected") {
      return <label className="badge badge-gradient-danger">Rejected</label>;
    } else {
      if (
        document.isIDVerified === "Pending" &&
        document.isPassbookVerified === "Pending"
      ) {
        return <label className="badge badge-gradient-warning">Pending</label>;
      } else {
        return (
          <label className="badge badge-gradient-warning">
            Partially Verified
          </label>
        );
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-home"></i>
          </span>{" "}
          Document Verification
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
                <FilterByStatus setFilterByStatus={setFilterByStatus} />
              </div>
              {documents.length <= 0 ? (
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
                      <CTableHeaderCell onClick={(e) => sortData(e, 'idProofType', setSorting, setArrowClass)}>
                        <div className="sorting-th">
                          ID Proof Type
                          <span className="sorting">
                            <img src={upsort} alt="sort" className={arrowClass.idProofType ? `${arrowClass.idProofType[0]}` : ''} />
                            <img src={downsort} alt="sort" className={arrowClass.idProofType ? `${arrowClass.idProofType[1]}` : ''} />
                          </span>
                        </div>
                      </CTableHeaderCell>
                      <CTableHeaderCell>ID Proof</CTableHeaderCell>
                      <CTableHeaderCell>Passbook</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell className="text-right">
                        Action
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {documents.map((document, index) => {
                      let idViewStyle;
                      let passbookViewStyle;
                      if (document.isIDVerified === "Verified") {
                        idViewStyle = { color: "green" };
                      } else if (document.isIDVerified === "Rejected") {
                        idViewStyle = { color: "red" };
                      } else {
                        idViewStyle = { color: "blue" };
                      }
                      if (document.isPassbookVerified === "Verified") {
                        passbookViewStyle = { color: "green" };
                      } else if (document.isPassbookVerified === "Rejected") {
                        passbookViewStyle = { color: "red" };
                      } else {
                        passbookViewStyle = { color: "blue" };
                      }

                      return (
                        <CTableRow key={index}>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell>
                            {document.user.userName}
                          </CTableDataCell>
                          <CTableDataCell>{document.user.email}</CTableDataCell>
                          <CTableDataCell>
                            {document.idProofType}
                          </CTableDataCell>
                          <CTableDataCell>
                            <a
                              style={idViewStyle}
                              href={`${fileUrl}/${document.idProof}`}
                              target="_blank"
                            >
                              {"View"}
                            </a>
                          </CTableDataCell>
                          <CTableDataCell>
                            <a
                              style={passbookViewStyle}
                              href={`${fileUrl}/${document.passbook}`}
                              target="_blank"
                            >
                              {"View"}
                            </a>
                          </CTableDataCell>
                          <CTableDataCell>
                            {
                              // document.isVerified === 'Verified' ?
                              //   <label className="badge badge-gradient-success">Verified</label>
                              // :
                              //   document.isVerified === 'Rejected' ?
                              //     <label className="badge badge-gradient-danger">Rejected</label>
                              //   :
                              //     <label className="badge badge-gradient-warning">Pending</label>
                              getStatusLabel(document)
                            }
                          </CTableDataCell>
                          <CTableDataCell className="text-right">
                            {document.isIDVerified === "Pending" || document.isPassbookVerified === "Pending" ? (
                              <>
                                {/* <button type="button" className="btn btn-gradient-success btn-rounded btn-icon" onClick={() => {verifyDocuments(document.documentId, 'Approve')}}>
                                          <i className="mdi mdi-check"></i>
                                        </button>
                                        <button type="button" className="btn btn-gradient-danger btn-rounded btn-icon" onClick={() => {verifyDocuments(document.documentId, 'Reject')}}>
                                          <i className="mdi mdi-close"></i>
                                        </button> */}
                                <CDropdown alignment="start">
                                  <CDropdownToggle
                                    color="transparent"
                                    caret={false}
                                    className="p-0"
                                  >
                                    <i className="mdi mdi-dots-vertical"></i>
                                  </CDropdownToggle>
                                  <CDropdownMenu>
                                    {/* <CDropdownItem onClick={() => {verifyDocuments(document.documentId, 'Approve')}}>Approve</CDropdownItem>
                                            <CDropdownItem onClick={() => {verifyDocuments(document.documentId, 'Reject')}}>Reject</CDropdownItem> */}
                                    {document.isIDVerified === "Pending" ? (
                                      <>
                                        <CDropdownItem
                                          onClick={() => {
                                            verifyIDProof(
                                              document.documentId,
                                              "Approve"
                                            );
                                          }}
                                        >
                                          Approve ID Proof
                                        </CDropdownItem>
                                        <CDropdownItem
                                          onClick={() => {
                                            verifyIDProof(
                                              document.documentId,
                                              "Reject"
                                            );
                                          }}
                                        >
                                          Reject ID Proof
                                        </CDropdownItem>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                    {document.isPassbookVerified ===
                                      "Pending" ? (
                                      <>
                                        <CDropdownItem
                                          onClick={() => {
                                            verifyPassbook(
                                              document.documentId,
                                              "Approve"
                                            );
                                          }}
                                        >
                                          Approve Passbook
                                        </CDropdownItem>
                                        <CDropdownItem
                                          onClick={() => {
                                            verifyPassbook(
                                              document.documentId,
                                              "Reject"
                                            );
                                          }}
                                        >
                                          Reject Passbook
                                        </CDropdownItem>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </CDropdownMenu>
                                </CDropdown>
                              </>
                            ) : (
                              <>No Actions</>
                            )}
                          </CTableDataCell>
                        </CTableRow>
                      );
                    })}
                  </CTableBody>
                  {/* <ConfirmationModal confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} /> */}
                </CTable>
              )}
            </div>
            <div className="card-body border-top">
              <CCol sm={6} md={3} className="text-end">
                {paginationFunction()}
              </CCol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
