import { createContext, useContext } from 'react';

export type ChatSender = 'user' | 'assistant';
export type ChatDensity = 'compact' | 'balanced' | 'spacious';

export type ChatListContextValue = { density: ChatDensity };

export const ChatListContext = createContext<ChatListContextValue | null>(null);

/** Density set by an ancestor `ChatMessageList`, or `null` outside one. */
export function useChatListContext(): ChatListContextValue | null {
  return useContext(ChatListContext);
}

export type ChatMessageContextValue = { sender: ChatSender; density: ChatDensity };

export const ChatMessageContext = createContext<ChatMessageContextValue | null>(null);

/** Sender + density set by an ancestor `ChatMessage`, or `null` outside one. */
export function useChatMessageContext(): ChatMessageContextValue | null {
  return useContext(ChatMessageContext);
}
