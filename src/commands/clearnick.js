export const command = async (ctx, vk, db, { lowerText }) => {
  if (lowerText !== '/clearnick' && lowerText !== '/очиститьник') return false;
  if (!ctx.isChat) { await ctx.send('Только в беседах'); return true; }

  await db.run(`DELETE FROM nicks WHERE chat_id = ? AND user_id = ?`, [ctx.chatId, ctx.senderId]);
  await ctx.send('Ник очищен');
  return true;
};