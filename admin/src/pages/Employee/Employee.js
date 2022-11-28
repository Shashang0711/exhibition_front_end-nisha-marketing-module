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
import ConfirmationModal from "../../components/modal/ConfirmationModal";
import Pagination from "../../common/Pagination";
import NoOfRecords from "../../common/NoOfRecords";
import SearchBar from "../../common/SearchBar";
import { imageUrl } from "../../constants/constants";
import { sortData } from "../../utils/sorting";
import EmployeeAddEdit from '../Employee/components/EmployeeAddEdit'
import "./Employee.css";

import upsort from "../../assets/images/up-sort.svg";
import downsort from '../../assets/images/down-sort.svg';
import { deleteEmployeeService, getEmployees } from "../../services/employee.service";
import { getRolePermissions } from "../../services/rolePermission.service";

const Employee = () => {
    // Setting state for employee and pagination
    const [employee, setEmployee] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [currPage, setCurrPage] = useState(1);
    const [noOfRecords, setNoOfRecords] = useState(10);
    const [searchVal, setSearchVal] = useState("");
    const [role, setRole] = useState([]);

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
        sortBy: 'userName',
        order: 'ASC'
    });


    // Fetch all employee as the component renders
    useEffect(() => {
        fetchEmployee();
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

    // Function to fetch employee
    const fetchEmployee = async () => {

        const empResponse = await getEmployees({
            search: searchVal,
            pageRecord: noOfRecords,
            pageNo: currPage,
            sortBy: sorting.sortBy,
            order: sorting.order
        })
        if (!empResponse) {
            return;
        }

        if (empResponse.status === 200 || empResponse.status === '200') {
            if (empResponse && empResponse?.data && empResponse?.data?.length > 0) {
                setEmployee(empResponse.data)
                setTotalData(empResponse.data.length);

            } else {
                setTotalData(0);
                setEmployee([]);
            }

        }
    };

    // Delete Employee
    const removeEmployee = async (id) => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false,
        });
        const deleteEmployeeResponse = await deleteEmployeeService(id);
        if (!deleteEmployeeResponse) {
            return;
        }
        if (
            deleteEmployeeResponse.status === 200 ||
            deleteEmployeeResponse.status === "200"
        ) {
            fetchEmployee();
            Toast("success", "Employee deleted");
        } else {
            Toast("error", deleteEmployeeResponse.data.message);
        }
    };

    useEffect(() => {
        fetchRoles()
    }, [])

    //get rolls
    const fetchRoles = async () => {
        const listRoleResponse =
            await getRolePermissions();
        if (!listRoleResponse) {
            return;
        }
        if (listRoleResponse.status === 200 || listRoleResponse.status === '200') {
            setRole(listRoleResponse.data);
        } else {
            setRole([]);
            Toast("error", listRoleResponse.data.message);
        }
    };

    console.log("employee", employee)


    return (
        <div>
            <div className="page-header d-flex justify-content-between flex-wrap">
                <h3 className="page-title mb-2">
                    <span className="page-title-icon bg-gradient-primary text-white mr-2">
                        <i className="mdi mdi-home"></i>
                    </span>{" "}
                    employee
                </h3>
                <EmployeeAddEdit
                    className="mb-2"
                    operation="Add"
                    buttonText="Add Employee"
                    fetchEmployee={fetchEmployee}
                    role={role}
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

                            {employee.length <= 0 ?
                                <div className="no-data-found">
                                    <h3>No Data Found</h3>
                                </div>
                                :
                                <CTable hover className="mt-10">
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell>
                                                <div className="sorting-th">
                                                    Sr. No.
                                                </div>
                                            </CTableHeaderCell>
                                            <CTableHeaderCell onClick={(e) => sortData(e, 'userName', setSorting, setArrowClass)}>
                                                <div className="sorting-th">
                                                    Username
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
                                            <CTableHeaderCell>Phone Number</CTableHeaderCell>
                                            <CTableHeaderCell>Actions</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {
                                            employee.map((element, index) => {
                                                return (
                                                    <React.Fragment key={index}>
                                                        <CTableRow >
                                                            <CTableDataCell>{index + 1}</CTableDataCell>
                                                            <CTableDataCell>{element.userName}</CTableDataCell>
                                                            <CTableDataCell>{element.email}</CTableDataCell>
                                                            <CTableDataCell>{element.mobileNo}</CTableDataCell>
                                                            <CTableDataCell>

                                                                <EmployeeAddEdit
                                                                    operation="Edit"
                                                                    buttonText="Edit"
                                                                    employee={element}
                                                                    fetchEmployee={fetchEmployee}
                                                                    role={role}
                                                                />
                                                                &nbsp; &nbsp;
                                                                {element?.role?.roleName === 'admin' ?
                                                                    <></> :
                                                                    <>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-xs btn-gradient-danger btn-icon-text"
                                                                            onClick={() =>
                                                                                setConfirmDialog({
                                                                                    isOpen: true,
                                                                                    title: `Delete ${element.userName} employee?`,
                                                                                    subTitle: "You can't undo this operation!",
                                                                                    onConfirm: () => {
                                                                                        removeEmployee(element.userId);
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
                                                    </React.Fragment>
                                                );
                                            })
                                        }

                                    </CTableBody>
                                    <ConfirmationModal
                                        confirmDialog={confirmDialog}
                                        setConfirmDialog={setConfirmDialog}
                                    />
                                </CTable>
                            }
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

export default Employee;
