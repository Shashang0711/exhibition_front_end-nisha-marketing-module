import React, { useState, useEffect } from 'react';
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from "@coreui/react";
import { Accordion, Card } from "react-bootstrap";
import Toast from '../../utils/toast';
import { getFAQs, deleteFAQ } from '../../services/faq.service';
import ConfirmationModal from "../../components/modal/ConfirmationModal";
import FAQAddEditModal from './components/FAQAddEditModal';
// import "bootstrap/dist/css/bootstrap.min.css";
import './FAQ.css';
import downsort from '../../assets/images/down-sort.svg';

const FAQ = () => {
  // Setting state for FAQs and pagination
  const [faqs, setFaqs] = useState([]);

  // Setting state for delete modal
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  // Fetch all FAQs as the component renders
  useEffect(() => {
    fetchFAQs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to fetch FAQs
  const fetchFAQs = async () => {
    const listFAQResponse = await getFAQs();
    console.log("listFAQResponse", listFAQResponse)
    if (listFAQResponse.status === 200) {
      setFaqs(listFAQResponse.data);
    } else {
      setFaqs([]);
    }
  };

  // Delete FAQ
  const removeFAQ = async (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    const deleteFAQResponse = await deleteFAQ(id);
    if (!deleteFAQResponse) {
      return;
    }
    if (
      deleteFAQResponse.status === 200 ||
      deleteFAQResponse.status === "200"
    ) {
      Toast("success", "FAQ deleted");
      fetchFAQs();
    }
  };

  return (
    <div>
      <div className="page-header d-flex justify-content-between flex-wrap">
        <h3 className="page-title mb-2">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-home"></i>
          </span>{" "}
          FAQs
        </h3>
        <FAQAddEditModal
          className="mb-2"
          operation="Add"
          buttonText="Add FAQ"
          fetchFAQs={fetchFAQs}
        />
      </div>
      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body scrollableCard faq-table">
              {faqs.length <= 0 ? (
                <div className="no-data-found">
                  <h3>No Data Found</h3>
                </div>
              ) :
                (
                  <CTable hover className="mt-10">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Que No.</CTableHeaderCell>
                        <CTableHeaderCell>FAQs</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {faqs.map((faq, index) => {
                        return (
                          <React.Fragment key={index}>
                            <CTableRow key={index} >
                              <CTableDataCell>{index + 1}</CTableDataCell>
                              <CTableDataCell>
                                <Accordion>
                                  <Accordion.Toggle as={Card.Header} eventKey={`${index}`}>
                                    <img src={downsort} /> {faq.question}
                                  </Accordion.Toggle>
                                  <Accordion.Collapse eventKey={`${index}`}>
                                    <Card.Body>
                                      <div className="row">
                                        <div className="col-md-12">
                                          <p className='que-ans' ><b className='me-2'>Ans: </b> {faq.answer}</p>
                                        </div>
                                      </div>
                                    </Card.Body>
                                  </Accordion.Collapse>
                                </Accordion>
                              </CTableDataCell>
                              <CTableDataCell>
                                <FAQAddEditModal
                                  operation="Edit"
                                  buttonText="Edit"
                                  faq={faq}
                                  fetchFAQs={fetchFAQs}
                                />
                                &nbsp; &nbsp;
                                <button
                                  type="button"
                                  className="btn btn-xs btn-gradient-danger btn-icon-text"
                                  onClick={() =>
                                    setConfirmDialog({
                                      isOpen: true,
                                      title: `Delete question ${index + 1}?`,
                                      subTitle: "You can't undo this operation!",
                                      onConfirm: () => {
                                        removeFAQ(faq.faqId);
                                      },
                                    })
                                  }
                                >
                                  Delete
                                </button>
                              </CTableDataCell>
                            </CTableRow>
                          </React.Fragment>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;