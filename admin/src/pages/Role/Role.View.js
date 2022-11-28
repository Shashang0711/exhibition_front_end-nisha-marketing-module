import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from "@coreui/react";
import Toast from "../../utils/toast";
import ConfirmationModal from "../../components/modal/ConfirmationModal";
import Pagination from "../../common/Pagination";
import NoOfRecords from "../../common/NoOfRecords";
import SearchBar from "../../common/SearchBar";
import { sortData } from "../../utils/sorting";
import upsort from "../../assets/images/up-sort.svg";
import downsort from '../../assets/images/down-sort.svg';
import RoleAddEditModel from "./components/RoleAddEditModel";
import "./Roles.css"
import { deleteRole, getRolePermission } from "../../services/rolePermission.service";
import { getModule } from "../../services/module.service";

const Role = () => {

    // Setting state for Role and pagination
    const [Role, setRole] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [currPage, setCurrPage] = useState(1);
    const [noOfRecords, setNoOfRecords] = useState(10);
    const [searchVal, setSearchVal] = useState("");

    // State for sorting
    const [arrowClass, setArrowClass] = useState({
        roleName: ['', ''],
    });
    const [sorting, setSorting] = useState({
        sortBy: 'roleName',
        order: 'ASC'
    });

    // Setting state for delete modal
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: "",
        subTitle: "",
    });

    // Fetch all Role as the component renders
    useEffect(() => {
        fetchRoles();
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

    // Function to fetch Role
    const fetchRoles = async () => {
        const listRoleResponse =
            await getRolePermission({
                search: searchVal,
                pageRecord: noOfRecords,
                pageNo: currPage,
                sortBy: sorting.sortBy,
                order: sorting.order
            });
        if (!listRoleResponse) {
            return;
        }
        if (listRoleResponse.data.count > 0) {
            setRole(listRoleResponse.data.rows);
            setTotalData(listRoleResponse.data.count);

        } else {
            setTotalData(0);
            setRole([]);
            Toast("error", listRoleResponse.data.message);
        }
    };


    // Delete Category
    const removeRole = async (id) => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false,
        });
        const deleteRoleResponse = await deleteRole(id);
        if (!deleteRoleResponse) {
            return;
        }
        if (
            deleteRoleResponse.status === 200 ||
            deleteRoleResponse.status === "200"
        ) {
            Toast("success", deleteRoleResponse.data);
            fetchRoles();
        } else {
            Toast("error", deleteRoleResponse.data.message);
        }
    };

    const [menu, setMenu] = useState([]);

    // Function to fetch menu
    const fetchMenu = async () => {
        const listMenuResponse = await getModule();
        if (listMenuResponse.status === 200 || listMenuResponse.status === '200') {
            setMenu(listMenuResponse.data);
        } else {
            setMenu([]);
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    return (
        <div>
            <div className="page-header">
                <h3 className="page-title">
                    <span className="page-title-icon bg-gradient-primary text-white mr-2">
                        <i className="mdi mdi-home"></i>
                    </span>{" "}
                    Roles
                </h3>
                <RoleAddEditModel
                    className="mb-2"
                    operation="Add"
                    buttonText="Add Role"
                    fetchRoles={fetchRoles}
                    menu={menu}
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
                            {Role.length <= 0 ? (
                                <div className="no-data-found">
                                    <h3>No Data Found</h3>
                                </div>
                            ) : (
                                <CTable hover className="mt-10">
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell>Sr. No.</CTableHeaderCell>
                                            <CTableHeaderCell onClick={(e) => sortData(e, 'roleName', setSorting, setArrowClass)}>
                                                <div className="sorting-th">
                                                    Role Name
                                                    <span className="sorting">
                                                        <img src={upsort} alt="sort" className={arrowClass.roleName ? `${arrowClass.roleName[0]}` : ''} />
                                                        <img src={downsort} alt="sort" className={arrowClass.roleName ? `${arrowClass.roleName[1]}` : ''} />
                                                    </span>
                                                </div>
                                            </CTableHeaderCell>

                                            <CTableHeaderCell>Actions</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {Role.map((role, index) => {
                                            return (
                                                <CTableRow key={index}>
                                                    <CTableDataCell>{index + 1}</CTableDataCell>
                                                    <CTableDataCell>{role.roleName}</CTableDataCell>

                                                    <CTableDataCell>
                                                        <RoleAddEditModel
                                                            operation="Edit"
                                                            buttonText="Edit"
                                                            role={role}
                                                            fetchRoles={fetchRoles}
                                                            menu={menu}

                                                        />
                                                        &nbsp; &nbsp;
                                                        {role.roleName === 'admin' ?
                                                            <></>
                                                            :
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-xs btn-gradient-danger btn-icon-text"
                                                                    onClick={() =>
                                                                        setConfirmDialog({
                                                                            isOpen: true,
                                                                            title: `Delete ${role.roleName} Role?`,
                                                                            subTitle: "You can't undo this operation!",
                                                                            onConfirm: () => {
                                                                                removeRole(role.roleId);
                                                                            },
                                                                        })
                                                                    }
                                                                >
                                                                    Delete
                                                                </button>
                                                            </>

                                                        }

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

export default Role;
