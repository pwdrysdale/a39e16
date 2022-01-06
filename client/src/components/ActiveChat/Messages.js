import React, { useCallback, useMemo } from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  const sortMessages = useCallback((msgs) => {
    if (!msgs) return [];
    if (msgs.length === 0) return msgs;
    return msgs.sort((a, b) => {
      return a.createdAt.valueOf() === b.createdAt.valueOf()
        ? 0
        : a.createdAt.valueOf() > b.createdAt.valueOf()
        ? 1
        : -1;
    });
  }, []);

  const sortedMessages = useMemo(
    () => sortMessages(messages),
    [messages, sortMessages]
  );

  // setup for the read message flag
  // from the sorted message, get the id of the last read message where the user id is otherUsers id
  const lastReadMessage = useMemo(() => {
    const filteredMessages = sortedMessages.filter(
      (message) => message.senderId !== otherUser.id && message.read
    );
    const lastMessage = filteredMessages[filteredMessages.length - 1];
    return lastMessage ? lastMessage.id : null;
  }, [sortedMessages, otherUser]);

  // render the messages
  const renderedMessages = useMemo(() => {
    return sortedMessages.map((message, idx) => {
      const time = moment(message.createdAt).format("h:mm");

      return message.senderId === userId ? (
        <SenderBubble
          key={idx}
          text={message.text}
          time={time}
          otherUser={otherUser}
          readImg={lastReadMessage === message.id ? true : false}
        />
      ) : (
        <OtherUserBubble
          key={idx}
          text={message.text}
          time={time}
          otherUser={otherUser}
        />
      );
    });
  }, [sortedMessages, otherUser, userId, lastReadMessage]);

  return <Box>{renderedMessages}</Box>;
};

export default Messages;
