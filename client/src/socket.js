import io from "socket.io-client";
import store from "./store";
import { removeOfflineUser, addOnlineUser } from "./store/conversations";
import { newMessage } from "./store/utils/thunkCreators";

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
    newMessage(data)(store.dispatch);
  });
});

export default socket;
