export const command = async (ctx, vk, db, { lowerText }) => {
  if (lowerText !== '/chat') return false;
  if (!ctx.isChat) { await ctx.send('Только в беседах'); return true; }

  const row = await db.get(`SELECT vid FROM settings WHERE chat_id = ?`, [ctx.chatId]);
  await ctx.send(`VID чата: ${row?.vid ?? 'не установлен'}`);
  return true;
};