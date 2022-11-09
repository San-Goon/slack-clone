import dayjs from 'dayjs';
import { DMType } from '@typings/db';

export default function makeSection(chatList: DMType[]) {
  const sections: { [key: string]: DMType[] } = {};
  chatList.forEach((chat) => {
    const monthDate = dayjs(chat.createdAt).format('YYYY-MM-DD');
    if (Array.isArray(sections[monthDate])) {
      sections[monthDate].push(chat);
    } else {
      sections[monthDate] = [chat];
    }
  });
  return sections;
}
