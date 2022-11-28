import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import React from 'react'
import {
  CButton,
} from '@coreui/react';
export default function ComfirmationModal(props) {

  const { confirmDialog, setConfirmDialog } = props;
  return (
    <Dialog open={confirmDialog.isOpen}>
      <DialogTitle>
      {confirmDialog.title}
      </DialogTitle>
      <DialogContent>
        {/* <Typography variant='h6'>
          {confirmDialog.title}
        </Typography> */}
        <Typography variant='subtitle2'>
          {confirmDialog.subTitle}
        </Typography>
      </DialogContent>
      <DialogActions>
        <CButton type="submit" color="secondary" variant="outline" onClick={()=>setConfirmDialog({...confirmDialog,isOpen:false})}>No</CButton>
        <CButton type="submit" color="danger" variant="outline" onClick={confirmDialog.onConfirm}>Yes</CButton>
      </DialogActions>
    </Dialog>
  )
}
