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
import { getCategories, deleteCategory } from "../../services/category.service";
import ConfirmationModal from "../../components/modal/ConfirmationModal";
import CategoryAddEditModal from "./components/CategoryAddEditModal";
import Pagination from "../../common/Pagination";
import NoOfRecords from "../../common/NoOfRecords";
import SearchBar from "../../common/SearchBar";
import { imageUrl } from "../../constants/constants";
// import { sortData } from "../../common/Sorting";
import { sortData } from "../../utils/sorting";
import "./Categories.css";

import upsort from "../../assets/images/up-sort.svg";
import downsort from '../../assets/images/down-sort.svg';

const Categories = () => {
  // Setting state for categories and pagination
  const [categories, setCategories] = useState([]);
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

  // State for sorting
  const [arrowClass, setArrowClass] = useState({
    name: ['', ''],
    image: ['', '']
  });
  const [sorting, setSorting] = useState({
    sortBy: 'name',
    order: 'ASC'
  });

  // const sortData = (e) => {
  //   const column = e.target;
  //   let sortBy;
  //   if (column.innerText === 'Category') {
  //     sortBy = 'name'
  //   }

  //   const arrows = column.getElementsByTagName('img');
  //   if (arrows[0].classList.contains('active')){
  //     setSorting({
  //       sortBy,
  //       order: 'ASC'
  //     });
  //     setArrowClass({
  //       [sortBy]: ['', 'active']
  //     });
  //   } else if (arrows[1].classList.contains('active')) {
  //     setSorting({
  //       sortBy,
  //       order: 'DESC'
  //     });
  //     setArrowClass({
  //       [sortBy]: ['active', '']
  //     });
  //   } else {
  //     setSorting({
  //       sortBy,
  //       order: 'DESC'
  //     });
  //     setArrowClass({
  //       [sortBy]: ['active', '']
  //     })
  //   }
  // }

  // Fetch all categories as the component renders
  useEffect(() => {
    fetchCategories();
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
  const fetchCategories = async () => {
    const listCatResponse = await getCategories({
      search: searchVal,
      pageRecord: noOfRecords,
      pageNo: currPage,
      sortBy: sorting.sortBy,
      order: sorting.order
    });
    if (listCatResponse.data.count > 0) {
      setCategories(listCatResponse.data.rows);
      setTotalData(listCatResponse.data.count);
    } else {
      setTotalData(0);
      setCategories([]);
    }
  };

  // Delete Category
  const removeCategory = async (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    const deleteCategoryResponse = await deleteCategory(id);
    if (!deleteCategoryResponse) {
      return;
    }
    if (
      deleteCategoryResponse.status === 200 ||
      deleteCategoryResponse.status === "200"
    ) {
      Toast("success", "Category deleted");
      fetchCategories();
    } else {
      Toast("error", deleteCategoryResponse.data.message);
    }
  };

  return (
    <div>
      <div className="page-header d-flex justify-content-between flex-wrap">
        <h3 className="page-title mb-2">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-home"></i>
          </span>{" "}
          Categories
        </h3>
        <CategoryAddEditModal
          className="mb-2"
          operation="Add"
          buttonText="Add Category"
          fetchCategories={fetchCategories}
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
              {categories.length <= 0 ? (
                <div className="no-data-found">
                  <h3>No Data Found</h3>
                </div>
              ) : (
                <CTable hover className="mt-10">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>
                        <div className="sorting-th">
                          Sr. No.
                        </div>
                      </CTableHeaderCell>
                      <CTableHeaderCell onClick={(e) => sortData(e, 'name', setSorting, setArrowClass)}>
                        <div className="sorting-th">
                          Category
                          <span className="sorting">
                            <img src={upsort} alt="sort" className={`${arrowClass.name[0]}`} />
                            <img src={downsort} alt="sort" className={`${arrowClass.name[1]}`} />
                          </span>
                        </div>
                      </CTableHeaderCell>
                      <CTableHeaderCell>Images</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {categories.map((category, index) => {
                      return (
                        <CTableRow key={index}>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell>{category.name}</CTableDataCell>
                          <CTableDataCell>
                            <div>
                              <img
                                src={imageUrl + category.image}
                                alt="category"
                              />
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CategoryAddEditModal
                              operation="Edit"
                              buttonText="Edit"
                              category={category}
                              fetchCategories={fetchCategories}
                            />
                            &nbsp; &nbsp;
                            <button
                              type="button"
                              className="btn btn-xs btn-gradient-danger btn-icon-text"
                              onClick={() =>
                                setConfirmDialog({
                                  isOpen: true,
                                  title: `Delete ${category.name} category?`,
                                  subTitle: "You can't undo this operation!",
                                  onConfirm: () => {
                                    removeCategory(category.categoryId);
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
              <CCol sm={6} className="text-end">
                {paginationFunction()}
              </CCol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
