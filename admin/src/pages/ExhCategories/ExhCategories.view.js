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
import { listExhCategories, deleteExhCategory } from "../../services/exhCategory.service";
import ConfirmationModal from "../../components/modal/ConfirmationModal";
import ExhCategoryAddEditModal from "./components/ExhCategoryAddEditModal";
import Pagination from "../../common/Pagination";
import NoOfRecords from "../../common/NoOfRecords";
import SearchBar from "../../common/SearchBar";
import { imageUrl } from "../../constants/constants";
import { sortData } from "../../utils/sorting";

import upsort from "../../assets/images/up-sort.svg";
import downsort from '../../assets/images/down-sort.svg';

const ExhCategories = () => {
  // Setting state for exhibition categories and pagination
  const [exhCategories, setExhCategories] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [currPage, setCurrPage] = useState(1);
  const [noOfRecords, setNoOfRecords] = useState(10);
  const [searchVal, setSearchVal] = useState("");

  // State for sorting
  const [arrowClass, setArrowClass] = useState({
    exhCategoryName: ['', '']
  });
  const [sorting, setSorting] = useState({
    sortBy: 'exhCategoryName',
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
    fetchExhCategories();
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
  const fetchExhCategories = async () => {
    const listExhCatResponse = await listExhCategories({
      search: searchVal,
      pageRecord: noOfRecords,
      pageNo: currPage,
      sortBy: sorting.sortBy,
      order: sorting.order
    });
    if (listExhCatResponse.data.count > 0) {
      setExhCategories(listExhCatResponse.data.rows);
      setTotalData(listExhCatResponse.data.count);
    } else {
      setTotalData(0);
      setExhCategories([]);
    }
  };

  // Delete Category
  const removeExhCategory = async (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    const deleteExhCategoryResponse = await deleteExhCategory(id);
    if (!deleteExhCategoryResponse) {
      return;
    }
    if (
      deleteExhCategoryResponse.status === 200 ||
      deleteExhCategoryResponse.status === "200"
    ) {
      Toast("success", "Exhibition Category deleted");
      fetchExhCategories();
    } else {
      Toast("error", deleteExhCategoryResponse.data.message);
    }
  };

  return (
    <div>
      <div className="page-header d-flex justify-content-between flex-wrap">
        <h3 className="page-title mb-2">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-home"></i>
          </span>{" "}
          Exhibition Categories
        </h3>
        <ExhCategoryAddEditModal
          className="mb-2"
          operation="Add"
          buttonText="Add Category"
          fetchExhCategories={fetchExhCategories}
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
              {exhCategories.length <= 0 ? (
                <div className="no-data-found">
                  <h3>No Data Found</h3>
                </div>
              ) : (
                <CTable hover className="mt-10">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Sr. No.</CTableHeaderCell>
                      <CTableHeaderCell onClick={(e) => sortData(e, 'exhCategoryName', setSorting, setArrowClass)}>
                        <div className="sorting-th">
                          Exhibition Category
                          <span className="sorting">
                            <img src={upsort} alt="sort" className={arrowClass.exhCategoryName ? `${arrowClass.exhCategoryName[0]}` : ''} />
                            <img src={downsort} alt="sort" className={arrowClass.exhCategoryName ? `${arrowClass.exhCategoryName[1]}` : ''} />
                          </span>
                        </div>
                      </CTableHeaderCell>
                      <CTableHeaderCell>Image</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {exhCategories.map((exhCategory, index) => {
                      return (
                        <CTableRow key={index}>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell>{exhCategory.exhCategoryName}</CTableDataCell>
                          <CTableDataCell>
                            <div>
                              <img
                                src={imageUrl + exhCategory.image}
                                alt="exhibition category"
                              />
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>
                            <ExhCategoryAddEditModal
                              operation="Edit"
                              buttonText="Edit"
                              exhCategory={exhCategory}
                              fetchExhCategories={fetchExhCategories}
                            />
                            &nbsp; &nbsp;
                            <button
                              type="button"
                              className="btn btn-xs btn-gradient-danger btn-icon-text"
                              onClick={() =>
                                setConfirmDialog({
                                  isOpen: true,
                                  title: `Delete ${exhCategory.exhCategoryName} category?`,
                                  subTitle: "You can't undo this operation!",
                                  onConfirm: () => {
                                    removeExhCategory(exhCategory.exhCategoryId);
                                  },
                                })
                              }
                            >
                              Delete
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
              <CRow>
                <CCol sm={6} className="text-start">
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

export default ExhCategories;
