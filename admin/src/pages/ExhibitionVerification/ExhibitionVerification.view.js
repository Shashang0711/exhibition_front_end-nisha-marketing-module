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
  getExhibitionsByStatus,
  approveRejectExhibitions,
} from "../../services/exhibition.service";
import Pagination from "../../common/Pagination";
import NoOfRecords from "../../common/NoOfRecords";
import SearchBar from "../../common/SearchBar";
import FilterByStatus from "../../common/FilterByStatus";
import { fileUrl } from "../../constants/constants";

const ExhibitionVerification = () => {
  // Setting state for exhibitions and pagination
  const [exhibitions, setExhibitions] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [currPage, setCurrPage] = useState(1);
  const [noOfRecords, setNoOfRecords] = useState(10);
  const [searchVal, setSearchVal] = useState("");
  const [filterByStatus, setFilterByStatus] = useState("Pending");

  // Fetching exhibitions
  const fetchExhibitions = async () => {
    const getExhibitonsResponse = await getExhibitionsByStatus({
      search: searchVal,
      pageRecord: noOfRecords,
      pageNo: currPage,
      status: filterByStatus,
    });
    if (!getExhibitonsResponse) {
      return;
    }
    if (
      getExhibitonsResponse.status === 200 ||
      getExhibitonsResponse.status === "200"
    ) {
      setExhibitions(getExhibitonsResponse.data.rows);
      setTotalData(getExhibitonsResponse.data.count);
    } else {
      setTotalData(0);
      setExhibitions([]);
    }
  };

  useEffect(() => {
    fetchExhibitions();
  }, [searchVal, noOfRecords, currPage, filterByStatus]);

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

  const verifyExhibition = async (exhibitionId, operation) => {
    const payload = { exhibitionId, operation };
    const approveRejectResponse = await approveRejectExhibitions(payload);
    if (!approveRejectResponse) {
      return;
    }
    if (
      approveRejectResponse.status === 200 ||
      approveRejectResponse.status === "200"
    ) {
      if (operation === "Approve") {
        Toast("success", "Exhibition approved");
      } else {
        Toast("success", "Exhibition rejected");
      }
    } else {
      Toast("error", "Something went wrong, try again");
    }
    await fetchExhibitions();
  };

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-home"></i>
          </span>{" "}
          Exhibition Requests
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
              {exhibitions.length <= 0 ? (
                <div className="no-data-found">
                  <h3>No Exhibition Requests</h3>
                </div>
              ) : (

                <CTable hover className="mt-10">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Sr. No.</CTableHeaderCell>
                      <CTableHeaderCell>Exhibition Name</CTableHeaderCell>
                      <CTableHeaderCell>Username</CTableHeaderCell>
                      <CTableHeaderCell>Start Date</CTableHeaderCell>
                      <CTableHeaderCell>End Date</CTableHeaderCell>
                      <CTableHeaderCell>Subscription Type</CTableHeaderCell>
                      <CTableHeaderCell>Total Products</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {exhibitions.map((exhibition, index) => {
                      return (
                        <React.Fragment key={index}>
                          <CTableRow>
                            <CTableDataCell>{index + 1}</CTableDataCell>
                            <CTableDataCell>
                              {exhibition.exhibitionName}
                            </CTableDataCell>
                            <CTableDataCell>
                              {exhibition.user.userName}
                            </CTableDataCell>
                            <CTableDataCell>
                              {exhibition.exhibitionStartDate.slice(0, 10)}
                            </CTableDataCell>
                            <CTableDataCell>
                              {exhibition.exhibitionEndDate.slice(0, 10)}
                            </CTableDataCell>
                            <CTableDataCell>{"Stall (7 Days)"}</CTableDataCell>
                            <CTableDataCell>{"20"}</CTableDataCell>
                            <CTableDataCell>
                              {exhibition.exhibitionStatus === "approved" ? (
                                <label className="badge badge-gradient-success">
                                  Approved
                                </label>
                              ) : exhibition.exhibitionStatus === "rejected" ? (
                                <label className="badge badge-gradient-danger">
                                  Rejected
                                </label>
                              ) : (
                                <label className="badge badge-gradient-warning">
                                  Pending
                                </label>
                              )}
                            </CTableDataCell>
                            <CTableDataCell>
                              {exhibition.exhibitionStatus ===
                                "under verification" ? (
                                <>
                                  <CDropdown alignment="start">
                                    <CDropdownToggle
                                      color="transparent"
                                      caret={false}
                                      className="p-0"
                                    >
                                      <i className="mdi mdi-dots-vertical"></i>
                                    </CDropdownToggle>
                                    <CDropdownMenu>
                                      <CDropdownItem
                                        href={`/exhibitionDetails/${exhibition.exhibitionId}`}
                                      >
                                        View Details
                                      </CDropdownItem>
                                      <CDropdownItem
                                        onClick={() => {
                                          verifyExhibition(
                                            exhibition.exhibitionId,
                                            "Approve"
                                          );
                                        }}
                                      >
                                        Approve
                                      </CDropdownItem>
                                      <CDropdownItem
                                        onClick={() => {
                                          verifyExhibition(
                                            exhibition.exhibitionId,
                                            "Reject"
                                          );
                                        }}
                                      >
                                        Reject
                                      </CDropdownItem>
                                    </CDropdownMenu>
                                  </CDropdown>
                                </>
                              ) : (
                                <>No Actions</>
                              )}
                            </CTableDataCell>
                          </CTableRow>
                        </React.Fragment>
                      );
                    })}
                  </CTableBody>
                </CTable>

              )}
            </div>
            <div className="card-body">
              <CRow>
                <CCol sm={6} md={3} className="text-end">
                  {paginationFunction()}
                </CCol>
              </CRow>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExhibitionVerification;
