type userObj = {
  id: string;
  name: string;
  email: string;
  photo: string;
  chatGroupIds: [];
};
type messageObj = {
  name: string;
  text: string;
  timeStamp: string;
};
type contactsObj = {
  name: string;
  email: string;
  id: string;
  photo: string;
  docId: string;
};

export { userObj, messageObj, contactsObj };
