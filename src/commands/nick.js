export const command = async (ctx, vk, db, { lowerText }) => {
  if (!lowerText.startsWith('/nick') && !lowerText.startsWith('/ник')) return false;
  if (!ctx.isChat) { await ctx.send('Только в беседах'); return true; }

  const match = ctx.text.match(/^\/(?:nick|ник)\s+(.+)$/i);
  if (!match) { await ctx.send('Использование: /nick <ваш ник>'); return true; }

  const nick = match[1].trim();

  try {
    await db.run(`INSERT OR REPLACE INTO nicks (chat_id, user_id, nick) VALUES (?,?,?)`, [ctx.chatId, ctx.senderId, nick]);
    await ctx.send(`Ник установлен: ${nick}`);
  } catch (e) {
    await ctx.send(`Ошибка: ${e.message}`);
  }
  return true;
};