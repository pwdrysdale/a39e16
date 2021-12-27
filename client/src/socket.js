import axios from "axios";
import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
} from "./store/conversations";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message", (data) => {
    // check to see if the current conversation is the one to which
    // the new message belongs. If it is, we mark it as read both
    // locally and on the server, otherwise we just add the message
    // note the display logic takes care of our own messages
    const state = store.getState();

    const conversationPartner = state.activeConversation;
    const currentConvo = state.conversations.find(
      (conversation) => conversation.otherUser.username === conversationPartner
    );

    // if the current conversation is the one to which the new message belongs
    if (
      currentConvo &&
      currentConvo.id &&
      data.message.conversationId === currentConvo.id
    ) {
      axios.post(`/api/messages/read/${data.message.id}`);
      store.dispatch(
        setNewMessage({ ...data.message, read: true }, data.sender)
      );
      // if the current conversation is not the one to which the new message belongs
    } else {
      store.dispatch(setNewMessage(data.message, data.sender));
    }
  });
});

export default socket;
