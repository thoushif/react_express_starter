import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import LinkIcon from "@material-ui/icons/Link";
import { UserContext } from "../UserProvider";
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

export function Connection({ connection }) {
  const getThisConnectionDetail = async (apiUrl) => {
    console.log(apiUrl);
    await axios
      .get(apiUrl)
      .then((response) => response.data)
      .then((data) => {
        setConnectionDetail(data);
      })
      .catch((err) => console.log(err));
  };

  const [connectionDetail, setConnectionDetail] = useState();

  const user = useContext(UserContext);

  useEffect(() => {
    if (connection) {
      if (connection.give_item) {
        getThisConnectionDetail(connection.give_item);
      } else if (connection.ask_item) {
        getThisConnectionDetail(connection.ask_item);
      }
    }
    if (connectionDetail) console.log("connectionDetail", connectionDetail);
  }, []);

  return (
    <>
      <Typography>
        {/* ask item */}
        {connectionDetail && connectionDetail.best_before && (
          <>
            <ConnectionExpansionAskItem
              connectionDetail={connectionDetail}
              connection={connection}
              user={user}
            />
            {/* {connection.source} said ok to <i>{connectionDetail.owner_name},</i>{" "}
            to get help on <b> <b>{connectionDetail.name}</b></b>{" "}
            {connectionDetail.accepted_date} */}
          </>
        )}
        {/* give item */}
        {connectionDetail && connectionDetail.promise_before && (
          <>
            <ConnectionExpansionGiveItem
              connectionDetail={connectionDetail}
              connection={connection}
              user={user}
            />
          </>
        )}
        {/* {connectionDetail && (
        <span>
          You said ok to {connectionDetail.owner_name} to help on{" "}
          <b>{connectionDetail.name}</b> {connectionDetail.accepted_date}
        </span>
      )} */}
        {/* {connectionDetail && connectionDetail.accepted_date === undefined ? (
          <span>- waiting for his Okay</span>
        ) : (
          <span>
            - checked your details, he/she may reach you for further details
          </span>
        )} */}
        {/* {connectionDetail && connectionDetail.name}
      has been promised to be available {
        connectionDetail.promise_before
      } by {connectionDetail.owner_name} */}
        {/* <p>{connection.source}</p>
      <p>{user.uid}</p> */}
        {/* {connectionDetail &&
        connectionDetail.owner_name +
          " said ok to help on " +
          connectionDetail.name +
          "  " +
          connectionDetail.best_before} */}
      </Typography>
    </>
    // <Card className={classes.root}>
    //   <CardContent>
    //     <Typography
    //       className={classes.title}
    //       color="textSecondary"
    //       gutterBottom
    //     >
    //       {/* {name, created_date, updated_date, best_before, active, notes}  */}
    //     </Typography>
    //     {/* <Typography variant="h5" component="h2">
    //       {connection.source}
    //     </Typography> */}
    //     {/* ask owner name requested to connect to give owner name to help on "item title"  */}
    //     <Typography className={classes.pos} color="textSecondary">
    //       ask owner name requested to connect to give owner name to help on
    //       "item title"
    //     </Typography>
    //     <Typography className={classes.pos} color="textSecondary">
    //       {connection.give_item} {connection.ask_item}
    //     </Typography>
    //     <Typography variant="body2">
    //       <Typography variant="body2"> {connection.created_date}</Typography>
    //       <Typography variant="body2"> {connection.accepted_date}</Typography>
    //       <Typography variant="body2">
    //         {connection.progress_start_date}
    //       </Typography>
    //       <Typography variant="body2">{connection.close_start_date}</Typography>
    //       <Typography variant="body2"> {connection.close_end_date}</Typography>
    //     </Typography>
    //   </CardContent>
    //   <CardActions className={classes.toright}>
    //     {connection.owner_name &&
    //       connection.owner_name.trim().length > 0 &&
    //       " by "}
    //     {connection.owner === user.uid ? "You " : connection.owner_name}
    //     <Button size="small">Agree</Button>
    //   </CardActions>
    // </Card>
  );
}
const baseUrl = "http://localhost:8000";

