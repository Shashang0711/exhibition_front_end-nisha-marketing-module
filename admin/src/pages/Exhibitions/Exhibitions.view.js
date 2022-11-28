import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { CRow, CCol } from "@coreui/react";
import Toast from "../../utils/toast";
import {
  getExhibitions,
  getSellerExhibitions,
  deleteExhibitionFromService,
} from "../../services/exhibition.service";
import ConfirmationModal from "../../components/modal/ConfirmationModal";
import ExhibitionAddEditModal from "./components/ExhibitionAddEditModal";
import Pagination from "../../common/Pagination";
import NoOfRecords from "../../common/NoOfRecords";
import SearchBar from "../../common/SearchBar";

const Exhibitions = () => {
  const history = useHistory();

  // Setting states for exhibitions and pagination
  const [exhibitions, setExhibitions] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [currPage, setCurrPage] = useState(1);
  const [noOfRecords, setNoOfRecords] = useState(10);
  const [searchVal, setSearchVal] = useState("");

  // Setting state for delete modal
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  // Fetch all exhibitions for the first time and everytime after the pagination states are changed
  useEffect(() => {
    fetchExhibitions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currPage, noOfRecords, searchVal]);

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

  // Fetching all exhibitions
  const fetchExhibitions = async () => {
    const listExhibitionsResponse = await getExhibitions({
      search: searchVal,
      pageRecord: noOfRecords,
      pageNo: currPage,
    });
    if (!listExhibitionsResponse) {
      return;
    }
    if (listExhibitionsResponse.data.count > 0) {
      setExhibitions(listExhibitionsResponse.data.rows);
      setTotalData(listExhibitionsResponse.data.count);
      console.log("listExhibitionsResponse.data.rows", listExhibitionsResponse.data.rows)
    } else {
      setTotalData(0);
      setExhibitions([]);
      Toast("error", listExhibitionsResponse.data.messsage);
    }
  };

  // Delete exhibition
  const deleteExhibition = async (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    const deleteExhibitionResponse = await deleteExhibitionFromService(id);
    if (!deleteExhibitionResponse) {
      return;
    }
    if (
      deleteExhibitionResponse.status === 200 ||
      deleteExhibitionResponse.status === "200"
    ) {
      Toast("success", "Exhibition deleted successfully");
      fetchExhibitions();
    } else {
      Toast("error", deleteExhibitionResponse.data.message);
    }
  };

  return (
    <>
      <div>
        <div className="page-header">
          <h3 className="page-title">
            <span className="page-title-icon bg-gradient-primary text-white mr-2">
              <i className="mdi mdi-home"></i>
            </span>{" "}
            Exhibitions
          </h3>
          {/* <ExhibitionAddEditModal
            operation="Add"
            buttonText="Add Exhibition"
            fetchExhibitions={fetchExhibitions}
          /> */}
        </div>
        <div className="d-flex">
          <NoOfRecords setNoOfRecords={setNoOfRecords} />
          <SearchBar
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
        </div>
        {exhibitions.length === 0 ? (
          <div className="no-data-found">
            <h3>No Exhibition Added</h3>
          </div>
        ) : null}
        <div className="row mt-4">
          {exhibitions.map((exhibition, index) => {
            return (
              <div
                className="col-md-6 col-lg-6 col-xl-3 grid-margin stretch-card"
                key={exhibition.exhibitionId}
              >
                <div className="card">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between">
                      <h4 className="card-title">
                        {exhibition.exhibitionName}
                      </h4>
                      <div className="d-flex justify-content-end">
                        <ExhibitionAddEditModal
                          operation="Edit"
                          buttonText="Edit"
                          exhibition={exhibition}
                          fetchExhibitions={fetchExhibitions}
                        />
                        <button
                          type="button"
                          className="btn btn-xs btn-gradient-danger btn-icon-text"
                          onClick={() =>
                            setConfirmDialog({
                              isOpen: true,
                              title: `Delete ${exhibition.exhibitionName} exhibition?`,
                              subTitle: "You can't undo this operation!",
                              onConfirm: () => {
                                deleteExhibition(exhibition.exhibitionId);
                              },
                            })
                          }
                        >
                          <i className="mdi mdi-delete-outline text-danger"></i>
                        </button>
                      </div>
                    </div>
                    <h6 className="card-subtitle text-muted">
                      {exhibition.user.userName}
                    </h6>
                    <div className="d-flex card-text justify-content-between">
                      <p className="text-muted mb-0">Start Date</p>
                      <span className="text-muted">
                        {new Date(
                          exhibition.exhibitionStartDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="d-flex card-text justify-content-between">
                      <p className="text-muted mb-0">End Date</p>
                      <span className="text-muted">
                        {new Date(
                          exhibition.exhibitionEndDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="d-flex mt-2 card-text justify-content-between">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() =>
                          history.push(
                            `/exhibitionproducts/${exhibition.userId}/${exhibition.exhibitionId}`
                          )
                        }
                      >
                        Products
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-rounded btn-icon"
                        onClick={() => {
                          navigator.clipboard.writeText(exhibition.shareLink);
                          alert("Exhibition link copied");
                        }}
                      >
                        <i className="mdi mdi-link-variant text-info"></i>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
          <div className="card-body border-top">
            {paginationFunction()}
          </div>
          <ConfirmationModal
            confirmDialog={confirmDialog}
            setConfirmDialog={setConfirmDialog}
          />
        </div>
      </div>
    </>
  );
};

export default Exhibitions;
