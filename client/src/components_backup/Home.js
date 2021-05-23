import { useEffect, useState, useContext } from "react";
import { Items } from "./Items/Items";
import { DashboardItems } from "./Dashboard/DashboardItems";
import PrimarySearchAppBar from "./PrimarySearchAppBar";
import giveitems from "../data/giveitems.json";
import askitems from "../data/askitems.json";
import { Grid, Button, CircularProgress } from "@material-ui/core";
import { Suggestions1 } from "./Suggestions/Suggestions";
import Forms from "./Forms/Form";
import FormSteps from "./Forms/FormSteps";
import { useAskSwitch, AskSwitchProvider } from "../contexts/AskSwitchContext";
import { Connections } from "./Connections/Connections";
import {
  BrowserRouter as Router,
  Switch as Switch_Route,
  Route,
  Link,
} from "react-router-dom";
import axios from "axios";
import { UserContext } from "./UserProvider";
import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import InboxIcon from "@material-ui/icons/Inbox";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import NaturePeopleIcon from "@material-ui/icons/NaturePeople";

const baseUrl = "http://localhost:8000";

export const Home = () => {
  const user = useContext(UserContext);
  const [askSwitch] = useAskSwitch();
  const [itemsLoading, setItemsLoading] = useState(false);
  const [connectionsLoading, setConnectionsLoading] = useState(false);
  const [dashboarditemsLoading, setDashboardItemsLoading] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(false);

  const [itemList, setItemList] = useState();
  const [dashboardItemList, setDashboardItemList] = useState();
  const getAllItems = async (itemType, dashboardType) => {
    setItemsLoading(true);
    setDashboardItemsLoading(true);
    const apiUrl = `${baseUrl}/${itemType}items/?active=true`;
    await axios
      .get(apiUrl)
      .then((response) => response.data)
      .then((data) => {
        setItemList(data);
        setItemsLoading(false);
      })
      .catch((err) => console.log(err));

    const apiUrlDashboard = `${baseUrl}/${dashboardType}items/?active=true&owner=${user.uid}`;
    await axios
      .get(apiUrlDashboard)
      .then((response) => response.data)
      .then((data) => {
        setDashboardItemList(data);
        setDashboardItemsLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const [connectionList, setConnectionList] = useState();
  const getAllConnections = async () => {
    setConnectionsLoading(true);
    const apiUrl = `${baseUrl}/itemconnections`;
    await axios
      .get(apiUrl)
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        setConnectionList(data);
        setConnectionsLoading(false);
      })
      .catch((err) => console.log(err));
  };
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (askSwitch) getAllItems("ask", "give");
    else getAllItems("give", "ask");
    setItemsLoading(false);

    getAllConnections();
    console.log("itemList", itemList);
    console.log("connectionList", connectionList);
  }, [askSwitch, forceRefresh]);
  return (
    <div>
      <PrimarySearchAppBar setItemList={setItemList} />
      <div className={classes.root}>
        <AppBar position="sticky" color="default">
          <Tabs
            style={{ top: "160px" }}
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
            centered
          >
            <Tab
              label="Dashboard"
              icon={<InboxIcon fontSize="small" />}
              {...a11yProps(0)}
            >
              Dashboard!!
            </Tab>
            <Tab
              label={askSwitch ? "Giving" : "Looking for"}
              icon={<EmojiPeopleIcon fontSize="small" />}
              {...a11yProps(1)}
            />
            <Tab
              label={
                askSwitch ? "All Needs in the world" : "All helps in the world"
              }
              icon={<NaturePeopleIcon fontSize="small" />}
              {...a11yProps(2)}
            />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <Connections
            connectionList={connectionList}
            setConnectionList={setConnectionList}
            setForceRefresh={setForceRefresh}
            forceRefresh={forceRefresh}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <FormSteps askSwitch={!askSwitch} setForceRefresh={setForceRefresh} />
          {dashboarditemsLoading ? (
            <CircularProgress />
          ) : (
            <DashboardItems
              dashboardItemList={dashboardItemList}
              setDashboardItemList={setDashboardItemList}
              setForceRefresh={setForceRefresh}
              forceRefresh={forceRefresh}
            />
          )}
        </TabPanel>
        <TabPanel value={value} index={2}>
          {itemsLoading ? (
            <CircularProgress />
          ) : (
            <Items
              itemList={itemList}
              setItemList={setItemList}
              setForceRefresh={setForceRefresh}
              forceRefresh={forceRefresh}
            />
          )}
        </TabPanel>
      </div>
      {/* <Grid
                                container
                                xs={12}
                                direction="column"
                                alignItems="center"
                                // justify="center"
                                style={{ minHeight: "100vh" }}
                              >
                                <Grid item xs={3} spacing={3}>
                                  <Connections
                                    connectionList={connectionList}
                                    setConnectionList={setConnectionList}
                                    setForceRefresh={setForceRefresh}
                                    forceRefresh={forceRefresh}
                                  />
                                </Grid>
                                <Grid item xs={3} spacing={3}>
                                                        <Forms askSwitch={!askSwitch} setForceRefresh={setForceRefresh} />
                                                       }
                                  <FormSteps askSwitch={!askSwitch} setForceRefresh={setForceRefresh} />
                                </Grid>
                                <Grid item xs={3} spacing={3}>
                                  <DashboardItems
                                    dashboardItemList={dashboardItemList}
                                    setDashboardItemList={setDashboardItemList}
                                    setForceRefresh={setForceRefresh}
                                    forceRefresh={forceRefresh}
                                  />
                                </Grid>
                                <Grid item xs={3} spacing={3}>
                                  {itemsLoading ? (
                                    <CircularProgress />
                                  ) : (
                                    <Items
                                      itemList={itemList}
                                      setItemList={setItemList}
                                      setForceRefresh={setForceRefresh}
                                      forceRefresh={forceRefresh}
                                    />
                                  )}
                                </Grid>
                              </Grid>
                              <Grid
                                container
                                direction="row"
                                spacing={12}
                                // alignItems="center"
                                // justify="center"
                                // style={{ minHeight: "100vh" }}
                              >
                                                              {/* <Grid container direction="column" xs={10} justify="center">

                                                              </Grid>
                                                              <Grid item xs={2}>
                                                                <Suggestions1
                                                                  itemList={itemList}
                                                                  setItemList={setItemList}
                                                                  askSwitch={askSwitch}
                                                                />
                                                              </Grid> * }
                              </Grid> */}
    </div>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));