function ConnectionExpansionAskItem({ connectionDetail, connection, user }) {
  const [sourceName, setSourceName] = useState("");
  const handleShowDetails = () => {
    console.log("clicked on showing my detaials");
  };
  const getConnectionSourcename = async () => {
    let apiUrl = `${baseUrl}/helpers/?user_id=${connection.source}`;
    console.log(apiUrl);
    await axios
      .get(apiUrl)
      .then((response) => response.data)
      .then((data) => {
        console.log("dataaaaaaaaaaa", data);
        setSourceName(data.results[0].display_name);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getConnectionSourcename();
  }, []);
  return (
    <>
      {/* User: {user.uid}
      <br />
      Give item Request by {connection.source}
      <br />
      Give items owner {connectionDetail.owner}
      <br />
      Give item owner accepted? <br />
      {connection.accepted_date === null
        ? "no"
        : "yes>" + connection.accepted_date + "<"}
      <br /> */}
      {user.uid !== connection.source && user.uid === connectionDetail.owner && (
        <div>
          <i>{sourceName}</i> can give you the <b>{connectionDetail.name}</b>,
          these are the details you can contact with..
          <Button
            color="primary"
            variant="contained"
            size="small"
            onClick={handleShowDetails}
          >
            Show details
          </Button>{" "}
        </div>
      )}
    </>
  );
}
function ConnectionExpansionGiveItem({ connectionDetail, connection, user }) {
  const handleShareDetails = async () => {
    console.log("clicked on share my detaials");
    const result = window.confirm(
      "Are you sure you want to share your details to '" +
        connection.source +
        "' ?"
    );
    const apiUrl = connection.url;
    if (result) {
      await axios
        .patch(apiUrl, { accepted_date: new Date() })
        .then((response) => response.data)
        .then((data) => {
          console.log(
            data,
            " >>>>>>>>>>>updated acceptance data (ok to share details)"
          );
        })
        .catch((err) => console.log(err));
    }
  };
  const handleShowDetails = () => {
    console.log("clicked on showing my detaials");
  };

  const [sourceName, setSourceName] = useState("");
  const [itemOwnerName, setItemOwnerName] = useState("");

  const getUserSourceDisplayName = async () => {
    let apiUrl = `${baseUrl}/helpers/?user_id=${connection.source}`;
    console.log(apiUrl);
    await axios
      .get(apiUrl)
      .then((response) => response.data)
      .then((data) => {
        console.log("dataaaaaaaaaaa", data);
        setSourceName(data.results[0].display_name);
      })
      .catch((err) => console.log(err));
  };
  const getUserItemOwnerDisplayName = async () => {
    let apiUrl = `${baseUrl}/helpers/?user_id=${connectionDetail.owner}`;
    console.log(apiUrl);
    await axios
      .get(apiUrl)
      .then((response) => response.data)
      .then((data) => {
        console.log("dataaaaaaaaaaa", data);
        setItemOwnerName(data.results[0].display_name);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getUserSourceDisplayName();
    getUserItemOwnerDisplayName();
  }, []);

  return (
    <>
      {/* User: {user.uid}
      <br />
      Give item Request by {connection.source}
      <br />
      Give items owner {connectionDetail.owner}
      <br />
      Give item owner accepted? <br />
      {connection.accepted_date === null
        ? "no"
        : "yes>" + connection.accepted_date + "<"}
      <br /> */}
      {user.uid !== connection.source &&
        user.uid === connectionDetail.owner &&
        connection.accepted_date === null && (
          <div>
            <i>{sourceName}</i> asked <b>{connectionDetail.name}</b> that you
            added. click here if you are ok to share your details to contact{" "}
            <Button
              color="primary"
              variant="contained"
              size="small"
              onClick={handleShareDetails}
            >
              share my details
            </Button>
          </div>
        )}
      {user.uid !== connection.source &&
        user.uid === connectionDetail.owner &&
        connection.accepted_date !== null && (
          <div>
            <i>{sourceName}</i> asked <b>{connectionDetail.name}</b> that you
            added. You have shared your details already, expect a communication
            from <i>{sourceName}</i>
          </div>
        )}
      {/* 		 user asked for someones give item, checked for acceptance data - if true show details of user
       */}
      {user.uid === connection.source &&
        user.uid !== connectionDetail.owner &&
        connection.accepted_date !== null && (
          <div>
            You asked for <b>{connectionDetail.name}</b>.{itemOwnerName} shared
            the details to connect..
            <Button
              color="primary"
              variant="contained"
              size="small"
              onClick={handleShowDetails}
            >
              Show details
            </Button>
          </div>
        )}
      {user.uid === connection.source &&
        user.uid !== connectionDetail.owner &&
        connection.accepted_date === null && (
          <div>
            You asked for <b>{connectionDetail.name}</b>, waiting for{" "}
            {itemOwnerName} to share the details to connect (
            {connection.created_date})
          </div>
        )}
    </>
  );
}
