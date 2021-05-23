import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { UserContext } from "../UserProvider";
import { useAskSwitch } from "../../contexts/AskSwitchContext";
import axios from "axios";

const useStyles = makeStyles({
  root: {
    // minWidth: 275
    // width: 400
    alignContent: "center",
    maxWidth: 500,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  toright: {
    float: "right",
  },
});
const baseUrl = "http://localhost:8000";

export default function DashboardItem({ item, setForceRefresh }) {
  const user = useContext(UserContext);
  const [askSwitch] = useAskSwitch();

  const handleOnDelete = async () => {
    console.log("handling on delete ", item.name);
    const result = window.confirm(
      "Are you sure you want to delete '" + item.name + "' ?"
    );
    const apiUrl = item.url;
    if (result) {
      await axios
        .patch(apiUrl, { active: false })
        .then((response) => response.data)
        .then((data) => {
          console.log(data, " >>>>>>>>>>>deleted");
          setForceRefresh((a) => !a);
        })
        .catch((err) => console.log(err));
    }
  };

  const classes = useStyles();

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

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          {getlabel(item.promise_before)} {getlabel(item.best_before)}
          {/* {name, created_date, updated_date, best_before, active, notes}  */}
        </Typography>
        <Typography variant="h5" component="h2">
          {item.name}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {item.best_before_display} {item.promise_before_display}
        </Typography>
        {item.notes}
        {/* <Typography variant="caption">{item.notes}</Typography> */}
      </CardContent>

      <CardActions className={classes.toright}>
        <>
          Added {item.created_date}
          <Button size="small" onClick={handleOnDelete}>
            <DeleteIcon />
          </Button>
        </>
      </CardActions>
    </Card>
  );
}
