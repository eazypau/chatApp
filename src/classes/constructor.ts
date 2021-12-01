class Profile {
  id: string;
  name: string;
  email: string;
  photo: string;
  chatGroupIds: string[];
  constructor(id: string, name: string, email: string, photo: string, chatGroupIds: string[]) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.photo = photo;
    this.chatGroupIds = chatGroupIds;
  }
}
class Message {
  senderName: string;
  text: string;
  senderId: string;
  chatId: string;

  constructor(senderName: string, text: string, senderId: string, chatId: string) {
    this.senderName = senderName;
    this.text = text;
    this.senderId = senderId;
    this.chatId = chatId;
  }
}

export { Profile, Message };
