import React, { useContext } from "react";

import axios from "axios";
import Typography from "@material-ui/core/Typography";
import { UserContext } from "../UserProvider";
import { useAskSwitch } from "../../contexts/AskSwitchContext";

function NeedConfirmation({ item, setRequested, setForceRefresh }) {
  const user = useContext(UserContext);
  const [askSwitch] = useAskSwitch();

  const handleOnNeedOnConfirm = async () => {
    console.log("handling i need this button", item.url, user.uid);

    let addingConnection = {
      source: user.uid,
    };

    if (askSwitch) {
      addingConnection = { ...addingConnection, ask_item: item.url };
    } else {
      addingConnection = { ...addingConnection, give_item: item.url };
    }
    let apiUrl = "http://localhost:8000/itemconnections/";
    await axios
      .post(apiUrl, addingConnection)
      .then((response) => response.data)
      .then((data) => {
        console.log(data, " >>>>>>>>>>>posted");
        setRequested(false);
        setForceRefresh((a) => !a);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <Typography variant="body2">
        This is to confirm, you {!askSwitch ? " need " : " can give "} this!{" "}
      </Typography>
      <Typography variant="caption">
        This will send a request to {item.owner_name}
      </Typography>
      <Typography>
        <button onClick={() => setRequested(false)}>❌</button>
        <button onClick={handleOnNeedOnConfirm}>✔️</button>
      </Typography>
    </div>
  );
}

export default NeedConfirmation;
