import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
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
// import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useFormData } from '../../../../context';
import Toast from "../../../../utils/toast";
import { filesFormatsPdf } from '../../../../constants/constants';
import { addDocuments, uploadIdProof, uploadPassbook } from '../../../../services/doc.service';
// import { docService } from 'src/services/documents';
// import { getUserFromRedux } from 'src/utils/userFromredux/getUserFromRedux';
// import { filesFormatsPdf } from 'src/constants/constants';

const Passbook = ({ prevTab, nextTab }) => {
  const [tempFile, setTempFile] = React.useState(null);
  // const userFromRedux = useSelector((state) => state.user);
  // const user = getUserFromRedux(userFromRedux)
  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useHistory();
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
        Toast('error', "File too Big, please select a file less than 10MB")
      } else {
        setVisible(true)
      }
      setFormValues(values)

    } else {
      Toast('error', "Only pdf files are allowed!")
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
    const fileFromServer = await uploadIdProof(formData);
    return fileFromServer;
  }

  const handlePassbookUpload = async (fileFromClient) => {
    const formData = new FormData();
    formData.append('passbook', fileFromClient);
    const fileFromServer = await uploadPassbook(formData);
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
      const docUploadResponse = await addDocuments(payload);
      if (!docUploadResponse) {
        return;
      }
      if (docUploadResponse.status === 200 || docUploadResponse.status === '200') {
        // navigate.push('/thank-you');
        alert("addd")
      } else {
        // toast.error(docUploadResponse.);
      }

    } else {
      Toast('error', "Some thing went wrong!")
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

            {/* {(user?.documents?.isIDVerified === 'Verified' || user?.documents?.isIDVerified === 'Pending') ? <></> :  */}
            <CButton color="secondary" id="prevBtn" onClick={prevTab} >Previous</CButton>
            {/* } */}
            &nbsp; &nbsp;
            <CButton type='submit' color="primary" id="nextBtn">Submit</CButton>
          </div>
        </div>
      </CForm>
      <CModal alignment='center' visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>Documents Uploaded Successfully</CModalTitle>
        </CModalHeader>
        <CModalBody>Thank You! You have successfully uploaded documents.</CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => { confirmSubmit(data) }}>Ok</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
}

export default Passbook;
