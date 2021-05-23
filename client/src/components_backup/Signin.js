import { Typography, Button } from "@material-ui/core";
import { signInWithGoogle } from "../config/firebase";

export const Signin = () => {
  return (
    <div>
      <div>
        <Typography variant="h4">You need to sign in to do that!</Typography>

        <Button
          color="primary"
          variant="contained"
          type="submit"
          onClick={signInWithGoogle}
        >
          Sign In with Google
        </Button>
      </div>
    </div>
  );
};
