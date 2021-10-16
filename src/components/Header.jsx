import React from "react";
import { observer } from 'mobx-react-lite';
import { useStore } from '../store';
import PLayer from '../classes/Player'
import Player from "../classes/Player";

import makeStyles from '@material-ui/styles/makeStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from "@material-ui/core/IconButton";
import Box from '@material-ui/core/Box'
import Typography from "@material-ui/core/Typography";
import UndoIcon from '@material-ui/icons/Undo'
import SettingsIcon from '@material-ui/icons/Settings'
import FiberNewIcon from '@material-ui/icons/FiberNew'

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
  },
}))

const Header = observer(function Header() {
  const classes = useStyles()
  const { settings } = useStore()
  const remaining = settings.board.remaining
  const kings = settings.board.kings

  const handleUndo = () => {
    settings.undoMoves()
  }

  const handleNewGame = () => {
    settings.setOpenNewGameDialog(true);
  };

  const handleSettings = () => {
    settings.setOpenSettingsDialog(true);
  };
  const handleBannerClick = () => {
    if (settings.superUser) {
      settings.turnOver()
    }
  }

  return (
    <AppBar>
      <Toolbar>
        <Box className={classes.title} flexDirection="column">
          <Typography variant="subtitle2" >Remaining White: {remaining[PLayer.WHITE]}</Typography>
          <Typography variant="subtitle2">White Kings: {kings[PLayer.WHITE]}</Typography>
          <Typography variant="subtitle2">Value: {settings.board.calculate(Player.WHITE)}</Typography>
        </Box>
        <Typography variant="h6" className={classes.title} onClick={handleBannerClick}>
          {settings.banner}
        </Typography>
        <Box className={classes.title} flexDirection="column">
          <Typography variant="subtitle2">Remaining Black: {remaining[Player.BLACK]}</Typography>
          <Typography variant="subtitle2">Black Kings: {kings[Player.BLACK]}</Typography>
          <Typography variant="subtitle2">Value: {settings.board.calculate(Player.BLACK)}</Typography>
        </Box>
        <IconButton color="inherit" disabled={!settings.hasHistory} onClick={handleUndo}><UndoIcon /></IconButton>
        <IconButton color="inherit" onClick={handleNewGame}><FiberNewIcon /></IconButton>
        <IconButton color="inherit" onClick={handleSettings}><SettingsIcon /></IconButton>
      </Toolbar>
    </AppBar>
  )
})
export default Header;