export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  // Most of the Bug fix: Sending messages #1 ticket issues were here (in this function),
  // to do with mutating the state.

  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      unreadMessages: 0,
      latestMessageText: message.text,
    };
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (message.conversationId && convo.id === message.conversationId) {
      const newConvo = {
        ...convo,
        messages: [...convo.messages, message],
        latestMessageText: message.text,
      };
      return newConvo;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser = { ...convoCopy.otherUser, online: true };
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser = { ...convoCopy.otherUser, online: false };
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const newConvo = {
        ...convo,
        id: message.conversationId,
        messages: [...convo.messages, message],
        latestMessageText: message.text,
      };

      return newConvo;
    } else {
      return convo;
    }
  });
};

// mark conversations as read
// note that the userId argument is the current user's id (not the one
// who's messages we are marking as read)
export const markConversationRead = (state, conversationId, userId) => {
  const newConversations = state.map((conversation) => {
    if (conversation.id === conversationId) {
      return {
        ...conversation,
        unreadMessages: 0,
        messages: conversation.messages.map((message) => {
          if (message.senderId === userId) {
            return {
              ...message,
              read: true,
            };
          } else return message;
        }),
      };
    } else return conversation;
  });
  return newConversations;
};

export const addUnreadToConversation = (state, { conversationId }) => {
  const newConversations = state.map((conversation) => {
    if (conversation.id === conversationId) {
      return {
        ...conversation,
        unreadMessages: conversation.unreadMessages + 1,
      };
    } else return conversation;
  });
  return newConversations;
};
