import { reactive } from "@vue/reactivity";

let chatList = reactive([
  {
    name: "Lisa",
    lastMessage: "Lets meet up on...",
    chatId: "iyerh8735t-w98ghwqg9-w90f8hj",
  },
  {
    name: "Alex",
    lastMessage: "Lets meet up on...",
    chatId: "34f4t3t-31fg34t-42gh65y",
  },
]);

let chatContent = reactive([
  {
    id: "iyerh8735t-w98ghwqg9-w90f8hj",
    messages: [
      {
        name: "Mona",
        message: "hello",
        timeStamp: "2021-11-04T09:10",
      },
      {
        name: "Lisa",
        message: "hey",
        timeStamp: "2021-11-04T09:10",
      },
      {
        name: "Mona",
        message: "how are you",
        timeStamp: "2021-11-04T09:10",
      },
      {
        name: "Lisa",
        message: "good, hbu?",
        timeStamp: "2021-11-04T09:10",
      },
      {
        name: "Mona",
        message: "great",
        timeStamp: "2021-11-04T09:10",
      },
    ],
  },
  {
    id: "34f4t3t-31fg34t-42gh65y",
    messages: [
      {
        name: "Mona",
        message: "hell0",
        timeStamp: "2021-11-04T09:10",
      },
      {
        name: "Alex",
        message: "hey",
        timeStamp: "2021-11-04T09:10",
      },
      {
        name: "Mona",
        message: "how are you",
        timeStamp: "2021-11-04T09:10",
      },
      {
        name: "Alex",
        message: "good, hbu?",
        timeStamp: "2021-11-04T09:10",
      },
      {
        name: "Mona",
        message: "great",
        timeStamp: "2021-11-04T09:10",
      },
    ],
  },
]);

export default () => {
  const currentUserName = "Mona"
  return { chatList, chatContent, currentUserName };
};
