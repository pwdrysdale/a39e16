import React, { useMemo, useCallback } from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Search, Chat, CurrentUser } from "./index.js";

const useStyles = makeStyles(() => ({
  root: {
    paddingLeft: 21,
    paddingRight: 21,
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    letterSpacing: -0.29,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 15,
  },
}));

const Sidebar = (props) => {
  const classes = useStyles();
  const conversations = useMemo(
    () => props.conversations || [],
    [props.conversations]
  );
  const { handleChange, searchTerm } = props;

  const filterConversations = useCallback(
    (conversations) => {
      return conversations.filter((conversation) => {
        const { otherUser } = conversation;
        const { username } = otherUser;
        return username.toLowerCase().includes(searchTerm.toLowerCase());
      });
    },
    [searchTerm]
  );

  const filteredConversations = useMemo(
    () => filterConversations(conversations),
    [conversations, filterConversations]
  );

  const renderConversations = useMemo(() => {
    return filteredConversations.map((conversation) => {
      return <Chat key={conversation.id} conversation={conversation} />;
    });
  }, [filteredConversations]);

  return (
    <Box className={classes.root}>
      <CurrentUser />
      <Typography className={classes.title}>Chats</Typography>
      <Search handleChange={handleChange} />
      {renderConversations}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    conversations: state.conversations,
  };
};

export default connect(mapStateToProps)(Sidebar);
