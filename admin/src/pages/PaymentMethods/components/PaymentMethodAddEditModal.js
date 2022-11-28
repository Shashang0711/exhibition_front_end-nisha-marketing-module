import React, { useEffect, useState } from "react";
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormLabel,
  CFormInput,
} from "@coreui/react";
import { useForm } from "react-hook-form";
import Toast from "../../../utils/toast";
import {
  addPaymentMethod,
  updatePaymentMethod,
} from "../../../services/paymentMethod.service";

const PaymentMethodAddEditModal = ({
  operation,
  buttonText,
  paymentMethod,
  fetchPaymentMethods,
}) => {
  // Setting state for modal
  const [visible, setVisible] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // useForm for react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    setValue,
  } = useForm();

  // Make form fields empty if form is submitted
  useEffect(() => {
    if (operation === "Add") {
      reset({
        method: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formSubmitted]);

  const addEditPaymentMethodSubmit = async (e) => {
    if (operation === "Add") {
      const addPayMethodResponse = await addPaymentMethod(e);
      if (!addPayMethodResponse) {
        return;
      }
      if (
        addPayMethodResponse.status === 200 ||
        addPayMethodResponse.status === "200"
      ) {
        Toast("success", "Payment method added successfully");
        setVisible(false);
        setFormSubmitted(true);
        fetchPaymentMethods();
      } else {
        Toast("error", "Failed to add payment method");
      }
    }
    if (operation === "Edit") {
      const editPayMethodResponse = await updatePaymentMethod(e);
      if (!editPayMethodResponse) {
        return;
      }
      if (
        editPayMethodResponse.status === 200 ||
        editPayMethodResponse.status === "200"
      ) {
        Toast("success", "Payment method edited successfully");
        setVisible(false);
        setFormSubmitted(true);
        fetchPaymentMethods();
      } else {
        Toast("error", "Failed to edit payment method");
      }
    }
  };

  const paymentMethodBindData = () => {
    reset({
      method: "",
    });

    setValue("method", paymentMethod.method);
    setVisible(!visible);
  };

  const close = () => {
    reset({
      method: "",
    });
    setVisible(false);
  };

  return (
    <>
      {operation === "Edit" ? (
        <button
          type="button"
          className="btn btn-xs btn-gradient-dark btn-icon-text"
          onClick={() => paymentMethodBindData()}
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
          <CModalTitle> {operation} Payment Method</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit(addEditPaymentMethodSubmit)}>
          <CModalBody>
            <CContainer>
              <CRow>
                <CCol sm={12}>
                  <CFormLabel htmlFor="exampleFormControlInput1">
                    Payment Method Name
                  </CFormLabel>
                  {operation === "Edit" ? (
                    <CFormInput
                      type="hidden"
                      value={paymentMethod.paymentMethodId}
                      {...register("paymentMethodId")}
                    />
                  ) : null}
                  <CFormInput
                    type="text"
                    name="referenceName"
                    placeholder="Enter the payment method name"
                    defaultValue={paymentMethod ? paymentMethod.method : ""}
                    {...register("method", {
                      required: "Payment method name is Required",
                    })}
                    onKeyUp={() => {
                      trigger("method");
                    }}
                  />
                  {errors.method && (
                    <small className="text-danger">
                      {errors.method.message}
                    </small>
                  )}
                </CCol>
                &nbsp;
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

export default PaymentMethodAddEditModal;
