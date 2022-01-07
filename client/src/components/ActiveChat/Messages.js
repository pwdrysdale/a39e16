import React, { useMemo } from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  const renderedMessages = useMemo(() => {
    return messages.map((message, idx) => {
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
  }, [messages, otherUser, userId]);

  return <Box>{renderedMessages}</Box>;
};

export default Messages;
