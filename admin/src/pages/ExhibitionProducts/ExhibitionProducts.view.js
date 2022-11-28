import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CRow, CCol } from "@coreui/react";
import {
  deleteExhProductFromServer,
  getExhProducts,
} from "../../services/exhibitionProduct.service";
import { getExhibitionFromService } from "../../services/exhibition.service";
import Toast from "../../utils/toast";
import ConfirmationModal from "../../components/modal/ConfirmationModal";
import ExhibitionProductsAddEditModal from "./components/ExhibitionProductsAddEditModal";
import Pagination from "../../common/Pagination";
import NoOfRecords from "../../common/NoOfRecords";
import SearchBar from "../../common/SearchBar";

const ExhibitionProducts = () => {
  // State to store exhibition data
  const [exhibition, setExhibition] = useState({});

  // Setting states for products in exhibition and pagination
  const [exhProducts, setExhProducts] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [currPage, setCurrPage] = useState(1);
  const [noOfRecords, setNoOfRecords] = useState(10);
  const [searchVal, setSearchVal] = useState("");


  // Get the id of exhibition from URL
  const { ex_id } = useParams();


  // Function to get exhibition by ID
  const getExhibition = async () => {
    const getExhibitionResponse = await getExhibitionFromService(ex_id);
    if (!getExhibitionResponse) {
      return;
    }
    setExhibition(getExhibitionResponse.data);
  };

  // Execute getExhibition as the page loads
  useEffect(() => {
    getExhibition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Setting state for delete modal
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });



  // Fetch exhibition products for the first time and everytime after the pagination states are changed
  useEffect(() => {
    fetchExhProducts();
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

  // Function to fetch products of current exhibition
  const fetchExhProducts = async () => {
    const listExhProductsResponse = await getExhProducts({
      search: searchVal,
      exhibitionId: ex_id,
      pageRecord: noOfRecords,
      pageNo: currPage,
    });
    if (!listExhProductsResponse) {
      return;
    }
    if (listExhProductsResponse.data.count > 0) {
      setExhProducts(listExhProductsResponse.data.rows);
      setTotalData(listExhProductsResponse.data.count);
    } else {
      setTotalData(0);
      setExhProducts([]);
    }
  };

  // Delete product fro exhibition
  const deleteExhProduct = async (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    const deleteExhProductResponse = await deleteExhProductFromServer(id);
    if (!deleteExhProductResponse) {
      return;
    }
    if (
      deleteExhProductResponse.status === 200 ||
      deleteExhProductResponse.status === "200"
    ) {
      Toast("success", "Product deleted from exhibition successfully");
      fetchExhProducts();
    } else {
      Toast("error", "Failed to delete product from exhibition");
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
            Exhibition: {exhibition.exhibitionName}
          </h3>
          <ExhibitionProductsAddEditModal
            operation="Add"
            buttonText="Add Product"
            fetchExhProducts={fetchExhProducts}
            exhProducts={exhProducts}
            exhibition={exhibition}
          />
        </div>
        <CRow>
          <CCol sm={1} className="text-start">
            <NoOfRecords setNoOfRecords={setNoOfRecords} />
          </CCol>
          <CCol sm={5} className="text-start">
            <SearchBar searchVal={searchVal} setSearchVal={setSearchVal} />
          </CCol>
          <CCol sm={6} className="text-end">
            {paginationFunction()}
          </CCol>
        </CRow>
        {exhProducts.length === 0 ? (
          <div className="mt-5 d-flex justify-content-center">
            <h1>No Products Added</h1>
          </div>
        ) : null}
        <div className="row mt-4">
          {exhProducts.map((exhProduct, index) => {
            return (
              <React.Fragment key={exhProduct.exhibitionProductId}>
                <div className="col-xl-3 col-lg-6 col-md-6 grid-margin stretch-card">
                  <div className="card">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-center">
                        <h4 className="m-0 card-title product-data-wrap">
                          {exhProduct.product.productName}
                        </h4>
                        <div className="d-flex justify-content-end">
                          <ExhibitionProductsAddEditModal
                            operation="Edit"
                            buttonText="Edit"
                            exhProduct={exhProduct}
                            fetchExhProducts={fetchExhProducts}
                          />
                          <button
                            type="button"
                            className="btn btn-xs btn-gradient-danger btn-icon-text"
                            onClick={() =>
                              setConfirmDialog({
                                isOpen: true,
                                title: `Delete ${exhProduct.product.productName}?`,
                                subTitle: "You can't undo this operation!",
                                onConfirm: () => {
                                  deleteExhProduct(
                                    exhProduct.exhibitionProductId
                                  );
                                },
                              })
                            }
                          >
                            <i className="mdi mdi-delete-outline text-danger"></i>
                          </button>
                        </div>
                      </div>
                      {/* <div className="mt-3">
                        <div className="col-12">
                          <img
                            src={baseUrl + exhProduct.product.productImage}
                            className="mb-2 mw-100 w-100 img-lg rounded"
                            alt="face"
                          />
                        </div>
                      </div> */}
                      <div className="d-flex justify-content-between mt-3">
                        <span className="text-muted">
                          Total: {exhProduct.totalQuantity}
                        </span>
                        <span className="text-muted">
                          In stock:{" "}
                          {Number(exhProduct.totalQuantity - exhProduct.sold)}
                        </span>
                        <span className="text-muted">
                          Sold: {exhProduct.sold}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
          <ConfirmationModal
            confirmDialog={confirmDialog}
            setConfirmDialog={setConfirmDialog}
          />
        </div>
      </div>
    </>
  );
};

export default ExhibitionProducts;
