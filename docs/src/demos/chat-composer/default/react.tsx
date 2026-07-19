import { useState } from 'react';
import { ChatComposer, ChatComposerInput, ChatSendButton } from '@var-ui/react';

export default function Preview() {
  const [value, setValue] = useState('');

  return (
    <ChatComposer actions={<ChatSendButton onPress={() => setValue('')} />}>
      <ChatComposerInput
        value={value}
        onChange={setValue}
        onSubmit={() => setValue('')}
        placeholder="Type a message…"
      />
    </ChatComposer>
  );
}
