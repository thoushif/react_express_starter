import {
  Grid,
  fade,
  makeStyles,
  Paper,
  Button,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import Item from "./Item";
import Pagination from "@material-ui/lab/Pagination";
import axios from "axios";
import { useAskSwitch } from "../../contexts/AskSwitchContext";
import { UserContext } from "../UserProvider";
import { useState, useContext } from "react";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(5),
    margin: "auto",
    marginTop: "5px",
    maxWidth: 500,
    background: fade("#00a1c1", 0.35),
  },
  paperAsk: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(5),

    margin: "auto",
    marginTop: "5px",
    maxWidth: 500,
    background: fade("#4d6431", 0.35),
  },
  floatRight: {
    float: "right",
  },
}));

export const Items = ({
  itemList,
  setItemList,
  setForceRefresh,
  forceRefresh,
}) => {
  const baseUrl = "http://localhost:8000";
  const user = useContext(UserContext);
  const classes = useStyles();
  const [askSwitch] = useAskSwitch();
  const [filter, setFilter] = useState(false);

  const handlePrevious = () => {
    console.log("handlePrevious clicked, calling", itemList.previous);
    getThisGiveItems(itemList.previous);
  };
  const handleNext = () => {
    console.log("handleNext clicked, calling", itemList.next);
    getThisGiveItems(itemList.next);
  };

  const getThisGiveItems = async (apiUrl) => {
    console.log(apiUrl);
    await axios
      .get(apiUrl)
      .then((response) => response.data)
      .then((data) => {
        setItemList(data);
        setFilter(!filter);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Paper className={askSwitch ? classes.paperAsk : classes.paper}>
      <Typography>
        {!askSwitch ? "All Helps in the world" : "All Needs in the world"} (
        {itemList && itemList.count})
      </Typography>
      <Grid
        container
        spacing={2}
        direction="column"
        // alignItems="center"
        // justify="center"
        // style={{ minHeight: "100vh" }}
      >
        {itemList && itemList.results ? (
          itemList.results.map((item) => (
            <Grid item key={item.id + forceRefresh}>
              <Item item={item} setForceRefresh={setForceRefresh} />
            </Grid>
          ))
        ) : (
          <CircularProgress />
        )}
      </Grid>
      <span>
        {" "}
        {itemList && itemList.previous && (
          <Button onClick={handlePrevious}> previous</Button>
        )}
        {itemList && itemList.next && (
          <Button className={classes.floatRight} onClick={handleNext}>
            next
          </Button>
        )}
      </span>
    </Paper>
  );
};
