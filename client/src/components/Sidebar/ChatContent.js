import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { clearOnLogout } from "../../store";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  previewTextUnread: {
    fontSize: 12,
    color: "#000",
    letterSpacing: -0.17,
    fontWeight: "heavy",
  },
  unreadPill: {
    height: "20px",
    padding: "0px 10px",
    borderRadius: "50px",
    marginRight: 5,
    backgroundColor: "#3F92FF",
    color: "white",
    fontWeight: 900,
  },
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation } = props;
  const { latestMessageText, otherUser } = conversation;

  clearOnLogout(otherUser);

  const unreadMessages = React.useMemo(
    () =>
      conversation.messages.reduce(
        (acc, msg) =>
          msg.senderId === otherUser.id && msg.read === false ? acc + 1 : acc,
        0
      ),
    [conversation.messages, otherUser]
  );

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography
          className={
            unreadMessages === 0
              ? classes.previewText
              : classes.previewTextUnread
          }
        >
          {latestMessageText}
        </Typography>
      </Box>
      {unreadMessages > 0 && (
        <Box className={classes.unreadPill}>{unreadMessages}</Box>
      )}
    </Box>
  );
};

export default ChatContent;
