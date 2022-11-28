import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  CButton,
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormLabel,
  CFormInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import Select from "react-select";
import Toast from "../../../utils/toast";
import { imageUrl } from "../../../constants/constants";
import {
  addExhibition,
  exhImagePost,
  updateExhibition,
} from "../../../services/exhibition.service";
import { getAllSellers } from "../../../services/user.service";
import {
  getActiveSubscriptions,
  getUserSubscription,
} from "../../../services/userSubscription.service";
import { getExhCategories } from "../../../services/exhCategory.service";
import {
  getMinExhibitionStartDate,
  getExhibitionEndDate,
} from "../../../utils/date";
import { getActiveAddOns } from "../../../services/sellerAddOns.service";

const ExhibitionAddEditModal = ({
  operation,
  buttonText,
  exhibition,
  fetchExhibitions,
}) => {
  let sellerId;
  if (localStorage.getItem("sellerId")) {
    sellerId = localStorage.getItem("sellerId");
  }
  const user = JSON.parse(localStorage.getItem("user"));

  const [selectedOptions, setSelectedOptions] = useState();
  const [addOnsList, setAddOnsList] = useState([]);
  const [selectedExOptions, setSelectedExOptions] = useState();
  const [exhCategoriesList, setExhCategoriesList] = useState([]);

  // ex cateogires listing
  const handleExSelect = (data) => {
    setSelectedExOptions(data);
  }

  //add ons listing
  const handleSelect = (data) => {
    setSelectedOptions(data);
  }

  // Getting active subscriptions of seller
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);
  const [activeSubscriptionsCount, setActiveSubscriptionsCount] = useState(0);
  const fetchActiveSubscriptions = async (sellerId) => {
    const getUserSubscriptionsResponse = await getActiveSubscriptions(sellerId);
    if (!getUserSubscriptionsResponse) {
      return;
    }
    if (
      getUserSubscriptionsResponse.status === 200 ||
      getUserSubscriptionsResponse.status === "200"
    ) {
      setActiveSubscriptions(getUserSubscriptionsResponse.data.rows);
      setActiveSubscriptionsCount(getUserSubscriptionsResponse.data.count);
    }

  };

  const fetchPurchasedAddOns = async (sellerId) => {

    const addOnListResponse = await getActiveAddOns(sellerId);
    if (!addOnListResponse) {
      return;
    }
    if (addOnListResponse.status === 200 || addOnListResponse.status === '200') {
      const allAddons = addOnListResponse.data.rows;
      const uniqueAddons = Array.from(new Set(allAddons.map(a => a.addOn.addOnId)))
        .map(id => {
          return allAddons.find(a => a.addOn.addOnId === id);
        })
      uniqueAddons.forEach((element) => {
        setAddOnsList((existingAddOns) => [
          ...existingAddOns,
          { value: element?.addOn.addOnId, label: element?.addOn.addOnName },
        ])
      });
    }
  }

  // Setting state for modal
  const [visible, setVisible] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Setting state for users list
  // eslint-disable-next-line no-unused-vars
  const [searchPayload, setSearchPayload] = useState({
    search: "",
  });

  // useForm for react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    setValue,
    getValues,
  } = useForm();

  // Make form fields empty if form is submitted
  useEffect(() => {
    if (operation === "Add") {
      reset({
        exhibitionName: "",
        exhibitionStartDate: "",
        exhibitionEndDate: "",
        userId: "",
      });
    }
    // If user is admin logged in as seller
    if (user.role === "admin" && sellerId) {
      setValue("userId", sellerId);
    }
    //If user is seller
    if (user.role === "seller") {
      setValue("userId", user.userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formSubmitted]);

  // Function to bind data in edit modal
  const exhibitionBindData = () => {
    fetchActiveSubscriptions(exhibition.userId);
    fetchPurchasedAddOns(exhibition.userId);
    reset({
      exhibitionId: "",
      exhibitionName: "",
      exhCategories: "",
      addOnId: "",
      exhibitionStartDate: "",
      exhibitionEndDate: "",
      subscriptionPlanId: "",
      userId: "",
    });

    setValue("exhibitionId", exhibition.exhibitionId);
    setValue("exhibitionName", exhibition.exhibitionName);
    setValue("exhCategories", getExistingExhCategories());
    setValue("addOnId", getExistingAddOns());

    setValue(
      "exhibitionStartDate",
      exhibition.exhibitionStartDate.substring(0, 10)
    );
    setValue(
      "exhibitionEndDate",
      exhibition?.exhibitionEndDate.substring(0, 10)
      // getExhibitionEndDate(exhibition.userSubscription.subscriptionPlanId, exhibition.exhibitionStartDate.substring(0, 10))
    );
    setValue(
      "subscriptionPlanId",
      exhibition?.userSubscription?.subscriptionPlanId
    );
    setValue("userId", exhibition.userId);
    setVisible(!visible);
  };

  const addEditExhibitionSubmit = async (e) => {
    if (operation === "Add") {
      if (activeSubscriptions) {
        activeSubscriptions.map((list) => {
          if (list?.subscriptionPlanId === e?.subscriptionPlanId) {
            e.userSubscriptionId = list.userSubscriptionId;
            delete e.subscriptionPlanId;
          }
        });
      }
      const addExhibitionResponse = await addExhibition(e);
      if (!addExhibitionResponse) {
        return;
      }
      if (
        addExhibitionResponse.status === 200 ||
        addExhibitionResponse.status === "200"
      ) {
        Toast("success", "Exhibition added successfully");
        setVisible(false);
        setFormSubmitted(true);
        fetchExhibitions();
        fetchActiveSubscriptions();
      }
    } else {
      delete e.addOnId;
      delete e.subscriptionPlanId;
      let exhCategoryIds = [];
      selectedExOptions && selectedExOptions.map((option) => {
        if (option.exhCategoryExhibitionId) {
          exhCategoryIds.push({ exhCategoryExhibitionId: option.exhCategoryExhibitionId, exhCategoryId: option.value });
        }
        if (!option.exhCategoryExhibitionId) {
          exhCategoryIds.push({ exhCategoryExhibitionId: 0, exhCategoryId: option.value });
        }
      });
      e.exhCategories = exhCategoryIds;
      let exhibitionImage = await handleFile(e.exhibitionImage[0]);
      if (!exhibitionImage) {
        return;
      }
      e.exhibitionImage = exhibitionImage.data.filename;
      // delete e.subscriptionPlanId; // Deleting subscriptionplan Id as it is locked already
      const editExhibitionResponse = await updateExhibition(e);
      if (!editExhibitionResponse) {
        return;
      }
      if (
        editExhibitionResponse.status === 200 ||
        editExhibitionResponse.status === "200"
      ) {
        Toast("success", "Exhibition updated successfully");
        setVisible(false);
        setFormSubmitted(true);
        fetchExhibitions();
        // fetchActiveSubscriptions();
      }

    }
  };

  const handleStartDateChange = async (e) => {
    const userSubId = getValues("subscriptionPlanId")
      ? getValues("subscriptionPlanId")
      : "";
    const ExhibitionEndDate = await getExhibitionEndDate(
      userSubId,
      e.target.value
    );
    setValue("exhibitionEndDate", ExhibitionEndDate);
  };

  const handleEndDateBySubChange = async (e) => {
    const exStartDate = getValues("exhibitionStartDate")
      ? getValues("exhibitionStartDate")
      : getMinExhibitionStartDate();
    const ExhibitionEndDate = await getExhibitionEndDate(
      e.target.value,
      exStartDate
    );
    setValue("exhibitionEndDate", ExhibitionEndDate);
  };

  // Function to close modal when clicked in background
  const close = () => {
    reset({
      exhibitionName: "",
      exhibitionStartDate: "",
      exhibitionEndDate: "",
      // exhibition
      userId: "",
    });
    if (user.role === "seller") {
      setValue("userId", user.userId);
    }

    setVisible(false);
  };

  // Listing exhibition categories
  const fetchExCat = async () => {
    const catExResponse = await getExhCategories();
    if (!catExResponse) {
      return;
    }
    if (catExResponse.status === 200 || catExResponse.status === '200') {
      catExResponse.data.forEach((element) => {
        setExhCategoriesList((existingExCat) => [
          ...existingExCat,
          { value: element?.exhCategoryId, label: element?.exhCategoryName },
        ])
      });
    }
  }
  useEffect(() => {
    fetchExCat();
  }, []);

  // Function to get existing exhibition categories in value and label format
  const getExistingExhCategories = () => {
    const exhCategoriesExh = [];
    exhibition.exhCategoryExhibitions.map((exhCatExh) => {
      exhCategoriesExh.push({
        value: exhCatExh.exhCategoryId,
        label: exhCatExh.exhCategory.exhCategoryName,
        exhCatgeoryExhibitionId: exhCatExh.exhCatgeoryExhibitionId
      });
    });
    return exhCategoriesExh;
  };

  const getExistingAddOns = () => {
    const exhAddOns = [];
    exhibition.exhibitionSellerAddOns.map((exhSellerAddOn) => {
      exhAddOns.push({
        value: exhSellerAddOn.sellerAddOn.addOn.addOnId,
        label: exhSellerAddOn.sellerAddOn.addOn.addOnName,
        exhibitionSellerAddOnId: exhSellerAddOn.exhSellerAddOnId,
      });
    });
    return exhAddOns;
  };

  const handleFile = async (imagesFromClient) => {
    const formData = new FormData();
    formData.append("image", imagesFromClient);
    const imagesFromServer = await exhImagePost(formData);
    return imagesFromServer;
  };

  return (
    <>
      {operation === "Edit" ? (
        <button
          type="button"
          className="btn btn-xs btn-gradient-dark btn-icon-text"
          onClick={() => exhibitionBindData()}
        >
          Edit
        </button>
      ) : (
        <CButton
          className="addbtn"
          color="primary"
          variant="outline"
          size="sm"
          onClick={() => setVisible(!visible)}
        >
          {buttonText}
        </CButton>
      )}

      <CModal alignment="top" visible={visible} onClose={() => close()}>
        <CModalHeader>
          <CModalTitle>{operation} Exhibition</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit(addEditExhibitionSubmit)}>
          <CModalBody>
            <CContainer>
              <CRow>
                <CCol sm={12}>
                  <CFormLabel htmlFor="exhibitionName">
                    Exhibition Name
                  </CFormLabel>
                  {operation === "Edit" ? (
                    <CFormInput
                      type="hidden"
                      value={exhibition.exhibitionId}
                      {...register("exhibitionId")}
                    />
                  ) : null}
                  <CFormInput
                    type="text"
                    name="exhibitionName"
                    id="exhibitionName"
                    placeholder="Enter exhibition name"
                    defaultValue={exhibition ? exhibition.exhibitionName : ""}
                    {...register("exhibitionName", {
                      required: "Exhibition name is required",
                    })}
                    onKeyUp={() => {
                      trigger("exhibitionName");
                    }}
                  />
                  {errors.exhibitionName && (
                    <small className="text-danger">
                      {errors.exhibitionName.message}
                    </small>
                  )}
                </CCol>
              </CRow>
              <br />
              <CRow>
                <CCol sm={12}>
                  <CFormLabel htmlFor='exhCatgeories'>Select exhibition categories</CFormLabel>
                  <Select
                    id='exhCategories'
                    name='exhCategories'
                    options={exhCategoriesList}
                    defaultValue={getExistingExhCategories()}
                    placeholder='Select categories'
                    onChange={handleExSelect}
                    isSearchable={true}
                    isMulti
                    style={{ width: '100%' }}
                    required
                  />
                  <span
                    className="text-danger"
                  >
                    {/* {exhCatError} */}
                  </span>
                </CCol>
              </CRow>
              <br />
              <CRow>
                <CCol sm={12}>
                  <CFormLabel>Select Exhibition Type</CFormLabel>
                  <select
                    className="form-control"
                    disabled
                    {...register("subscriptionPlanId", {
                      required:
                        "Select type of subscription for this exhibition",
                    })}
                    onKeyUp={() => {
                      trigger("subscriptionPlanId");
                    }}
                    onChange={handleEndDateBySubChange}
                  >
                    {/* {activeSubscriptionsCount ? ( */}
                    <>
                      <option disabled selected value="">
                        Select Exhibition Type
                      </option>
                      {/* {activeSubscriptions.map((activeSub) => {
                          {
                            const flag =
                              activeSub?.subscriptionPlan
                                ?.subscriptionPlanId ===
                              exhibition?.userSubscription?.subscriptionPlanId;
                            if (flag) {
                              return (
                                <option
                                  key={activeSub.userSubscriptionId}
                                  value={
                                    activeSub.subscriptionPlan
                                      .subscriptionPlanId
                                  }
                                  selected
                                >
                                  {
                                    activeSub.subscriptionPlan
                                      .subscriptionPlanName
                                  }
                                </option>
                              );
                            }
                            return (
                              <option
                                key={activeSub.userSubscriptionId}
                                value={
                                  activeSub.subscriptionPlan.subscriptionPlanId
                                }
                              >
                                {
                                  activeSub.subscriptionPlan
                                    .subscriptionPlanName
                                }
                              </option>
                            );
                          }
                        })} */}
                      <option value={exhibition.userSubscription.subscriptionPlan.subscriptionPlanId}>
                        {exhibition.userSubscription.subscriptionPlan.subscriptionPlanName}
                      </option>
                    </>
                    {/* // ) : (
                    //   <option disabled selected value="">
                    //     No subscriptions available
                    //   </option>
                    // )} */}
                  </select>
                </CCol>
              </CRow>
              <br />
              <CRow>
                <CCol sm={12}>
                  <CFormLabel htmlFor='exhibitionImage'>
                    Upload Exhibition Image
                    <small className="text-muted">
                      (Maximum upload size: 5 MB)
                    </small>
                  </CFormLabel>
                  <CFormInput
                    type="file"
                    id="exhibitionImage"
                    name="exhibitionImage"
                    accept="image/png, image/jpg, image/jpeg"
                    {...register("exhibitionImage")}
                  />
                </CCol>
              </CRow>
              {/* <CRow>
                <CCol sm={12}>
                  {
                    exhibition ?
                      <img src={imageUrl + exhibition?.exhibitionImage} alt="exhibition" height="100" width="100" />
                    : null
                  }
                </CCol>
              </CRow> */}
              <br />
              <CRow>
                <CCol sm={12}>
                  <CFormLabel htmlFor='exhibitionStartDate'>Apply AddOns</CFormLabel>
                  <Select
                    id='addOnId'
                    name='addOnId'
                    isDisabled={true}
                    options={addOnsList}
                    defaultValue={getExistingAddOns()}
                    placeholder='Select add-ons'
                    // onChange={handleSelect}
                    isSearchable={true}
                    isMulti
                    style={{ width: '100%' }}
                  />
                </CCol>
              </CRow>
              <br />
              <CRow>
                <CCol sm={12}>
                  <CFormLabel htmlFor="exhibitionStartDate">
                    Start Date
                  </CFormLabel>
                  <CFormInput
                    type="date"
                    id="exhibitionStartDate"
                    name="exhibitionStartDate"
                    defaultValue={
                      exhibition
                        ? exhibition.exhibitionStartDate.substring(0, 10)
                        : null
                    }
                    min={getMinExhibitionStartDate()}
                    {...register("exhibitionStartDate", {
                      required: "Start date is required",
                    })}
                    onKeyUp={() => {
                      trigger("exhibitionStartDate");
                    }}
                    onChange={handleStartDateChange}
                  />
                  {errors.exhibitionStartDate && (
                    <small className="text-danger">
                      {errors.exhibitionStartDate.message}
                    </small>
                  )}
                </CCol>
              </CRow>
              <br />
              <CRow>
                <CCol sm={12}>
                  <CFormLabel htmlFor="exhibitionEndDate">End Date</CFormLabel>
                  <CFormInput
                    type="date"
                    id="exhibitionEndDate"
                    name="exhibitionEndDate"
                    disabled
                    style={{ background: "#b1b7c1" }}
                    // value={endDate}
                    defaultValue={
                      // exhibition
                      //   ? 
                      exhibition?.exhibitionEndDate.substring(0, 10)
                      // : null
                    }
                    {...register("exhibitionEndDate", {
                      required: "End date is required",
                    })}
                    onKeyUp={() => {
                      trigger("exhibitionEndDate");
                    }}
                  />
                  {errors.exhibitionEndDate && (
                    <small className="text-danger">
                      {errors.exhibitionEndDate.message}
                    </small>
                  )}
                </CCol>
              </CRow>
              &nbsp;
              <CRow>
                <CCol sm={12}>
                  <CFormLabel htmlFor="userId">Seller name</CFormLabel>
                  <CFormInput
                    aria-label="Default select example"
                    disabled
                    id="userId"
                    name="userId"
                    defaultValue={
                      exhibition
                        ?
                        exhibition.user.userName
                        : null
                    }
                  />
                </CCol>
              </CRow>
            </CContainer>
          </CModalBody>
          <CModalFooter>
            <CContainer>
              <CRow>
                <CCol sm={12}>
                  <div className="d-flex justify-content-end">
                    <CButton
                      color="danger"
                      size="sm"
                      variant="outline"
                      onClick={close}
                    >
                      Close
                    </CButton>
                    &nbsp;
                    <CButton
                      color="success"
                      size="sm"
                      variant="outline"
                      type="submit"
                    >
                      {operation}
                    </CButton>
                  </div>
                </CCol>
              </CRow>
            </CContainer>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  );
};

export default ExhibitionAddEditModal;
