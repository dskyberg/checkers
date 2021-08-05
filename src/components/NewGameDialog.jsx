import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store'

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";


const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },

});

const NewGameDialog = observer((props) => {
  const classes = useStyles();
  const {settings} = useStore()
  const {onClose} = props;

  const handleClose = () => {
    settings.setOpenDialog(false);
    onClose();
  };

  const handleCancel = () => {
    settings.setOpenDialog(false);
  }
  const handleStarting = (event) => {
    settings.setStarting(event.target.value);
  };

  const handleDepth = (event) => {
    settings.setDepth(event.target.value);
  };


  if (!settings.openDialog) {
    return null;
  }

  return (
    <Dialog fullWidth={true} maxWidth="xs" onClose={ handleClose } aria-labelledby="simple-dialog-title" open={ settings.openDialog }>
      <DialogTitle id="simple-dialog-title">Start a new game</DialogTitle>
      <DialogContent>
        <form className={classes.form}>
        <FormControl className={ classes.formControl }>
          <InputLabel id="demo-simple-select-label">Difficulty</InputLabel>
          <Select labelId="demo-simple-select-label" id="demo-simple-select" value={ settings.depth } onChange={ handleDepth }>
            <MenuItem value={ 1 }>Stupid</MenuItem>
            <MenuItem value={ 2 }>Easy</MenuItem>
            <MenuItem value={ 3 }>Hard</MenuItem>
            <MenuItem value={ 4 }>Really Hard</MenuItem>
            <MenuItem value={ -1 }>Impossible</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={ classes.formControl }>
          <InputLabel id="demo-simple-select-label">Starting</InputLabel>
          <Select labelId="demo-simple-select-label" id="demo-simple-select" value={ settings.starting } onChange={ handleStarting }>
            <MenuItem value={ 0 }>Computer</MenuItem>
            <MenuItem value={ 1 }>Human</MenuItem>
          </Select>
        </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={ handleCancel } color="secondary">
          Cancel
        </Button>
        <Button onClick={ handleClose } color="primary">
          Start
        </Button>
      </DialogActions>
    </Dialog>
    );
})
export default NewGameDialog;