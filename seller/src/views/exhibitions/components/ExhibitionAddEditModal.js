import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  CRow,
  CCol,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput
} from "@coreui/react";
import Select from 'react-select';
import { toast } from "react-toastify";
import { getMinExhibitonStartDate, getExhibitonEndDate } from "src/utils/date";
import { exhService } from "src/services/exhibitions";
import { UserSubscriptionService } from "src/services/userSubscription";
import { useNavigate } from "react-router-dom";
import { AddSellerOnService } from "src/services/userAddOns";
import { CatExService } from "src/services/exhCategories";
import { getUserFromRedux } from "src/utils/userFromredux/getUserFromRedux";
import CIcon from "@coreui/icons-react";
import { cilPencil } from '@coreui/icons'
import { filesFormats } from "src/constants/constants";

const ExhibitionAddEditModal = ({ exhibition, operation, fetchExhibitions, storeData }) => {
  const dispatch = useDispatch();
  const userFromRedux = useSelector((state) => state.user);
  const user = getUserFromRedux(userFromRedux);

  const subscriptionId = useSelector((state) => state.subscription);

  const userSubscriptionIds = useSelector((state) => state.userSubscriptionId);
  const userAddons = useSelector((state) => state.userAddons);

  //set disable when call edit 
  const [disableCtl, setDisableCtl] = useState(false)

  //get exhbition data for bind
  const [viewExhibitionDetailList, setViewExhibitionDetailList] = useState([]);

  // Code for getting actuve subscriptions of seller
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);
  const [activeSubscriptionsCount, setActiveSubscriptionsCount] = useState(0);

  const fetchActiveSubscriptions = async () => {
    const activeSubscriptionsResponse = await UserSubscriptionService.getActiveSubscriptions(user.userId);
    if (!activeSubscriptionsResponse) {
      return;
    }
    if (activeSubscriptionsResponse.status === 200 || activeSubscriptionsResponse.status === '200') {
      dispatch({ type: 'userSubscriptionId', userSubscriptionId: activeSubscriptionsResponse.data.rows });
      setActiveSubscriptions(activeSubscriptionsResponse.data.rows);
      setActiveSubscriptionsCount(activeSubscriptionsResponse.data.count);
    }
  }

  useEffect(() => {
    fetchActiveSubscriptions();
  }, []);

  // Configuring react-hook-form
  const {
    register,
    formState: { errors },
    trigger,
    handleSubmit,
    reset,
    setValue,
    getValues
  } = useForm();

  // State for add/edit modal
  const [visible, setVisible] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [endDate, setEndDate] = useState('');
  const [selectedOptions, setSelectedOptions] = useState();
  const navigate = useNavigate();
  const [addOnsList, setAddOnsList] = useState([]);
  const [selectedExOptions, setSelectedExOptions] = useState();
  const [exhCategoriesList, setExhCategoriesList] = useState([]);
  const [exhCatError, setExhCatError] = useState("");


  useEffect(() => {
    if (operation === 'Add') {
      reset({
        exhibitionName: '',
        exhibitionStartDate: '',
        exhibitionEndDate: '',
      });
    }
    setSelectedOptions([]);
    setSelectedExOptions([]);
  }, [formSubmitted])

  // function to bind data in modal
  const exhibitionBindData = () => {
    setVisible(true);
  }

  // function to close modal
  const close = () => {
    reset({
      exhibitionName: '',
      exhibitionStartDate: '',
      exhibitionEndDate: '',
    })
    setSelectedOptions([]);
    setSelectedExOptions([]);
    setVisible(false);
  }

  const handleFile = async (imagesFromClient) => {
    const upload_file = imagesFromClient;
    const fileExtention = imagesFromClient.name.split('.')
    const fsize = upload_file.size;
    const file = Math.round((fsize / 1024));
    if (upload_file && filesFormats.includes(upload_file.type) || filesFormats.includes("." + fileExtention[1])) {
      if (file >= 10000) {
        toast.warning("File too Big, please select a file less than 10MB")
      } else {
        const formData = new FormData();
        formData.append("image", imagesFromClient);
        const imagesFromServer = await exhService.filePost(formData);
        return imagesFromServer;
      }
    } else {

      toast.warning("Only jpg and png files are allowed!")
    }

  };


  const addEditExhibition = async (e) => {
    if (operation === "Add") {
      if (activeSubscriptions) {
        activeSubscriptions.map((list) => {
          if (list?.subscriptionPlanId === e?.subscriptionPlanId) {
            e.userSubscriptionId = list.userSubscriptionId;
            delete e.subscriptionPlanId;
          }
        });
      }
      e.userId = user.userId;
      e.sellerAddOns = selectedOptions;
      let exhibitionImage = await handleFile(e.exhibitionImage[0]);
      if (!exhibitionImage) {
        return;
      }
      e.exhibitionImage = exhibitionImage.data.filename
      // Setting categoryIds key value as per req body and valiadtion
      if (selectedExOptions) {
        setExhCatError("categories is required");
      } else {
        setExhCatError(" ");
      }

      let exhCategoryIds = [];
      selectedExOptions.map((option) => {
        exhCategoryIds.push({ exhCategoryExhibitionId: 0, exhCategoryId: option.value });
      });
      // Adding exhCategoryIds in payload
      e.exhCategoryIds = exhCategoryIds;
      if (e.sellerAddOns && e.sellerAddOns.length !== 0) {
        userAddons?.map(eleList => {
          const sellerIndex = e?.sellerAddOns.findIndex(data => data.value === eleList?.addOn?.addOnId);

          if (sellerIndex !== -1 && eleList?.addOn.addOnId === e?.sellerAddOns[sellerIndex]?.value) {
            e.sellerAddOns[sellerIndex].sellerAddOnId = eleList?.sellerAddOnId;
            delete eleList?.addOn.addOnId;
            delete e?.sellerAddOns[sellerIndex]?.value;
          }
        })
      }
      userSubscriptionIds?.map(list => {
        if (list?.subscriptionPlanId === e?.subscriptionPlanId) {
          e.userSubscriptionId = list.userSubscriptionId;
          delete e.subscriptionPlanId;
        }
      })
      const addExhibitionResponse = await exhService.addExhibiton(e);
      if (!addExhibitionResponse) {
        return;
      }
      if (addExhibitionResponse.status === 200 || addExhibitionResponse.status === '200') {
        toast.success('Exhibition added successuflly, add product and send it for verification');
        setVisible(false);
        setFormSubmitted(true);
        fetchExhibitions();
        fetchActiveSubscriptions();
        navigate(`/inventory/exhibitions/exhibitionproducts/${addExhibitionResponse.data.exhibitionId}`);
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
      e.exhCategories = exhCategoryIds;
      let exhibitionImage = await handleFile(e.exhibitionImage[0]);
      if (!exhibitionImage) {
        return;
      }
      e.exhibitionImage = exhibitionImage.data.filename;
      // delete e.subscriptionPlanId; // Deleting subscriptionplan Id as it is locked already

      const editExhibitionResponse = await exhService.updateExhibition(e);
      if (!editExhibitionResponse) {
        return;
      }

      if (editExhibitionResponse.status === 200 || editExhibitionResponse.status === '200') {
        toast.success("Exhibition updated successfully")
        setVisible(false);
        setFormSubmitted(true);
        fetchExhibitions();
        fetchActiveSubscriptions();
      }
    }


  }

  const handleStartDateChange = async (e) => {
    const userSubId = getValues("subscriptionPlanId") ? getValues("subscriptionPlanId") : subscriptionId
    const ExhibitionEndDate = await getExhibitonEndDate(userSubId, e.target.value);
    if (!ExhibitionEndDate) {
      return;
    }
    setValue('exhibitionEndDate', ExhibitionEndDate);
    setEndDate(ExhibitionEndDate);
  }

  const handleEndDateBySubChange = async (e) => {
    const exStartDate = getValues("exhibitionStartDate") ? getValues("exhibitionStartDate") : getMinExhibitonStartDate();
    const ExhibitionEndDate = await getExhibitonEndDate(e.target.value, exStartDate);
    if (!ExhibitionEndDate) {
      return;
    }
    setValue('exhibitionEndDate', ExhibitionEndDate);
    setEndDate(ExhibitionEndDate);
  }
  //add ons listing
  const handleSelect = (data) => {
    setSelectedOptions(data);
  }




  const fetchPurchasedAddOns = async () => {

    const addOnListResponse = await AddSellerOnService.getActiveAddOns(user.userId);
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

  useEffect(() => {
    fetchPurchasedAddOns();
  }, []);


  // ex cateogires listing
  const handleExSelect = (data) => {
    setSelectedExOptions(data);
  }

  // get Exh Categories
  const fetchExCat = async () => {
    const catExResponse = await CatExService.getExCategories();
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

    viewExhibitionDetailList && viewExhibitionDetailList?.exhCategoryExhibitions && viewExhibitionDetailList?.exhCategoryExhibitions.map((exhCatExh) => {
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

    viewExhibitionDetailList && viewExhibitionDetailList?.exhibitionSellerAddOns && viewExhibitionDetailList?.exhibitionSellerAddOns.map((exhSellerAddOn) => {
      exhAddOns.push({
        value: exhSellerAddOn.sellerAddOn.addOn.addOnId,
        label: exhSellerAddOn.sellerAddOn.addOn.addOnName,
        exhibitionSellerAddOnId: exhSellerAddOn.exhSellerAddOnId,
      });
    });


    return exhAddOns;
  };



  // Bind the Exhibtion edit page
  const exh = () => {
    fetchExhibitionList()
    fetchActiveSubscriptions(viewExhibitionDetailList.userId);
    fetchPurchasedAddOns(viewExhibitionDetailList.userId);
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

    setValue("exhibitionId", viewExhibitionDetailList.exhibitionId);
    setValue("exhibitionName", viewExhibitionDetailList.exhibitionName);
    setValue("exhCategories", getExistingExhCategories());
    setValue("addOnId", getExistingAddOns());

    setValue(
      "exhibitionStartDate",
      viewExhibitionDetailList.exhibitionStartDate.substring(0, 10)
    );
    setValue(
      "exhibitionEndDate",
      viewExhibitionDetailList?.exhibitionEndDate.substring(0, 10)
      // getExhibitionEndDate(exhibition.userSubscription.subscriptionPlanId, exhibition.exhibitionStartDate.substring(0, 10))
    );
    setValue(
      "subscriptionPlanId",
      viewExhibitionDetailList?.userSubscription?.subscriptionPlanId
    );
    setValue("userId", viewExhibitionDetailList.userId);
    setDisableCtl(true)
    setVisible(!visible);

  }

  useEffect(() => {
    fetchExhibitionList();
  }, [exhibition])

  const fetchExhibitionList = async () => {
    if (exhibition && exhibition.exhibitionId) {
      const viewExDetailRes = await exhService.getExhibiton(exhibition?.exhibitionId);
      if (!viewExDetailRes) {
        return;
      }
      if (viewExDetailRes.status === 200) {
        setViewExhibitionDetailList(viewExDetailRes.data)
      }
    }
  }
  return (
    <>
      {
        operation === 'Edit' ?
          <CButton
            title="Edit"
            color="dark"
            variant="ghost"
            size="sm"
            onClick={() => exh()}
          >
            <CIcon icon={cilPencil} />
          </CButton>
          :
          <CButton
            title="Add"
            color="primary"
            variant="outline"
            size="sm"
            onClick={() => {
              if (storeData) {
                setVisible(!visible)
              } else {
                navigate('/store')
                toast.info("Please enter the store detail before adding the exhibition.")

              }
            }}
          >
            Add Exhibition
          </CButton>
      }
      <CModal alignment='top' visible={visible} onClose={() => close()}>
        <CModalHeader>
          <CModalTitle>{operation} Exhibition</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit(addEditExhibition)}>
          <CModalBody>
            <CRow>
              <CCol sm={12}>
                <CFormLabel htmlFor='exhibitionName'>Exhibition Name</CFormLabel>
                <CFormInput
                  type="text"
                  name="exhibitionName"
                  id="exhibitionName"
                  placeholder="Enter exhibition name"
                  {...register('exhibitionName',
                    { required: 'Exhibition name is required' })}
                  onKeyUp={() => {
                    trigger('exhibitionName')
                  }}
                  defaultValue={viewExhibitionDetailList ? viewExhibitionDetailList.exhibitionName : ""}

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
                <CFormLabel htmlFor='exhibitionStartDate'>Select Categories</CFormLabel>
                <Select
                  id='exhCategoriesList'
                  name='exhCategoriesList'
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
                  className="form-select"
                  {...register('subscriptionPlanId', { required: 'Select type of subscription for this exhibition' })}
                  onKeyUp={() => {
                    trigger('subscriptionPlanId')
                  }}
                  onChange={handleEndDateBySubChange}
                  disabled={disableCtl}

                >
                  {
                    activeSubscriptionsCount ?
                      <>
                        <option hidden>Select exhibition type</option>
                        {
                          activeSubscriptions.map((activeSub, index) => {
                            return (
                              <React.Fragment key={index}>
                                <option value={activeSub.subscriptionPlan.subscriptionPlanId}>{activeSub.subscriptionPlan.subscriptionPlanName}</option>
                              </React.Fragment>
                            );
                          })
                        }
                      </>
                      :
                      <option disabled defaultValue="No subscriptions available">No subscriptions available</option>
                  }
                </select>
                {errors.subscriptionPlanId && (
                  <span className="text-danger">
                    {errors.subscriptionPlanId.message}
                  </span>
                )}
              </CCol>
            </CRow>
            <br />
            <CRow>
              <CCol sm={12}>
                <CFormLabel htmlFor='exhibitionName'>Upload Exhibition Image</CFormLabel>
                <CFormInput
                  type="file"
                  id="exhibitionImage"
                  name="exhibitionImage"
                  accept="image/png, image/jpg, image/jpeg"
                  {...register("exhibitionImage", {
                    required: "Exhibition image is required"
                  })}
                />
                {errors.exhibitionImage && (
                  <small className="text-danger">
                    {errors.exhibitionImage.message}
                  </small>
                )}
              </CCol>
            </CRow>

            <br />
            <CRow>
              <CCol sm={12}>
                <CFormLabel htmlFor='exhibitionStartDate'>Apply AddOns</CFormLabel>
                <Select
                  id='addOnId'
                  name='addOnId'
                  options={addOnsList}
                  placeholder='Select add-ons'
                  onChange={handleSelect}
                  isSearchable={true}
                  defaultValue={getExistingAddOns()}
                  isMulti
                  style={{ width: '100%' }}
                  isDisabled={disableCtl ? true : false}
                />
              </CCol>
            </CRow>
            <br />
            <CRow>
              <CCol sm={12}>
                <CFormLabel htmlFor='exhibitionStartDate'>Start Date</CFormLabel>
                <input
                  type="date"
                  className="form-control"
                  name="exhibitionStartDate"
                  id="exhibitionStartDate"
                  defaultValue={
                    viewExhibitionDetailList
                      ? viewExhibitionDetailList?.exhibitionStartDate?.substring(0, 10)
                      : null
                  }
                  min={getMinExhibitonStartDate()}
                  {...register('exhibitionStartDate', { required: 'Exhibition start date is required' })}
                  onKeyUp={() => {
                    trigger('exhibitionStartDate')
                  }}
                  onChange={handleStartDateChange}
                />
                {errors.exhibitionStartDate && (
                  <span className="text-danger">
                    {errors.exhibitionStartDate.message}
                  </span>
                )}
              </CCol>
            </CRow>
            <br />
            <CRow>
              <CCol sm={12}>
                <CFormLabel htmlFor='exhibitionEndDate'>End Date</CFormLabel>
                <CFormInput
                  type="date"
                  name="exhibitionEndDate"
                  id="exhibitionEndDate"
                  // value={endDate}
                  defaultValue={viewExhibitionDetailList ? viewExhibitionDetailList?.exhibitionEndDate?.substring(0, 10) : ""}
                  disabled
                  {...register('exhibitionEndDate')}
                  onKeyUp={() => {
                    trigger('exhibitionEndDate')
                  }}
                />
                {errors.exhibitionEndDate && (
                  <span className="text-danger">
                    {errors.exhibitionEndDate.message}
                  </span>
                )}
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CRow>
              <CCol sm={12}>
                <div className="d-flex justify-content-end">
                  <CButton color="danger" size='sm' variant="outline" onClick={close}>Close</CButton>
                  &nbsp;
                  <CButton color="primary" size='sm' variant="outline" type="submit">{operation}</CButton>
                </div>
              </CCol>
            </CRow>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  );
}

export default ExhibitionAddEditModal;
