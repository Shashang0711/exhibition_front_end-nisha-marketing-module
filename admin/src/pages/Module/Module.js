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
import { getToken } from "../../utils/token";
import { sortData } from "../../utils/sorting";
import upsort from "../../assets/images/up-sort.svg";
import downsort from '../../assets/images/down-sort.svg';
import "./Module.css"
import { deleteModule, getModule, getModulePermission } from "../../services/module.service";
import ModuleAddEditModel from "./components/ModuleAddEdit";

const Module = () => {

    // Setting state for module and pagination
    const [module, setModule] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [currPage, setCurrPage] = useState(1);
    const [noOfRecords, setNoOfRecords] = useState(10);
    const [searchVal, setSearchVal] = useState("");

    // State for sorting
    const [arrowClass, setArrowClass] = useState({
        moduleName: ['', ''],
    });
    const [sorting, setSorting] = useState({
        sortBy: 'moduleName',
        order: 'ASC'
    });

    // Setting state for delete modal
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: "",
        subTitle: "",
    });

    // Fetch all module as the component renders
    useEffect(() => {
        fetchModule();
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

    // Function to fetch module
    const fetchModule = async () => {
        const listModuleResponse =
            await getModulePermission({
                search: searchVal,
                pageRecord: noOfRecords,
                pageNo: currPage,
                sortBy: sorting.sortBy,
                order: sorting.order
            });
        if (!listModuleResponse) {
            return;
        }
        if (listModuleResponse.data.count > 0) {
            setModule(listModuleResponse.data.rows);
            console.log(listModuleResponse.data.rows)
            setTotalData(listModuleResponse.data.count);

        } else {
            setTotalData(0);
            setModule([]);
            Toast("error", listModuleResponse.data.message);
        }
    };


    // Delete Category
    const removeModule = async (id) => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false,
        });
        const deleteModuleResponse = await deleteModule(id);
        if (!deleteModuleResponse) {
            return;
        }
        if (
            deleteModuleResponse.status === 200 ||
            deleteModuleResponse.status === "200"
        ) {
            Toast("success", deleteModuleResponse.data);
            fetchModule();
        } else {
            Toast("error", deleteModuleResponse.data.message);
        }
    };




    return (
        <div>
            <div className="page-header">
                <h3 className="page-title">
                    <span className="page-title-icon bg-gradient-primary text-white mr-2">
                        <i className="mdi mdi-home"></i>
                    </span>{" "}
                    Roles
                </h3>
                <ModuleAddEditModel
                    className="mb-2"
                    operation="Add"
                    buttonText="Add module"
                    fetchModule={fetchModule}
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
                            {module.length <= 0 ? (
                                <div className="no-data-found">
                                    <h3>No Data Found</h3>
                                </div>
                            ) : (
                                <CTable hover className="mt-10">
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell>Sr. No.</CTableHeaderCell>
                                            <CTableHeaderCell onClick={(e) => sortData(e, 'moduleName', setSorting, setArrowClass)}>
                                                <div className="sorting-th">
                                                    Module Name
                                                    <span className="sorting">
                                                        <img src={upsort} alt="sort" className={arrowClass.moduleName ? `${arrowClass.moduleName[0]}` : ''} />
                                                        <img src={downsort} alt="sort" className={arrowClass.moduleName ? `${arrowClass.moduleName[1]}` : ''} />
                                                    </span>
                                                </div>
                                            </CTableHeaderCell>
                                            <CTableHeaderCell onClick={(e) => sortData(e, 'acronym', setSorting, setArrowClass)}>
                                                <div className="sorting-th">
                                                Acronym Name
                                                    <span className="sorting">
                                                        <img src={upsort} alt="sort" className={arrowClass.acronym ? `${arrowClass.acronym[0]}` : ''} />
                                                        <img src={downsort} alt="sort" className={arrowClass.acronym ? `${arrowClass.acronym[1]}` : ''} />
                                                    </span>
                                                </div>
                                            </CTableHeaderCell>

                                            <CTableHeaderCell>Actions</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {module.map((module, index) => {
                                            return (
                                                <CTableRow key={index}>
                                                    <CTableDataCell>{index + 1}</CTableDataCell>
                                                    <CTableDataCell>{module.moduleName}</CTableDataCell>
                                                    <CTableDataCell>{module.acronym}</CTableDataCell>

                                                    <CTableDataCell>
                                                        <ModuleAddEditModel
                                                            operation="Edit"
                                                            buttonText="Edit"
                                                            module={module}
                                                            fetchModule={fetchModule}
                                                        />
                                                        &nbsp; &nbsp;
                                                        <button
                                                            type="button"
                                                            className="btn btn-xs btn-gradient-danger btn-icon-text"
                                                            onClick={() =>
                                                                setConfirmDialog({
                                                                    isOpen: true,
                                                                    title: `Delete ${module.moduleName} module?`,
                                                                    subTitle: "You can't undo this operation!",
                                                                    onConfirm: () => {
                                                                        removeModule(module.moduleId);
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

export default Module;
