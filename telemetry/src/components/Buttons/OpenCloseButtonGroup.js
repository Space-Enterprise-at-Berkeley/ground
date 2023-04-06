import React from "react";
import {
  ButtonGroup as MaterialButtonGroup,
  Button,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  openButton: {
    backgroundColor: theme.palette.success.main + " !important",
    color: "#fff" + " !important",
    transition: "none",
	borderRadius: "1em",
	fontWeight: "800"
  },
  openButtonOutline: {
    color: theme.palette.success.main + " !important",
    border: "1px solid " + theme.palette.success.main + " !important",
    transition: "none",
	  borderRadius: "1em",
  },
  closedButton: {
    backgroundColor: theme.palette.error.main + " !important",
    color: theme.palette.error.contrastText + " !important",
    transition: "none",
	borderRadius: "1em",
	fontWeight: "800"
  },
  closedButtonOutline: {
    color: theme.palette.error.main + " !important",
    border: "1px solid " + theme.palette.error.main + " !important",
    transition: "none",
	  borderRadius: "1em",
  },
  openStatusBox: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.success.main,
  },
  closedStatusBox: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.error.main,
  },
}));

export default function OpenCloseButtonGroup({
  isOpen,
  setClosed,
  setOpen,
  ...props
}) {
  const classes = useStyles();
  return (
    <div>
      <Button
        color="primary"
        variant="text"
        className={isOpen ? classes.closedButtonOutline : classes.closedButton}
        onClick={setClosed}
        disabled={props.ereg ? (props.disabled || false) : false}
        disableRipple
        size="small"
      >
        {props.ereg ? "O-Reg" : (props.failText || "Close")}
      </Button>
      <Button
        color="primary"
        variant="text"
        className={isOpen ? classes.openButton : classes.openButtonOutline}
        onClick={setOpen}
        disabled={props.disabled || false}
        disableRipple
        size="small"
      >
        {props.ereg ? "F-Reg" : (props.successText || "Open")}
      </Button>
    </div>
  );
}
