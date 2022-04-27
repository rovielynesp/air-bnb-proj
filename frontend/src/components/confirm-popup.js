import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';
import PropTypes from 'prop-types';

export default function ConfirmDialog ({ trigger, setTrigger, setConfirm, errTitle, errMsg, buttonConfirm }) {
  return (trigger)
    ? (
        <div>
          <Dialog
          open={trigger}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              { errTitle }
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                { errMsg }
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button id="triggerButton" onClick={() => setTrigger(false)} autoFocus>
                Cancel
              </Button>
              <Button id="confirmButton" onClick={() => {
                setConfirm(true);
                setTrigger(false);
              }} autoFocus>
                { buttonConfirm }
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )
    : '';
}

ConfirmDialog.propTypes = {
  trigger: PropTypes.bool,
  setTrigger: PropTypes.func,
  setConfirm: PropTypes.func,
  errTitle: PropTypes.string,
  errMsg: PropTypes.string,
  buttonConfirm: PropTypes.string
}
