import React, { useState, useReducer, Fragment, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";

import TextField from "@material-ui/core/TextField";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import {
  Paper,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Fab,
  Dialog,
  DialogContent,
  fade,
  IconButton,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { UserContext } from "../UserProvider";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
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
    margin: "auto",
    marginTop: "5px",
    maxWidth: 500,
    background: fade("#4d6431", 0.35),
  },
  floatRight: {
    float: "right",
  },
  fab: {},
  textarea: {
    width: "80%",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));
const baseUrl = "http://localhost:8000";
export default function FormSteps({ askSwitch, setForceRefresh }) {
  const user = useContext(UserContext);
  const formInitState = {
    name: "",
    notes: "",
    before: "N",
  };
  const [formInput, setFormInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    formInitState
  );

  const stepsInitState = { step1: true, step2: false, step3: false };
  const [stepState, setStepState] = useState(stepsInitState);

  const bestBefore = {
    t: "Today",
    T: "Tomorrow",
    w: "In a week",
    m: "In a month",
    i: "Immediate",
    N: "Not mentioned",
  };
  const getlabel = (itemInSearch) => {
    if (itemInSearch) return bestBefore[itemInSearch];
  };
  const classes = useStyles();
  const initError = "";
  const [error, setError] = useState(initError);
  const handleInput = (evt) => {
    setError("");
    const name = evt.target.name;
    const newValue = evt.target.value;
    setFormInput({ [name]: newValue });
  };
  const handleStep2 = (evt) => {
    evt.preventDefault();
    if (formInput.name === "") {
      setError(askSwitch ? "what you need!" : "what can you give!");
      return false;
    }
    console.log("handleStep2");
    const step2State = { step1: false, step2: true, step3: false };
    setStepState(step2State);
  };
  const handleStartover = () => {
    setFormInput(formInitState);
    setStepState(stepsInitState);
  };
  const handleStep3 = (evt, bestValue) => {
    evt.preventDefault();
    formInput.before = bestValue;
    console.log("handleStep3", bestValue);
    const step3State = { step1: false, step2: false, step3: true };
    setStepState(step3State);
  };
  const handleSubmit = (evt) => {
    evt.preventDefault();

    console.log("data gettin postes is", formInput);
    let dataToPost = {
      owner: user.uid,
      owner_name: user.displayName,
      name: formInput.name,
      created_date: new Date(),

      active: "true",
      notes: formInput.notes,
    };
    if (askSwitch) {
      dataToPost = { ...dataToPost, best_before: formInput.before };
    } else {
      dataToPost = { ...dataToPost, promise_before: formInput.before };
    }
    console.log(JSON.stringify(dataToPost));

    const apiUrl = `${baseUrl}/${askSwitch ? "ask" : "give"}items/`;
    fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(dataToPost),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => console.log("Success:", JSON.stringify(response)))
      .catch((error) => console.error("Error:", error));
    handleStartover();
    setForceRefresh((a) => !a);
  };
  return (
    <Paper className={askSwitch ? classes.paperAsk : classes.paper}>
      <Typography gutterBottom variant="h5">
        {askSwitch ? "looking for..." : "giving..."}
      </Typography>
      {formInput.name && (
        <Button
          size="small"
          style={{ float: "right" }}
          onClick={handleStartover}
        >
          Start over
        </Button>
      )}
      {!stepState.step1 && (
        <>
          {" "}
          <Typography gutterBottom>
            {" "}
            {formInput.name && "Name:" + formInput.name}
          </Typography>
          <Typography gutterBottom>
            {formInput.before && "How Soon: " + getlabel(formInput.before)}
          </Typography>
        </>
      )}

      {stepState.step1 && (
        <div>
          <TextField
            label="Name the need"
            name="name"
            defaultValue={formInput.name}
            value={formInput.name}
            onChange={handleInput}
            required
          />
          {formInput.name && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleStep2}
              aria-label="close"
            >
              <ArrowRightIcon />
            </IconButton>
          )}
        </div>
      )}
      {stepState.step2 && (
        <div className={classes.root}>
          <Typography gutterBottom>How soon..?</Typography>
          {Object.keys(bestBefore).map((a) => (
            <Button
              variant="contained"
              color="primary"
              onClick={(evt) => handleStep3(evt, a)}
            >
              {bestBefore[a]}
            </Button>
          ))}
        </div>
      )}

      {stepState.step3 && (
        <div className={classes.root}>
          <TextareaAutosize
            rowsMax={4}
            rows={4}
            name="notes"
            placeholder="Details"
            className={classes.textarea}
            defaultValue={formInput.notes}
            value={formInput.notes}
            onChange={handleInput}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleSubmit}
          >
            {askSwitch ? "Can I get this?" : " I can do this!"}
          </Button>
        </div>
      )}

      {error && error}

      {/* <Typography variant="h5">
        {askSwitch ? "I need a..." : "I can give a.."}
        <Fab
          size="small"
          color="primary"
          aria-label="add"
          onClick={() => setFormToggle(!fromToggle)}
          onClick={handleClickOpen}
        >
          {!fromToggle ? <AddIcon /> : <CloseIcon />}
        </Fab>
      </Typography>
      <IconButton
        edge="start"
        color="inherit"
        onClick={handleClose}
        aria-label="close"
        className={classes.closeButton}
      >
        <CloseIcon />
      </IconButton>
      <form onSubmit={handleSubmit} className={classes.root} autoComplete="off">
        <div>
          <TextField
            label="Name the need"
            name="name"
            defaultValue={formInput.name}
            value={formInput.name}
            onChange={handleInput}
            required
          />
        </div>
        <div>
          <TextareaAutosize
            rowsMax={4}
            rows={4}
            name="notes"
            placeholder="Details"
            className={classes.textarea}
            defaultValue={formInput.notes}
            value={formInput.notes}
            onChange={handleInput}
            required
          />
        </div>

        <InputLabel id="before-label">Before</InputLabel>
        <Select
          labelId="before-label"
          name="before"
          value={formInput.before}
          onChange={handleInput}
          required
        >
          {bestBefore.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.button}
        >
          {askSwitch ? "Can I get this?" : " I can do this!"}
        </Button>
      </form> */}
    </Paper>
  );
}
