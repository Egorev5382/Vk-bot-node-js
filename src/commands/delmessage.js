export const command = async (ctx, vk, db, { lowerText }) => {
  if (lowerText !== '/delmessage' && lowerText !== '/удали' && lowerText !== '/удалить') return false;
  if (!ctx.isChat) { await ctx.send('Только в беседах'); return true; }

  const id = ctx.replyMessage?.id;
  if (!id) { await ctx.send('Ответьте на сообщение'); return true; }

  try {
    await vk.api.messages.delete({ message_ids: id, delete_for_all: 1 });
    await ctx.send('Сообщение удалено');
  } catch {
    await ctx.send('Не удалось удалить');
  }
  return true;
};