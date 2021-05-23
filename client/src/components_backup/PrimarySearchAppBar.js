import React, { useEffect, useState, useContext } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import firebase from "firebase/app";

import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";

import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";
import { Grid, Button, Switch, FormControlLabel } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { useAskSwitch } from "../contexts/AskSwitchContext";
import { UserContext } from "./UserProvider";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },

  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  appBar: {
    background: "#00a1c1",
  },
  appBarAsk: {
    background: "#4d6431",
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function PrimarySearchAppBar({ setItemList }) {
  const classes = useStyles();
  const user = useContext(UserContext);

  const [askSwitch, setAskSwitch] = useAskSwitch();
  const logOut = () => {
    const result = window.confirm("Are you sure you want to logout?");
    if (result) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log("logged out");
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  };
  return (
    <div className={classes.grow}>
      <AppBar
        position="sticky"
        className={!askSwitch ? classes.appBarAsk : classes.appBar}
      >
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            HelpHelper - {user.displayName}
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <Search setItemList={setItemList} />
          </div>
          <div className={classes.grow} />
          <SwitchToAsk />
          <Button
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={logOut}
            color="inherit"
          >
            logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

const Search = ({ setItemList }) => {
  const [searchString, setSearchString] = useState();
  const getAllGiveItems = async (searchString) => {
    let apiUrl;
    if (searchString && searchString.length > 0) {
      apiUrl =
        "http://localhost:8000/giveitems/?active=true&name_contains=" +
        searchString;
    } else if (searchString === undefined || searchString.length === 0) {
      apiUrl = "http://localhost:8000/giveitems/?active=true";
    }
    console.log(apiUrl);
    await axios
      .get(apiUrl)
      .then((response) => response.data)
      .then((data) => {
        setItemList(data);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      console.log(searchString);
      getAllGiveItems(searchString);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchString]);
  const classes = useStyles();
  return (
    <InputBase
      placeholder="Search…"
      classes={{
        root: classes.inputRoot,
        input: classes.inputInput,
      }}
      value={searchString}
      inputProps={{ "aria-label": "search" }}
      onChange={(e) => setSearchString(e.target.value)}
    />
  );
};

const SwitchToAsk = () => {
  const [askSwitch, setAskSwitch] = useAskSwitch();

  const handleChange = (event) => {
    console.log("settting", event.target.checked);

    setAskSwitch(event.target.checked);
  };

  return (
    <Typography component="div">
      <Grid component="label" container alignItems="center" spacing={1}>
        <Grid item>
          <FormControlLabel
            value="start"
            control={
              <Switch
                checked={askSwitch}
                onChange={handleChange}
                name="giveOrAsk"
              />
            }
            label="Ask   Give"
            labelPlacement="top"
          />

          {/* <Switch
            // checked={state.checkedC}
            onChange={handleChange}
            name="giveOrAsk"
          /> */}
        </Grid>
      </Grid>
    </Typography>
  );
};
