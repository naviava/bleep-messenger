import { fetchRedis } from "@/utils/redis";
import { messageArrayValidator } from "./validations/message";

export default async function getChatMessages(chatId: string) {
  try {
    const result: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    );

    const dbMessages = result.map((message) => JSON.parse(message) as Message);
    const reversedDbMessages = dbMessages.reverse();
    const messages = messageArrayValidator.parse(reversedDbMessages);

    return messages;
  } catch (err: any) {
    throw new Error(err);
  }
}
