import {
  Grid,
  fade,
  makeStyles,
  Paper,
  Button,
  Typography,
} from "@material-ui/core";
import DashboardItem from "./DashboardItem";
import Pagination from "@material-ui/lab/Pagination";
import axios from "axios";
import { useAskSwitch } from "../../contexts/AskSwitchContext";
import { UserContext } from "../UserProvider";
import { useState, useContext } from "react";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
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

export const DashboardItems = ({
  dashboardItemList,
  setDashboardItemList,
  setForceRefresh,
  forceRefresh,
}) => {
  const baseUrl = "http://localhost:8000";
  const user = useContext(UserContext);
  const classes = useStyles();
  const [askSwitch] = useAskSwitch();
  const [filter, setFilter] = useState(false);

  const handlePrevious = () => {
    console.log("handlePrevious clicked, calling", dashboardItemList.previous);
    getThisGiveItems(dashboardItemList.previous);
  };
  const handleNext = () => {
    console.log("handleNext clicked, calling", dashboardItemList.next);
    getThisGiveItems(dashboardItemList.next);
  };

  const filterMyHelps = () => {
    console.log("filterMyHelps");
    let apiUrl = `${baseUrl}/${
      askSwitch ? "ask" : "give"
    }items/?active=true&owner=${user.uid}`;
    getThisGiveItems(apiUrl);
  };

  const getThisGiveItems = async (apiUrl) => {
    console.log(apiUrl);
    await axios
      .get(apiUrl)
      .then((response) => response.data)
      .then((data) => {
        setDashboardItemList(data);
        setFilter(!filter);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Paper className={!askSwitch ? classes.paperAsk : classes.paper}>
      <Typography>
        {!askSwitch ? "You looking for" : "You giving"} (
        {dashboardItemList && dashboardItemList.count})
        <span className={classes.floatRight}>
          {" "}
          {dashboardItemList && dashboardItemList.previous && (
            <Button onClick={handlePrevious}>
              {" "}
              <NavigateBeforeIcon />
            </Button>
          )}
          {dashboardItemList && dashboardItemList.next && (
            <Button onClick={handleNext}>
              <NavigateNextIcon />
            </Button>
          )}
        </span>
      </Typography>
      <Grid
        container
        spacing={2}
        direction="column"
        // alignItems="center"
        // justify="center"
        // style={{ minHeight: "100vh" }}
      >
        {dashboardItemList &&
          dashboardItemList.results &&
          dashboardItemList.results.map((item) => (
            <Grid item key={item.id + forceRefresh}>
              <DashboardItem item={item} setForceRefresh={setForceRefresh} />
            </Grid>
          ))}
      </Grid>
    </Paper>
  );
};
