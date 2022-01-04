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
      return a.createdAt.valueOf() - b.createdAt.valueOf() ? 1 : -1;
    });
  }, []);

  const sortedMessages = useMemo(
    () => sortMessages(messages),
    [messages, sortMessages]
  );

  const renderedMessages = useMemo(() => {
    return sortedMessages.map((message, idx) => {
      const time = moment(message.createdAt).format("h:mm");

      return message.senderId === userId ? (
        <SenderBubble key={idx} text={message.text} time={time} />
      ) : (
        <OtherUserBubble
          key={idx}
          text={message.text}
          time={time}
          otherUser={otherUser}
        />
      );
    });
  }, [sortedMessages, otherUser, userId]);

  return <Box>{renderedMessages}</Box>;
};

export default Messages;
