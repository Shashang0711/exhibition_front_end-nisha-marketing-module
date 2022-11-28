import React, { useEffect, useState } from "react";
import Toast from "../../utils/toast";
import {
  getSellerProducts,
  deleteProductFromService,
} from "../../services/product.service";
import ConfirmationModal from "../../components/modal/ConfirmationModal";
import "./Products.css";
import Pagination from "../../common/Pagination";
import NoOfRecords from "../../common/NoOfRecords";
import SearchBar from "../../common/SearchBar";
import "../../components/editor/Editor.css";
import "react-quill/dist/quill.core.css";
import { CButton } from "@coreui/react";
import { imageUrl } from "../../constants/constants";
import { useHistory } from "react-router-dom";

const Products = () => {
  const history = useHistory();
  // Setting states for products and pagination
  const [products, setProducts] = useState([]);
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

  // Fetch all products first time and everytime the pagination states are changed
  useEffect(() => {
    fetchProducts();
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

  // Fetching all products
  const fetchProducts = async () => {
    const listProductsResponse = await getSellerProducts({
      search: searchVal,
      pageRecord: noOfRecords,
      pageNo: currPage,
    });
    if (!listProductsResponse) {
      return;
    }
    if (listProductsResponse.data.count > 0) {
      setProducts(listProductsResponse.data.rows);
      setTotalData(listProductsResponse.data.count);
    } else {
      setTotalData(0);
      setProducts([]);
      Toast("error", listProductsResponse.data.message);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    const deleteProductResponse = await deleteProductFromService(id);
    if (!deleteProductResponse) {
      return;
    }
    if (
      deleteProductResponse.status === 200 ||
      deleteProductResponse.status === "200"
    ) {
      Toast("success", "Product deleted successfully");
      fetchProducts();
    } else {
      Toast("error", deleteProductResponse.data.message);
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
            Products
          </h3>
          <CButton
            className="addbtn"
            color="primary"
            variant="outline"
            size="sm"
            onClick={() => {
              history.push({
                pathname: "/addEditProduct",
                state: {
                  operation: "Add",
                  buttonText: "Add Product",
                },
              });
            }}
          >
            Add Product
          </CButton>
        </div>
        <div className="d-flex">
          <NoOfRecords setNoOfRecords={setNoOfRecords} />
          <SearchBar
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
        </div>
        {products.length === 0 ? (
          <div className="no-data-found">
            <h3>No Products Added</h3>
          </div>
        ) : null}
        <div className="row mt-4">
          {products.map((product, index) => {
            return (
              <div
                className="col-xl-3 col-lg-6 col-md-6 grid-margin stretch-card"
                key={product.productId}
              >
                <div className="card">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <h4 className="m-0 card-title product-data-wrap">
                        {product.productName}
                      </h4>
                      <div className="d-flex justify-content-end">
                        <button
                          type="button"
                          className="btn btn-xs btn-gradient-dark btn-icon-text"
                          onClick={() => {
                            history.push({
                              pathname: "/addEditProduct",
                              state: {
                                operation: "Edit",
                                buttonText: "Edit Product",
                                product: product,
                              },
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-xs btn-gradient-danger btn-icon-text"
                          onClick={() =>
                            setConfirmDialog({
                              isOpen: true,
                              title: `Delete ${product.productName} product?`,
                              subTitle: "You can't undo this operation!",
                              onConfirm: () => {
                                deleteProduct(product.productId);
                              },
                            })
                          }
                        >
                          <i className="mdi mdi-delete-outline text-danger"></i>
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="col-12">
                        <img
                          src={imageUrl + product.productImages[0].imagePath}
                          className="mb-2 mw-100 w-100 img-lg rounded"
                          alt="face"
                        />
                      </div>
                    </div>
                    <div className="d-flex mt-2 align-items-start">
                      <div className="mb-0 flex-grow">
                        <h5 className="mr-2 mb-2 product-data-wrap">
                          {product.user.userName}
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="card-body border-top">
                    {paginationFunction()}
                  </div>
                </div>
              </div>
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

export default Products;
