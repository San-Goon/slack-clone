import dayjs from 'dayjs';
import { ChatType, DMType } from '@typings/db';

export default function makeSection(chatList: (DMType | ChatType)[]) {
  const sections: { [key: string]: (DMType | ChatType)[] } = {};
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
