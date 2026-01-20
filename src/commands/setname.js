export const command = async (ctx, vk, db, { lowerText, isAdmin, getTargetUserId }) => {
  if (!lowerText.startsWith('/setname')) return false;
  if (!ctx.isChat) { await ctx.send('Только в беседах'); return true; }
  if (!isAdmin) { await ctx.send('Только админы'); return true; }

  const targetId = await getTargetUserId(ctx, vk);
  if (!targetId) {
    await ctx.send('Укажите пользователя: @id... или ответьте');
    return true;
  }

  const match = ctx.text.match(/\/setname\s+(.+)$/i);
  if (!match) { await ctx.send('Использование: /setname @id... НовыйНик'); return true; }

  const nick = match[1].trim();

  try {
    await db.run(`INSERT OR REPLACE INTO nicks (chat_id, user_id, nick) VALUES (?,?,?)`, [ctx.chatId, targetId, nick]);
    await ctx.send(`Ник для [id${targetId}| ] установлен: ${nick}`);
  } catch (e) {
    await ctx.send(`Ошибка: ${e.message}`);
  }
  return true;
};