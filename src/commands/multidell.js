export const command = async (ctx, vk, db, { lowerText, isAdmin }) => {
  if (!lowerText.startsWith('/multidell') && !lowerText.startsWith('/масудалить')) return false;
  if (!ctx.isChat) { await ctx.send('Только в беседах'); return true; }
  if (!isAdmin) { await ctx.send('Только админы'); return true; }

  const match = ctx.text.match(/^\/multidell\s+(\d+)$/i);
  if (!match) { await ctx.send('Использование: /multidell <количество>'); return true; }

  const count = Math.min(Number(match[1]), 200);

  try {
    const { items } = await vk.api.messages.getHistory({ peer_id: ctx.peerId, count });
    const ids = items.map(m => m.id).join(',');
    await vk.api.messages.delete({ message_ids: ids, delete_for_all: 1 });
    await ctx.send(`Удалено ${items.length} сообщений`);
  } catch (e) {
    await ctx.send('Ошибка');
  }
  return true;
};