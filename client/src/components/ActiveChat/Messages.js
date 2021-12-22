import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
    const { messages, otherUser, userId } = props;

    React.useEffect(() => {
        console.log(userId);
    }, [userId]);

    return (
        <Box>
            {messages
                .sort((a, b) =>
                    new Date(a.updatedAt).valueOf() >
                    new Date(b.updatedAt).valueOf()
                        ? 1
                        : -1
                )
                .map((message, idx) => {
                    const time = moment(message.createdAt).format("h:mm");

                    return message.senderId === userId ? (
                        <SenderBubble
                            key={idx}
                            text={message.text}
                            time={time}
                        />
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
