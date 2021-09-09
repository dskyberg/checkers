import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button'


const NewGameDialog = observer(function NewGameDialog(props) {
  const { settings } = useStore()
  const { onClose } = props;

  const handleClose = () => {
    settings.setOpenNewGameDialog(false);
    onClose();
  };

  const handleCancel = () => {
    settings.setOpenNewGameDialog(false);
  }

  const handleSuperUser = () => {
    settings.toggleSuperUser()
    settings.setOpenNewGameDialog(false);
  }

  if (!settings.openNewGameDialog) {
    return null;
  }

  return (
    <Dialog fullWidth={true} maxWidth="sm" onClose={handleClose} aria-labelledby="simple-dialog-title" open={settings.openNewGameDialog}>
      <DialogTitle id="simple-dialog-title">Start a new game</DialogTitle>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Start
        </Button>
        <Button onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSuperUser} color="secondary">
          {settings.superUser ? "Disable Super User" : "Enable Super User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
})
export default NewGameDialog;