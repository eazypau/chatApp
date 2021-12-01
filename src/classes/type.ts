type userObj = {
  id: string;
  name: string;
  email: string;
  photo: string;
  chatGroupIds: string[];
};

type contactsObj = {
  name: string;
  email: string;
  id: string;
  photo: string;
  docId: string;
};

type messageObj = {
  sendBy: string;
  senderName: string;
  sentAt: Date;
  text: string;
};

type currentChatObj = {
  createdAt: Date;
  createdBy: string;
  id: string;
  members: string[];
  recentMessage: {
    messageText: string;
    sendBy: string;
    senderName: string;
    sentAt: Date;
  };
  type: string;
};
export { userObj, messageObj, contactsObj, currentChatObj };
