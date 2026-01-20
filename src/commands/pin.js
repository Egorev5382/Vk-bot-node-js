export const command = async (ctx, vk, db, { lowerText }) => {
  if (lowerText !== '/pin' && lowerText !== '/закрепить') return false;
  if (!ctx.isChat) { await ctx.send('Только в беседах'); return true; }

  const id = ctx.replyMessage?.id;
  if (!id) { await ctx.send('Ответьте на сообщение'); return true; }

  try {
    await vk.api.messages.pin({ peer_id: ctx.peerId, message_id: id });
    await ctx.send('Сообщение закреплено');
  } catch {
    await ctx.send('Не удалось закрепить');
  }
  return true;
};