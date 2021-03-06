import React, { useCallback } from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { connect } from "react-redux";
import { setActiveChatWRead } from "../../store/utils/thunkCreators";
import { markConversationRead } from "../../store/utils/reducerFunctions";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab",
    },
  },
}));

const Chat = (props) => {
  const classes = useStyles();
  const { conversation } = props;
  const { otherUser } = conversation;

  const handleClick = useCallback(
    async (conversation) => {
      const body = {
        conversationId: conversation.id || null,
        userId: conversation.otherUser.id,
        username: conversation.otherUser.username,
        unreadMessages: 0,
      };
      setActiveChatWRead(body)(props.dispatch);
    },
    [props.dispatch]
  );

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
    markConversationRead: (conversationId, userId) => {
      dispatch(markConversationRead(conversationId, userId));
    },
  };
};

export default connect(mapDispatchToProps)(Chat);
