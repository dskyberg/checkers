import React from "react";
import { observer } from 'mobx-react-lite';
import { useStore } from './store';
import makeStyles from '@material-ui/styles/makeStyles';
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Header from './components/Header'
import BoardView from './components/BoardView'
import NewGameDialog from './components/NewGameDialog'
import SettingsDialog from "./components/SettingsDialog";
import SuperUserDialog from './components/SuperUserDialog'


const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: "#efefef",
    }
  },
  root: {
    width: "100%",
    minHeight: "100%",
    marginTop: 70,
    backgroundColor: "#efefef",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));


const App = observer(function App(props) {
  const classes = useStyles();
  const {settings} = useStore();

  const handleDialogClose = () => {
     settings.reset()
  }

  /**
   * Process the user's move, looks to see if the game is  done.  If not, moves
   * for the ai
   *
   * @param {int} index The square that was clicked
   */

  // Use React.Fragment, so that we can throw the dialog box at the bottom of
  // the app.
  return (
    <React.Fragment>
        <React.StrictMode />
        <Header />
        <Container className={classes.root}>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <BoardView />
          </Box>
        </Container>
       <NewGameDialog onClose={handleDialogClose} />
       <SettingsDialog />
       <SuperUserDialog />
    </React.Fragment>
  );
});
export default App;
