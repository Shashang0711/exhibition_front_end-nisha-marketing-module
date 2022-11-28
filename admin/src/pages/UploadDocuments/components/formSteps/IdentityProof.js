import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  CForm,
  CRow,
  CCol,
  CFormLabel,
  CFormInput,
  CButton
} from '@coreui/react';
import { useFormData } from '../../../../context';
// import { useSelector } from 'react-redux';
// import { docService } from 'src/services/documents';
import { useHistory } from 'react-router-dom';
// import { getUserFromRedux } from 'src/utils/userFromredux/getUserFromRedux';
// import { filesFormats, filesFormatsPdf } from 'src/constants/constants';
import Toast from "../../../../utils/toast";
import { useState } from 'react';
import { uploadIdProof } from '../../../../services/doc.service';
import { filesFormats, filesFormatsPdf } from '../../../../constants/constants';

const IdentityProof = ({ nextTab, disableBtn, setDisableBtn }) => {
  const [tempFile, setTempFile] = React.useState(null);
  const { data, setFormValues } = useFormData();
  // const userFromRedux = useSelector((state) => state.user);
  // const user = getUserFromRedux(userFromRedux)
  const navigate = useHistory()
  const user = JSON.parse(localStorage.getItem("user"));

  const identityProof = [
    {
      id: 1,
      idProof: "GST"
    },
    {
      id: 2,
      idProof: "Udyog Aadhar"
    },
    {
      id: 3,
      idProof: "Stall License"
    },
    {
      id: 4,
      idProof: "Address Proof"
    },
  ]

  const {
    handleSubmit,
    formState: { errors },
    register,
    trigger
  } = useForm();

  const handleIdProofUpload = async (fileFromClient) => {

    const formData = new FormData();
    formData.append('idProof', fileFromClient);
    const fileFromServer = await uploadIdProof(formData);
    console.log("fileFromClient", fileFromClient)
    return fileFromServer;
  }
  const onSubmit = async (values) => {

    if (user?.documents === undefined || user?.documents === null) {
      //  final submit

      values.id_proof = tempFile;
      setFormValues(values);
      nextTab();
    } else {
      const idProof = await handleIdProofUpload(data.id_proof[0]);
      if (!idProof) {
        return;
      }
    }



    // const payload = {
    //   idProofType: values.doc_type,
    //   idProof: idProof.data.filename,
    //   documentId: user.documents.documentId,
    //   docFlag: 2
    // };
    //   const docUploadResponse = await docService.updateResubmitDoc(payload);
    //   if (!docUploadResponse) {
    //     return;
    //   }
    //   if (docUploadResponse.status === 200 || docUploadResponse.status === '200') {
    //     navigate.push('/thank-you');
    //   } else {
    //     toast.error('Failed to upload documents, try again');
    //   }

  }
  useEffect(() => {
    setTempFile(data?.id_proof);
  }, [data])


  const onFileChange = event => {
    // Update the state
    const imageObj = event.target.files
    const upload_file = imageObj;
    const fileExtention = imageObj[0].name.split('.')
    const fsize = upload_file[0].size;
    const file = Math.round((fsize / 1024));
    if (upload_file && filesFormats.includes(upload_file.type) || filesFormats.includes("." + fileExtention[1]) || filesFormatsPdf.includes(upload_file.type) || filesFormatsPdf.includes("." + fileExtention[1])) {
      if (file >= 10000) {
        Toast('error', "File too Big, please select a file less than 10MB")
        setDisableBtn(true)
      } else {
        setFormValues({ id_proof: event.target.files });
        setDisableBtn(false)
      }
      setFormValues({ id_proof: event.target.files });
    } else {
      setDisableBtn(true)
      Toast('error', "Only jpg and png files are allowed!")
    }
  };

  const checkPdfFormat = () => {
    if (data && data?.id_proof) {
      const temp = data?.id_proof[0].name.split(".");
      if (temp[temp.length - 1] === 'PDF' || temp[temp.length - 1] === 'pdf') {
        return true;
      }
      return false
    }
  }


  return (
    <>
      <div className='mb-3'>
        <h4>
          1. Identity Proof:
        </h4>
      </div>
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <CRow>
          <CCol xs={12} lg={12}>
            <div className="mb-3">
              <CFormLabel htmlFor="proofType">Select Identity Proof</CFormLabel>
              <select
                className='form-select form-control'
                aria-label="Default select example"
                {...register('doc_type', { required: 'Select identy proof type' })}
                onKeyUp={() => {
                  trigger('doc_type')
                }}
              // required
              >
                <option hidden value=''>Select Identity Proof</option>
                {identityProof.map((idProofList, index) => {
                  if (data.doc_type === idProofList.idProof) {
                    return <option key={index} defaultValue={idProofList.idProof} selected>{idProofList.idProof}</option>
                  } else {
                    return (<React.Fragment key={index}>
                      <option value={idProofList.idProof}>{idProofList.idProof}</option>
                    </React.Fragment>)
                  }
                }
                )}

              </select>
              {errors.doc_type && (
                <span className="text-danger">
                  {errors.doc_type.message}
                </span>
              )}
            </div>
          </CCol>
        </CRow>

        <CRow>
          <CCol xs={12} lg={12}>
            <div className="mb-3">
              <CFormLabel htmlFor="identityFile">Identity Proof <small className='text-muted'>(Maxium upload file size: 5MB)</small></CFormLabel>
              {data?.id_proof ?
                <>
                  {console.log("if in")}
                  <CFormInput
                    onChange={onFileChange}
                    type="file"
                    id="formFileMultiple"
                    accept='image/*, application/pdf'

                  />
                </>

                :
                <>
                  {console.log("else")}
                  <CFormInput
                    onChange={onFileChange}
                    type="file"
                    id="formFileMultiple"
                    accept='image/*, application/pdf'
                  // required
                  />
                </>


              }


              <br />

              {checkPdfFormat() ?
                data?.id_proof[0].name : <>
                  {data?.id_proof ? <img style={{ width: "33%" }} src={URL.createObjectURL(data?.id_proof[0])} /> : <React.Fragment></React.Fragment>}
                </>
              }

            </div>
          </CCol>
        </CRow>

        <div style={{ overflow: 'auto' }}>
          <div style={{ float: 'right' }}>

            {/* {(user?.documents?.isPassbookVerified === 'Verified' || user?.documents?.isPassbookVerified === 'Pending') */}
            {/* <CButton type='submit' color="success" id="nextBtn">Submit</CButton> */}
            <CButton type='submit' color="primary" id="nextBtn" disabled={disableBtn}>  Next</CButton>
          </div>
        </div>
      </CForm>
    </>
  );
}

export default IdentityProof;
// GST/Udyog Aadhar/Stall License/Address Proof