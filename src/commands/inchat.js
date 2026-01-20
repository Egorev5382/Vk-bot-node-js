export const command = async (ctx, vk, db, { lowerText }) => {
  if (!lowerText.startsWith('/inchat')) return false;
  if (!ctx.isChat) { await ctx.send('Только в беседах'); return true; }

  const match = ctx.text.match(/^\/inchat\s+(\d+)$/i);
  if (!match) { await ctx.send('Использование: /inchat <id>'); return true; }

  const uid = Number(match[1]);

  const { items } = await vk.api.messages.getConversationMembers({ peer_id: ctx.peerId });
  const inChat = items.some(m => m.member_id === uid);

  await ctx.send(inChat ? 'Пользователь в чате' : 'Пользователь не в чате');
  return true;
};