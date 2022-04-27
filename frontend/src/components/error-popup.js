import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';
import PropTypes from 'prop-types';

export default function AlertDialog ({ trigger, setTrigger, errTitle, errMsg }) {
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
              <Button onClick={() => setTrigger(false)} autoFocus>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )
    : '';
}

AlertDialog.propTypes = {
  trigger: PropTypes.bool,
  setTrigger: PropTypes.func,
  errTitle: PropTypes.string,
  errMsg: PropTypes.string
}
