import {
  Typography,
  Grid,
  fade,
  makeStyles,
  Paper,
  Button,
  CircularProgress,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import axios from "axios";
import { Connection } from "./Connection";
import { useAskSwitch } from "../../contexts/AskSwitchContext";
import { UserContext } from "../UserProvider";
import React, { useContext } from "react";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    marginTop: "5px",
    maxWidth: 500,
    background: fade("#00a1c1", 0.35),
  },
  paperAsk: {
    padding: theme.spacing(2),
    margin: "auto",
    marginTop: "5px",
    maxWidth: 500,
    background: fade("#4d6431", 0.35),
  },
}));

export const Connections = ({
  connectionList,
  setConnectionList,
  setForceRefresh,
  forceRefresh,
}) => {
  const classes = useStyles();
  const user = useContext(UserContext);

  const [askSwitch] = useAskSwitch();
  const handlePrevious = () => {
    console.log("handlePrevious clicked, calling", connectionList.previous);
    getThisGiveItems(connectionList.previous);
  };
  const handleNext = () => {
    console.log("handleNext clicked, calling", connectionList.next);
    getThisGiveItems(connectionList.next);
  };

  const getThisGiveItems = async (apiUrl) => {
    console.log(apiUrl);
    await axios
      .get(apiUrl)
      .then((response) => response.data)
      .then((data) => {
        setConnectionList(data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Paper className={!askSwitch ? classes.paperAsk : classes.paper}>
      {/* <Typography
        variant="h5"
        className={classes.title}
        color="textPrimary"
        gutterBottom
      >
        Showing your requests to
        {!askSwitch ? " get help" : " help"}
      </Typography> */}
      <Grid
        container
        spacing={4}
        direction="column"
        // alignItems="center"
        // justify="center"
        // style={{ minHeight: "100vh" }}
      >
        {connectionList && connectionList.results ? (
          connectionList.results.map((item, index) => (
            <Grid item key={item.id + forceRefresh}>
              <Connection connection={item} />
            </Grid>
          ))
        ) : (
          <CircularProgress />
        )}
      </Grid>
      {connectionList && connectionList.previous && (
        <Button onClick={handlePrevious}> previous</Button>
      )}
      {connectionList && connectionList.next && (
        <Button onClick={handleNext}> next</Button>
      )}
    </Paper>
  );
};
