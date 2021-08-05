import React from "react";
import { observer } from 'mobx-react-lite';
import { useStore } from '../store';
import { makeStyles } from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

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
          <Typography className={classes.title}>

          </Typography>
          <Typography variant="h6" className={classes.title}>
            {settings.banner}
          </Typography>
          <Button color="inherit" onClick={handleNewGame}>New Game</Button>
        </Toolbar>
      </AppBar>

    )

})
export default Header;