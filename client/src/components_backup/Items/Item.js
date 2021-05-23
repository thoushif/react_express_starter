import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import LinkIcon from "@material-ui/icons/Link";
import { UserContext } from "../UserProvider";
import { useAskSwitch } from "../../contexts/AskSwitchContext";
import NeedConfirmation from "./NeedConfirmation";
import axios from "axios";

const useStyles = makeStyles({
  root: {
    // minWidth: 275
    // width: 400
    // alignContent: "center"
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

export default function Item({ item, setForceRefresh }) {
  const user = useContext(UserContext);
  const [askSwitch] = useAskSwitch();
  const [requested, setRequested] = useState(false);
  const [alreadyRequested, setAlreadyRequested] = useState(false);

  const handleOnNeedCheck = () => {
    setRequested(true);
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
  const checkIfThisItemConnectionExists = async () => {
    let apiUrl = `http://localhost:8000/itemconnections/?source=${user.uid}`;
    if (!askSwitch) {
      apiUrl = apiUrl + `&give_item=${item.id}`;
    } else {
      apiUrl = apiUrl + `&ask_item=${item.id}`;
    }
    await axios
      .get(apiUrl)
      .then((response) => response.data)
      .then((data) => {
        console.log(data, " >>>>>>>>>>>item's count");
        if (data.count && data.count > 0) setAlreadyRequested(true);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    checkIfThisItemConnectionExists();
    return () => {
      setAlreadyRequested(false);
    };
  }, []);

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
        <Typography variant="caption">{item.notes}</Typography>
      </CardContent>
      <CardActions>
        <Typography>
          {requested && (
            <NeedConfirmation
              item={item}
              setRequested={setRequested}
              setForceRefresh={setForceRefresh}
            />
          )}
        </Typography>
      </CardActions>
      <CardActions className={classes.toright}>
        {item.owner === user.uid ? (
          "Added by you "
        ) : (
          <>
            Added by {item.owner_name}
            <Button
              size="small"
              onClick={handleOnNeedCheck}
              disabled={alreadyRequested}
            >
              <LinkIcon />{" "}
              {askSwitch ? (
                <CanGiveThis alreadyRequested={alreadyRequested} />
              ) : (
                <NeedThis alreadyRequested={alreadyRequested} />
              )}
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
}

function CanGiveThis({ alreadyRequested }) {
  return (
    <span>{alreadyRequested ? "updated already!" : "I can give this"}</span>
  );
}

function NeedThis({ alreadyRequested }) {
  return <span>{alreadyRequested ? "requested already!" : "i need this"}</span>;
}
