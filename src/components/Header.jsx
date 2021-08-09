import React from "react";
import { observer } from 'mobx-react-lite';
import { useStore } from '../store';
import { makeStyles } from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from "@material-ui/core/Button";
import Box from '@material-ui/core/Box'
import Typography from "@material-ui/core/Typography";
import PLayer from '../classes/Player'
import Player from "../classes/Player";

const useStyles = makeStyles(theme => ({
    title: {
        flexGrow: 1,
      },
}))

const Header = observer((props) => {
    const classes = useStyles()
    const {settings} = useStore()

    const handleNewGame = () => {
        settings.setOpenDialog(true);
      };

    return (
        <AppBar>
        <Toolbar>
          <Box className={classes.title} flexDirection="column">
            <Typography >Remaining White: {settings.board.remaining[PLayer.WHITE]}</Typography>
            <Typography >White Kings: {settings.board.kings[PLayer.WHITE]}</Typography>
          </Box>
          <Typography variant="h6" className={classes.title}>
            {settings.banner}
          </Typography>
          <Box className={classes.title} flexDirection="column">
            <Typography >Remaining Black: {settings.board.remaining[Player.BLACK]}</Typography>
            <Typography >Black Kings: {settings.board.kings[Player.BLACK]}</Typography>
          </Box>
          <Button color="inherit" onClick={handleNewGame}>New Game</Button>
        </Toolbar>
      </AppBar>

    )

})
export default Header;