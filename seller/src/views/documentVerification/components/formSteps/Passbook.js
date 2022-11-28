import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  CRow,
  CCol,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react';
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useFormData } from 'src/context';
import { docService } from 'src/services/documents';
import { getUserFromRedux } from 'src/utils/userFromredux/getUserFromRedux';
import { filesFormatsPdf } from 'src/constants/constants';

const Passbook = ({ prevTab, nextTab }) => {
  const [tempFile, setTempFile] = React.useState(null);
  const userFromRedux = useSelector((state) => state.user);
  const user = getUserFromRedux(userFromRedux)

  const navigate = useNavigate();
  const { data, setFormValues } = useFormData();
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({ mode: "all" });
  const [visible, setVisible] = useState(false);
  const [passbookFile, setPassbookFile] = useState('');


  const onSubmit = (values) => {
    values.passbook = tempFile
    const upload_file = tempFile;
    const fileExtention = tempFile[0].name.split('.')
    const fsize = upload_file[0].size;
    const file = Math.round((fsize / 1024));
    if (upload_file && filesFormatsPdf.includes(upload_file.type) || filesFormatsPdf.includes("." + fileExtention[1])) {
      if (file >= 10000) {
        toast.warning("File too Big, please select a file less than 10MB")
      } else {
        setVisible(true)
      }
      setFormValues(values)

    } else {
      toast.warning("Only pdf files are allowed!")
    }
  }

  useEffect(() => {
    setTempFile(data?.passbook)
  }, [data])

  const onChangeFile = (e) => {
    setFormValues({ passbook: e.target.files })

  }

  const handleIdProofUpload = async (fileFromClient) => {
    const formData = new FormData();
    formData.append('idProof', fileFromClient);
    const fileFromServer = await docService.uploadIdProof(formData);
    return fileFromServer;
  }

  const handlePassbookUpload = async (fileFromClient) => {
    const formData = new FormData();
    formData.append('passbook', fileFromClient);
    const fileFromServer = await docService.uploadPassbook(formData);
    return fileFromServer;
  }

  const confirmSubmit = async (data) => {
    if (user?.documents === undefined || user?.documents === null) {
      const idProof = await handleIdProofUpload(data.id_proof[0]);
      const passbook = await handlePassbookUpload(data.passbook[0]);
      if (!idProof) {
        return;
      }
      if (!passbook) {
        return;
      }
      const payload = {
        idProofType: data.doc_type,
        idProof: idProof.data.filename,
        passbook: passbook.data.filename,
        userId: user.userId
      };
      const docUploadResponse = await docService.addDocuments(payload);
      if (!docUploadResponse) {
        return;
      }
      if (docUploadResponse.status === 200 || docUploadResponse.status === '200') {
        navigate('/thank-you');
      } else {
        // toast.error(docUploadResponse.);
      }

    } else if (user?.documents?.isVerified === 'Rejected') {
      const passbook = await handlePassbookUpload(data.passbook[0]);
      const idProof = await handleIdProofUpload(data.id_proof[0]);
      const payload = {
        passbook: passbook.data.filename,
        idProofType: data.doc_type,
        idProof: idProof.data.filename,
        documentId: user.documents.documentId,
        docFlag: 1
      };
      const docUploadResponse = await docService.updateResubmitDoc(payload);
      if (!docUploadResponse) {
        return;
      }
      if (docUploadResponse.status === 200 || docUploadResponse.status === '200') {
        navigate('/thank-you');
      } else {
        toast.error('Failed to upload documents, try again');
      }

    } else {
      const passbook = await handlePassbookUpload(data.passbook[0]);
      if (!passbook) {
        return;
      }
      const payload = {
        passbook: passbook.data.filename,
        documentId: user.documents.documentId,
        docFlag: 3
      };
      const docUploadResponse = await docService.updateResubmitDoc(payload);
      if (!docUploadResponse) {
        return;
      }
      if (docUploadResponse.status === 200 || docUploadResponse.status === '200') {
        navigate('/thank-you');
      } else {
        toast.error('Failed to upload documents, try again');
      }
    }
  }

  return (
    <>
      <div className='mb-3'>
        <h4>
          2. Account Statement of Last 6 Months:
        </h4>
      </div>
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <CRow>
          <CCol xs={12} lg={12}>
            <div className="mb-3">
              <CFormLabel htmlFor="passbook">Account statement of last 6 months</CFormLabel>
              {data?.passbook ?
                <CFormInput
                  type="file"
                  id="passbook"
                  accept='application/pdf'
                  onChange={onChangeFile}

                />
                :
                <CFormInput
                  type="file"
                  id="passbook"
                  accept='application/pdf'
                  onChange={onChangeFile}
                  required
                />

              }


              {errors.passbook && (
                <span className="text-danger">
                  {errors.passbook.message}
                </span>
              )}
              {data?.passbook ? <>{data?.passbook[0].name}</> : <React.Fragment></React.Fragment>}

            </div>
          </CCol>
        </CRow>
        <div style={{ overflow: 'auto' }}>
          <div style={{ float: 'right' }}>

            {(user?.documents?.isIDVerified === 'Verified' || user?.documents?.isIDVerified === 'Pending') ? <></> : <CButton color="secondary" id="prevBtn" onClick={prevTab} >Previous</CButton>}
            &nbsp; &nbsp;
            <CButton type='submit' color="primary" id="nextBtn">Submit</CButton>
          </div>
        </div>
      </CForm>
      <CModal alignment='center' visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>Documents Uploaded Successfully</CModalTitle>
        </CModalHeader>
        <CModalBody>Thank You! You have successfully uploaded documents, our team will get back to you in 2 business days for the verification purpose.</CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => { confirmSubmit(data) }}>Ok</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
}

export default Passbook;
