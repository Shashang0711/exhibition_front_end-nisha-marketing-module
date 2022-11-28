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
  CFormTextarea,
} from "@coreui/react";
import { useForm } from "react-hook-form";
import Toast from "../../../utils/toast";
import {
  addFAQ,
  updateFAQ
} from '../../../services/faq.service';

const FAQAddEditModal = ({
  operation,
  buttonText,
  faq,
  fetchFAQs
}) => {
  const [visible, setVisible] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    setValue
  } = useForm();

  useEffect(() => {
    reset({
      question: '',
      answer: ''
    });
  }, [formSubmitted]);

  const faqBindData = () => {
    reset({
      question: '',
      answer: ''
    });
    setValue('question', faq.question);
    setValue('answer', faq.answer);
    setVisible(!visible);
  }


  const addEditFAQ = async (e) => {
    if (operation === "Add") {
      const addFAQRes = await addFAQ(e);
      if (!addFAQRes) {
        return;
      }
      if (
        addFAQRes.status === 200 ||
        addFAQRes.status === "200"
      ) {
        Toast("success", "FAQ added successfully");
        setVisible(false);
        setFormSubmitted(true);
        fetchFAQs();
      }
    } else {
      const editFAQRes = await updateFAQ(e);
      if (!editFAQRes) {
        return;
      }
      if (
        editFAQRes.status === 200 ||
        editFAQRes.status === "200"
      ) {
        Toast("success", "FAQ updated successfully");
        setVisible(false);
        setFormSubmitted(true);
        fetchFAQs();
      }
    }
  }


  const close = () => {
    reset({
      question: '',
      answer: ''
    });
    setVisible(false)
  }

  return (
    <>
      {operation === 'Edit' ? (
        <button
          className="btn btn-xs btn-gradient-dark btn-icon-text"
          color="warning"
          title="Edit"
          variant="outline"
          size="sm"
          onClick={() => faqBindData()}
        >
          {buttonText}
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

      <CModal alignment="center" visible={visible} onClose={() => close()}>
        <CModalHeader>
          <CModalTitle> {operation} FAQ</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit(addEditFAQ)}>
          <CModalBody>
            <CContainer>
              <CRow>
                <CCol sm={12}>
                  <CFormLabel htmlFor="question">Question</CFormLabel>
                  {operation === "Edit" ? (
                    <CFormInput
                      type="hidden"
                      value={faq.faqId}
                      {...register("faqId")}
                    />
                  ) : null}
                  <CFormInput
                    type="text"
                    id="question"
                    name="question"
                    placeholder="Enter question"
                    defaultValue={faq ? faq.question : ""}
                    {...register("question", {
                      required: "Question is Required",
                    })}
                    onKeyUp={() => {
                      trigger("question");
                    }}
                  />
                  {errors.question && (
                    <small className="text-danger">{errors.question.message}</small>
                  )}
                </CCol>
                &nbsp;
              </CRow>
              <CRow>
                <CCol sm={12}>
                  <CFormLabel htmlFor="answer">
                    Answer
                  </CFormLabel>
                  <CFormTextarea
                    id="answer"
                    rows="3"
                    {...register("answer", {
                      required: "Answer is required",
                    })}
                    onKeyUp={() => {
                      trigger("answer");
                    }}
                  ></CFormTextarea>
                  {errors.answer && (
                    <small className="text-danger">{errors.answer.message}</small>
                  )}
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
  )
};

export default FAQAddEditModal;
