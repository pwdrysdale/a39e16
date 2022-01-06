import axios from "axios";
import store from "..";
import socket from "../../socket";
import { setActiveChat } from "../activeConversation";
import {
  gotConversations,
  addConversation,
  setNewMessage,
  setSearchedUsers,
  markConversationAsRead,
  addToConversationUnreadCount,
  otherReadConvo,
} from "../conversations";
import { gotUser, setFetchingStatus } from "../user";

axios.interceptors.request.use(async function (config) {
  const token = await localStorage.getItem("messenger-token");
  config.headers["x-access-token"] = token;

  return config;
});

// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await axios.get("/auth/user");
    dispatch(gotUser(data));
    if (data.id) {
      socket.emit("go-online", data.id);
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

export const register = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/register", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/login", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const logout = (id) => async (dispatch) => {
  try {
    await axios.delete("/auth/logout");
    await localStorage.removeItem("messenger-token");
    dispatch(gotUser({}));
    socket.emit("logout", id);
  } catch (error) {
    console.error(error);
  }
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/conversations");
    const withUnreadCount = data.map((conversation) => {
      const unreadMessages = conversation.messages.filter(
        (message) =>
          !message.read && conversation.otherUser.id === message.senderId
      ).length;
      return { ...conversation, unreadMessages };
    });

    dispatch(gotConversations(withUnreadCount));
  } catch (error) {
    console.error(error);
  }
};

const saveMessage = async (body) => {
  const { data } = await axios.post("/api/messages", body);
  return data;
};

const sendMessage = (data, body) => {
  socket.emit("new-message", {
    message: data.message,
    recipientId: body.recipientId,
    sender: data.sender,
  });
};

// message format to send: {recipientId, text, conversationId}
// conversationId will be set to null if its a brand new conversation
export const postMessage = (body) => async (dispatch) => {
  try {
    const data = await saveMessage(body);
    if (!body.conversationId) {
      dispatch(addConversation(body.recipientId, data.message));
    } else {
      dispatch(setNewMessage(data.message));
    }

    sendMessage(data, body);
  } catch (error) {
    console.error(error);
  }
};

export const searchUsers = (searchTerm) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/users/${searchTerm}`);
    dispatch(setSearchedUsers(data));
  } catch (error) {
    console.error(error);
  }
};

export const setActiveChatWRead = (body) => async (dispatch) => {
  try {
    const { conversationId, userId, username } = body;
    if (conversationId) {
      await axios.put(`/api/conversations`, { id: conversationId });
    }
    socket.emit("conversation-read", { conversationId, userId });

    dispatch(setActiveChat(username));
    dispatch(markConversationAsRead(conversationId, userId));
  } catch (error) {
    console.error(error);
  }
};

// thunk creator for when a user reads a conversation
// going through the socket
export const othersRead = (body) => async (dispatch) => {
  try {
    const userId = store.getState().user.id;

    const { conversationId } = body;

    dispatch(otherReadConvo({ conversationId, userId }));
  } catch (error) {
    console.error(error);
  }
};

// handler for a new message coming in from the socket
export const newMessage = (body) => async () => {
  const state = store.getState();
  // current conversation partner from the store
  const conversationPartner = state.activeConversation;

  // current conversation
  const currentConvo = state.conversations.find(
    (conversation) => conversation.otherUser.username === conversationPartner
  );

  const { message, sender } = body;

  // if the current conversation is the one to which the new message belongs
  if (
    currentConvo &&
    currentConvo.id &&
    body.message.conversationId === currentConvo.id
  ) {
    if (message.conversationId !== null) {
      axios.put(`/api/conversations`, { id: message.conversationId });
    }
    store.dispatch(setNewMessage({ ...message, read: true }, sender));

    socket.emit("conversation-read", {
      conversationId: message.conversationId,
      userId: state.user.id,
    });

    // if the current conversation is not the one to which the new message belongs
  } else {
    store.dispatch(setNewMessage(message, sender));
    store.dispatch(addToConversationUnreadCount(message.conversationId));
  }
};
