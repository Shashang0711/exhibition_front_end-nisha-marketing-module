import React from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react';
export default function ComfirmationModal(props) {

  const { confirmDialog, setConfirmDialog } = props;

  return (
    <CModal size='sm' alignment='center' visible={confirmDialog.visible} onClose={() => setConfirmDialog({...confirmDialog, visible: false})}>
      <CModalHeader>
        <CModalTitle>{confirmDialog.title}</CModalTitle>
      </CModalHeader>
      <CModalBody>{confirmDialog.subTitle}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setConfirmDialog({...confirmDialog, visible: false})}>
          Close
        </CButton>
        <CButton color="primary" onClick={confirmDialog.onConfirm}>Delete</CButton>
      </CModalFooter>
    </CModal>
  )
}
