'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useUserStore } from '@/features/user/store/user.store';
import { useMessagesStore } from '@/features/messages/store/messages.store';
import { Send, ChevronUp } from 'lucide-react';

export default function DmChatPage() {
  const { userId } = useParams<{ userId: string }>();
  const currentUser = useUserStore((s) => s.currentUser);
  const { messages, fetchMessages, sendMessage, loadMore, hasMore } = useMessagesStore();
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser) {
      useMessagesStore.getState().reset();
      fetchMessages({ senderId: currentUser.id, receiverId: userId });
    }
  }, [currentUser, userId, fetchMessages]);

  useEffect(() => { bottomRef.current?.scrollIntoView(); }, [messages]);

  const handleSend = () => {
    if (!currentUser || !text.trim()) return;
    sendMessage({
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      senderId: currentUser.id,
      receiverId: userId,
      groupId: null,
      content: text.trim(),
      createdAt: Date.now(),
    });
    setText('');
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col h-full px-6 py-8 mt-20">
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {hasMore && messages.length > 0 && (
          <button onClick={() => loadMore({ senderId: currentUser?.id, receiverId: userId, before: messages[0].createdAt })}
            className="flex items-center gap-1 mx-auto text-xs text-[#CB6CE6] font-semibold">
            <ChevronUp size={14} /> See more messages
          </button>
        )}
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] px-3 py-2 text-sm ${m.senderId === currentUser?.id ? 'bg-[#CB6CE6] text-white' : 'bg-zinc-100 text-zinc-800'}`}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2 border-t border-[#CB6CE6]/10 pt-3">
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="flex-1 border border-zinc-200 bg-white/80 px-3 py-2 text-sm text-zinc-700 outline-none focus:border-[#CB6CE6]" />
        <button onClick={handleSend} className="bg-[#CB6CE6] px-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-[#b055d4] transition-all"><Send size={16} /></button>
      </div>
    </div>
  );
}
