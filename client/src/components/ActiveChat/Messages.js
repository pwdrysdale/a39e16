import React, { useEffect } from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;
  const [sortedMessages, setSortedMessages] = React.useState([]);

  console.log(messages);

  useEffect(() => {
    if (messages) {
      const sortedMessages = [...messages].sort((a, b) => {
        if (a.createdAt.valueOf() < b.createdAt.valueOf()) {
          return -1;
        }
        if (a.createdAt.valueOf() > b.createdAt.valueOf()) {
          return 1;
        }
        return 0;
      });
      setSortedMessages(sortedMessages);
    }
    console.log(messages);
  }, [messages]);

  return (
    <Box>
      {sortedMessages.map((message, idx) => {
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
      })}
    </Box>
  );
};

export default Messages;
