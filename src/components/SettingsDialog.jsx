import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store'
import Player from '../classes/Player'
import Colors from '../store/Colors'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import makeStyles from '@material-ui/styles/makeStyles';
import FormGroup from '@material-ui/core/FormGroup'
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from '@material-ui/core/Button'
import { SwatchesPicker } from 'react-color'


const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  formControl: {
    marginLeft: 1,
    marginRight: 10,
  },
  colorSwatch: {
    marginTop: 20,
  },
  colorLabel: {
    marginTop: 10,
    width: 120,
  },
  buttonRow: {
    marginTop: 20,
  },
  colorButton: {
    marginLeft: 10,
  },
});


const COLOR_BUTTON_ID = {
  [Colors.NONE]: "none",
  [Colors.LIGHT_SQUARE]: "light-square-color",
  [Colors.DARK_SQUARE]: "dark-square-color",
  [Colors.SELECTED_SQUARE]: "selected-square-color",
  [Colors.WHITE_CHECKER_PRIMARY]: "white-checker-primary-color",
  [Colors.WHITE_CHECKER_SECONDARY]: "white-checker-secondary-color",
  [Colors.BLACK_CHECKER_PRIMARY]: "black-checker-primary-color",
  [Colors.BLACK_CHECKER_SECONDARY]: "black-checker-secondary-color"
}

const SettingsDialog = observer(function SettingsDialog(props) {
  const classes = useStyles();
  const [selectedColor, setSelectedColor] = React.useState(Colors.NONE)
  const { settings, colors } = useStore()

  const handleClose = () => {
    settings.setOpenSettingsDialog(false);
  };

  const handleReset = () => {
    colors.reset()
  }

  const handleStarting = (event) => {
    settings.setStarting(event.target.value);
  };

  const handleDepth = (event) => {
    settings.setDepth(event.target.value);
  };

  const handleColorChange = ({ hex }) => {
    colors.setColor(selectedColor, hex)
  }

  const handleClick = (id) => {

    if (selectedColor === Colors.NONE) {
      console.log("color button clicked - open the picker:", id)
      setSelectedColor(id)
      settings.setOpenColorPicker(true)
    }
    else if (selectedColor === id) {
      console.log('same color selected - close the picker:', id)
      setSelectedColor(Colors.NONE)
      settings.setOpenColorPicker(false)
    }
    else {
      console.log('changing selected color to', id, colors.getColor(id))
      setSelectedColor(id)
    }
  }

  if (!settings.openSettingsDialog) {
    return null;
  }

  return (
    <Dialog fullWidth={true} maxWidth="sm" onClose={handleClose} aria-labelledby="settings-dialog-title" open={settings.openSettingsDialog}>
      <DialogTitle id="settings-dialog-title">Manage Settings</DialogTitle>
      <DialogContent>
        <form className={classes.form}>
          <FormGroup row>
            <TextField
              id="select-depth"
              select
              className={classes.formControl}
              label="Difficulty"
              value={settings.depth}
              onChange={handleDepth}
              helperText="Select level of difficulty"
              variant="filled"
            >
              <MenuItem value={1}>Stupid</MenuItem>
              <MenuItem value={2}>Easy</MenuItem>
              <MenuItem value={3}>Hard</MenuItem>
              <MenuItem value={4}>Really Hard</MenuItem>
              <MenuItem value={-1}>Impossible</MenuItem>
            </TextField>
            <TextField
              id="select-starting"
              select
              className={classes.formControl}
              label="Starting"
              value={settings.starting}
              onChange={handleStarting}
              helperText="Select who starts"
              variant="filled"
            >
              <MenuItem value={0}>Computer</MenuItem>
              <MenuItem value={1}>Human</MenuItem>
            </TextField>
          </FormGroup>
        </form>
      </DialogContent>
      <DialogContent>
        <form>
          <FormGroup row className={classes.buttonRow}>
            <InputLabel className={classes.colorLabel}>Square Colors</InputLabel>
            <FormControl>
              <Button
                id={COLOR_BUTTON_ID[Colors.LIGHT_SQUARE]}
                onClick={() => handleClick(Colors.LIGHT_SQUARE)}
                variant="contained"
                className={classes.colorButton}
                style={{ backgroundColor: colors.lightSquare }}>Light</Button>
            </FormControl>
            <FormControl>
              <Button
                id={COLOR_BUTTON_ID[Colors.DARK_SQUARE]}
                onClick={() => handleClick(Colors.DARK_SQUARE)}
                variant="contained"
                className={classes.colorButton}
                style={{ backgroundColor: colors.darkSquare }}>Dark</Button>
            </FormControl>
            <FormControl>
              <Button
                id={COLOR_BUTTON_ID[Colors.SELECTED_SQUARE]}
                onClick={() => handleClick(Colors.SELECTED_SQUARE)}
                variant="contained"
                className={classes.colorButton}
                style={{ backgroundColor: colors.selectedSquare }}>Selected</Button>
            </FormControl>
          </FormGroup>

          <FormGroup row className={classes.buttonRow}>
            <InputLabel className={classes.colorLabel}>White Checker</InputLabel>
            <FormControl>
              <Button
                id={COLOR_BUTTON_ID[Colors.WHITE_CHECKER_PRIMARY]}
                onClick={() => handleClick(Colors.WHITE_CHECKER_PRIMARY)}
                variant="contained"
                className={classes.colorButton}
                style={{ backgroundColor: colors.checker[Player.WHITE].primary, color: colors.checker[Player.WHITE].secondary }}>Primary</Button>
            </FormControl>
            <FormControl>
              <Button
                id={COLOR_BUTTON_ID[Colors.WHITE_CHECKER_SECONDARY]}
                onClick={() => handleClick(Colors.WHITE_CHECKER_SECONDARY)}
                variant="contained"
                className={classes.colorButton}
                style={{ backgroundColor: colors.checker[Player.WHITE].secondary, color: colors.checker[Player.WHITE].primary }}>Secondary</Button>
            </FormControl>
          </FormGroup>
          <FormGroup row className={classes.buttonRow}>
            <InputLabel className={classes.colorLabel}>Black Checker</InputLabel>
            <FormControl>
              <Button
                id={COLOR_BUTTON_ID[Colors.BLACK_CHECKER_PRIMARY]}
                onClick={() => handleClick(Colors.BLACK_CHECKER_PRIMARY)}
                variant="contained"
                className={classes.colorButton}
                style={{ backgroundColor: colors.checker[Player.BLACK].primary, color: colors.checker[Player.BLACK].secondary }}>Primary</Button>
            </FormControl>
            <FormControl>
              <Button
                id={COLOR_BUTTON_ID[Colors.BLACK_CHECKER_SECONDARY]}
                onClick={() => handleClick(Colors.BLACK_CHECKER_SECONDARY)}
                variant="contained"
                className={classes.colorButton}
                style={{ backgroundColor: colors.checker[Player.BLACK].secondary, color: colors.checker[Player.BLACK].primary }}>Secondary</Button>
            </FormControl>
          </FormGroup>
        </form>
        {settings.openColorPicker &&
          <SwatchesPicker className={classes.colorSwatch} color={colors.getColor(selectedColor)} colors={colors.colorSet} onChangeComplete={handleColorChange} />
        }

      </DialogContent>
      <DialogActions>
      <Button onClick={handleReset} color="secondary">
          Reset Colors
        </Button>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
})
export default SettingsDialog;