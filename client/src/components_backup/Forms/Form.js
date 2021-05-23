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
import { UserContext } from "../UserProvider";

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
export default function Forms({ askSwitch, setForceRefresh }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setFormToggle(!fromToggle);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const user = useContext(UserContext);
  const [formInput, setFormInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      name: "",
      notes: "",
      before: "-",
    }
  );

  const bestBefore = [
    { value: "t", label: "Today" },
    { value: "T", label: "Tomorrow" },
    { value: "w", label: "In a week" },
    { value: "m", label: "In a month" },
    { value: "i", label: "Immediate" },
    { value: "-", label: "Not mentioned" },
  ];
  const classes = useStyles();
  const [fromToggle, setFormToggle] = useState(false);

  const handleInput = (evt) => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setFormInput({ [name]: newValue });
  };
  const handleSubmit = (evt) => {
    evt.preventDefault();

    console.log("data gettin postes is", formInput);
    let dataToPost = {
      owner: user.uid,
      owner_name: user.displayName,
      name: formInput.name,
      created_date: new Date(),
      promise_before: formInput.before,
      active: "true",
      notes: formInput.notes,
    };
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
    setForceRefresh((a) => !a);
  };
  return (
    <Paper className={askSwitch ? classes.paperAsk : classes.paper}>
      <Typography variant="h5">
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
      {/* <Dialog
        disableBackdropClick
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent dividers> */}
      {!fromToggle && (
        <>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            className={classes.closeButton}
          >
            <CloseIcon />
          </IconButton>
          <form
            onSubmit={handleSubmit}
            className={classes.root}
            autoComplete="off"
          >
            {/* <Fab className={classes.fab} color="primary" aria-label="add"> */}

            {/* </Fab> */}
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
              {/* <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem> */}
            </Select>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
            >
              {askSwitch ? "Can I get this?" : " I can do this!"}
            </Button>
          </form>
        </>
      )}
      {/* </DialogContent>
      </Dialog> */}
    </Paper>
  );
}
