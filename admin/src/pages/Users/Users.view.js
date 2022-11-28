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
import { getUsers, deleteUserFromServer } from "../../services/user.service";
import ConfirmationModal from "../../components/modal/ConfirmationModal";
import UserAddEditModal from "./components/UserAddEditModal";
import Pagination from "../../common/Pagination";
import NoOfRecords from "../../common/NoOfRecords";
import SearchBar from "../../common/SearchBar";

const Users = () => {
  // Setting state for categories and pagination
  const [users, setUsers] = useState([]);
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

  // Fetch all users as the component renders
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchVal, noOfRecords, currPage]);

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

  // Function to fetch users
  const fetchUsers = async () => {
    const listUserResponse = await getUsers({
      search: searchVal,
      pageRecord: noOfRecords,
      pageNo: currPage,
    });
    if (!listUserResponse) {
      return;
    }
    if (listUserResponse.data.count > 0) {
      setUsers(listUserResponse.data.rows);
      setTotalData(listUserResponse.data.count);
    } else {
      setTotalData(0);
      setUsers([]);
      Toast("error", listUserResponse.data.message);
    }
  };

  // Delete Category
  const deleteUser = async (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    const deleteUserResponse = await deleteUserFromServer(id);
    if (!deleteUserResponse) {
      return;
    }
    if (
      deleteUserResponse.status === 200 ||
      deleteUserResponse.status === "200"
    ) {
      Toast("success", "User deleted");
      fetchUsers();
    } else {
      Toast("error", deleteUserResponse.data.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-home"></i>
          </span>{" "}
          Users
        </h3>
      </div>
      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h4 className="card-title">All Users</h4>
                <UserAddEditModal
                  operation="Add"
                  buttonText="Add User"
                  fetchCategories={fetchUsers}
                />
              </div>
              <div className="d-flex">
                <NoOfRecords setNoOfRecords={setNoOfRecords} />
                <SearchBar
                  searchVal={searchVal}
                  setSearchVal={setSearchVal}
                />
              </div>
              {users.length <= 0 ? (
                <div className="no-data-found">
                  <h3>No Data Found</h3>
                </div>
              ) : (
                <CTable hover className="mt-10">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Sr. No.</CTableHeaderCell>
                      <CTableHeaderCell>Username</CTableHeaderCell>
                      <CTableHeaderCell>Email</CTableHeaderCell>
                      <CTableHeaderCell>Role</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {users.map((user, index) => {
                      return (
                        <CTableRow key={index}>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell>{user.userName}</CTableDataCell>
                          <CTableDataCell>{user.email}</CTableDataCell>
                          {user.roleId === 1 ? (
                            <CTableDataCell>Admin</CTableDataCell>
                          ) : user.roleId === 2 ? (
                            <CTableDataCell>Buyer</CTableDataCell>
                          ) : (
                            <CTableDataCell>Seller</CTableDataCell>
                          )}
                          <CTableDataCell>
                            <UserAddEditModal
                              operation="Edit"
                              buttonText="Edit"
                              user={user}
                              fetchUsers={fetchUsers}
                            />
                            &nbsp; &nbsp;
                            <button
                              type="button"
                              className="btn-sm btn-gradient-danger btn-icon-text"
                              onClick={() =>
                                setConfirmDialog({
                                  isOpen: true,
                                  title: `Delete ${user.userName}?`,
                                  subTitle: "You can't undo this operation!",
                                  onConfirm: () => {
                                    deleteUser(user.userId);
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
              {paginationFunction()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
