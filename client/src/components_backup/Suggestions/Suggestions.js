import { Grid, fade, makeStyles, Paper } from "@material-ui/core";
import Item from "../Items/Item";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
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
}));

export const Suggestions1 = ({ giveItemList, askSwitch }) => {
  const classes = useStyles();

  return (
    <Paper className={!askSwitch ? classes.paperAsk : classes.paper}>
      {!askSwitch ? "Showing G's Suggestions" : "Showing A's Suggestions"}

      <Grid
        container
        spacing={2}
        direction="column"
        // alignItems="center"
        // justify="center"
        // style={{ minHeight: "100vh" }}
      >
        {giveItemList &&
          giveItemList.map((item) => (
            <Grid item xs>
              <Item key={item.id} item={item} />{" "}
            </Grid>
          ))}
      </Grid>
    </Paper>
  );
};
