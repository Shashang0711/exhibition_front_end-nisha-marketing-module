import React, { useState, useEffect } from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CButton,
} from "@coreui/react";
import Toast from "../../utils/toast";
import "./ExhibitionDetails.css";
import { Link, useParams, useHistory } from "react-router-dom";
import { getExhibitionFromService } from "../../services/exhibition.service";
import { approveRejectExhibitions } from "../../services/exhibition.service";

const ExhibitonDetails = () => {
  const { exId } = useParams();
  const history = useHistory();
  const [exhibition, setExhibition] = useState({});
  const [verification, setVerification] = useState(false);

  const verifyExhibition = async (exhibitionId, operation) => {
    const payload = { exhibitionId, operation };
    const approveRejectResponse = await approveRejectExhibitions(payload);
    if (!approveRejectResponse) {
      return;
    }
    if (
      approveRejectResponse.status === 200 ||
      approveRejectResponse.status === "200"
    ) {
      if (operation === "Approve") {
        Toast("success", "Exhibition approved");
      } else {
        Toast("error", "Exhibition rejected");
      }
      setVerification(true);
      history.push("/exhibitionVerification");
    } else {
      Toast("error", "Something went wrong, try again");
    }
  };
  useEffect(() => {
    fetchExhibition();
  }, []);
  const fetchExhibition = async () => {
    const getExhibitionResponse = await getExhibitionFromService(exId);
    if (!getExhibitionResponse) {
      return;
    }
    if (
      getExhibitionResponse.status === 200 ||
      getExhibitionResponse.status === "200"
    ) {

      setExhibition(getExhibitionResponse.data);
      if (
        getExhibitionResponse.data.exhibitionStatus === "under verification"
      ) {
        setVerification(true);

      } else {
        setVerification(false);
      }
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
            {exhibition.exhibitionName}
          </h3>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card ex-details-card">
              <div className="card-body scrollableCard">
                <div className="d-flex">
                  <h4 className="card-title flex-grow-1">Exhibition Details</h4>
                  {verification ? (
                    <>
                      <CButton
                        size="sm"
                        color="dark"
                        onClick={() => history.push('/exhibitionVerification')}

                      >
                        Back
                      </CButton>
                      <CButton
                        size="sm"
                        color="success"
                        onClick={() => {
                          verifyExhibition(exhibition.exhibitionId, "Approve");
                        }}

                      >
                        Approve
                      </CButton>

                      <CButton
                        size="sm"
                        color="danger"
                        onClick={() => {
                          verifyExhibition(exhibition.exhibitionId, "Reject");
                        }}
                      >
                        Reject
                      </CButton>
                    </>
                  ) : null}
                </div>
                <br />
                <CRow>
                  <CCol sm={6}>
                    <CCard className="shadow">
                      <CCardBody>
                        <div className="d-flex">
                          <button
                            type="button"
                            className="btn app-icon app-icon btn-social-icon btn-icon bg-gradient-primary text-white"
                          >
                            <i className="mdi mdi-account"></i>
                          </button>
                          &nbsp;&nbsp;&nbsp;
                          <div>
                            <CCardTitle>Username</CCardTitle>
                            <CCardText>{exhibition?.user?.userName}</CCardText>
                          </div>
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                  <CCol sm={6}>
                    <CCard className="shadow">
                      <CCardBody>
                        <div className="d-flex">
                          <button
                            type="button"
                            className="btn app-icon btn-social-icon btn-icon bg-gradient-primary text-white"
                          >
                            <i className="mdi mdi-email"></i>
                          </button>
                          &nbsp;&nbsp;&nbsp;
                          <div>
                            <CCardTitle>Email</CCardTitle>
                            <CCardText>{exhibition?.user?.email}</CCardText>
                          </div>
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                </CRow>
                <br />
                <CRow>
                  <CCol sm={6}>
                    <CCard className="shadow">
                      <CCardBody>
                        <div className="d-flex">
                          <button
                            type="button"
                            className="btn app-icon btn-social-icon btn-icon bg-gradient-primary text-white"
                          >
                            <i className="mdi mdi-diamond"></i>
                          </button>
                          &nbsp;&nbsp;&nbsp;
                          <div>
                            <CCardTitle>Subscription</CCardTitle>
                            <CCardText>
                              {
                                exhibition?.userSubscription?.subscriptionPlan
                                  ?.subscriptionPlanName
                              }
                            </CCardText>
                          </div>
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                  {/* <CCol sm={6}>
                    <CCard className="shadow">
                      <CCardBody>
                        <div className="d-flex">
                          <button type="button" className="btn app-icon btn-social-icon btn-icon bg-gradient-primary text-white">
                            <i className="mdi mdi-toggle-switch"></i>
                          </button>
                          &nbsp;&nbsp;&nbsp;
                          <div>
                            <CCardTitle>Subscription Status</CCardTitle>
                            <CCardText>{exhibition?.userSubscription?.status}</CCardText>
                          </div>
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol> */}
                  <CCol sm={6}>
                    <CCard className="shadow">
                      <CCardBody>
                        <div className="d-flex">
                          <button
                            type="button"
                            className="btn app-icon btn-social-icon btn-icon bg-gradient-primary text-white"
                          >
                            <i className="mdi mdi-toggle-switch"></i>
                          </button>
                          &nbsp;&nbsp;&nbsp;
                          <div>
                            <CCardTitle>Subscription Status</CCardTitle>
                            {/* <CCardText>{exhibition?.userSubscription?.status}</CCardText> */}
                            <CCardText>
                              {exhibition &&
                                exhibition?.exhibitionSellerAddOns &&
                                exhibition?.exhibitionSellerAddOns.length > 0 ? (
                                exhibition &&
                                exhibition?.exhibitionSellerAddOns &&
                                exhibition?.exhibitionSellerAddOns.map(
                                  (exhibitionSellerAddOn, index) => {
                                    if (
                                      index ===
                                      exhibition?.exhibitionSellerAddOns
                                        .length -
                                      1
                                    ) {
                                      return `${exhibitionSellerAddOn.sellerAddOn.addOn.addOnName}`;
                                    } else {
                                      return `${exhibitionSellerAddOn.sellerAddOn.addOn.addOnName} , `;
                                    }
                                  }
                                )
                              ) : (
                                <>No add-ons applied</>
                              )}
                            </CCardText>
                          </div>
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                </CRow>
                <br />
                <CRow>
                  <CCol sm={6}>
                    <CCard className="shadow">
                      <CCardBody>
                        <div className="d-flex">
                          <button
                            type="button"
                            className="btn app-icon btn-social-icon btn-icon bg-gradient-primary text-white"
                          >
                            <i className="mdi mdi-calendar"></i>
                          </button>
                          &nbsp;&nbsp;&nbsp;
                          <div>
                            <CCardTitle>Start Date</CCardTitle>
                            <CCardText>
                              {exhibition?.exhibitionStartDate?.slice(0, 10)}
                            </CCardText>
                          </div>
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                  <CCol sm={6}>
                    <CCard className="shadow">
                      <CCardBody>
                        <div className="d-flex">
                          <button
                            type="button"
                            className="btn app-icon btn-social-icon btn-icon bg-gradient-primary text-white"
                          >
                            <i className="mdi mdi-calendar"></i>
                          </button>
                          &nbsp;&nbsp;&nbsp;
                          <div>
                            <CCardTitle>End Date</CCardTitle>
                            <CCardText>
                              {exhibition?.exhibitionEndDate?.slice(0, 10)}
                            </CCardText>
                          </div>
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                </CRow>
                <br />
                <CRow>
                  <CCol sm={6}>
                    <CCard className="shadow">
                      <CCardBody>
                        <div className="d-flex">
                          <button
                            type="button"
                            className="btn app-icon btn-social-icon btn-icon bg-gradient-primary text-white"
                          >
                            <i className="mdi mdi-link-variant"></i>
                          </button>
                          &nbsp;&nbsp;&nbsp;
                          <div className="flex-grow-1">
                            <CCardTitle>Share Link</CCardTitle>
                            <CCardText className="linkText">
                              <Link
                                to={`/preview-exhibition/${exhibition.shareLink}`}
                              >
                                {exhibition.shareLink}
                              </Link>
                            </CCardText>
                          </div>
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                  <CCol sm={6}>
                    <CCard className="shadow">
                      <CCardBody>
                        <div className="d-flex">
                          <button
                            type="button"
                            className="btn app-icon btn-social-icon btn-icon bg-gradient-primary text-white"
                          >
                            <i className="mdi mdi-package-variant-closed"></i>
                          </button>
                          &nbsp;&nbsp;&nbsp;
                          <div>
                            <CCardTitle>Exhibition Products</CCardTitle>
                            <CCardText className="linkText">
                              <Link
                                to={`/exhibitionproducts/${exhibition.userId}/${exId}`}
                              >
                                View
                              </Link>
                            </CCardText>
                          </div>
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                </CRow>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExhibitonDetails;
