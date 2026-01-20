export const command = async (ctx, vk, db, { lowerText, isAdmin, getTargetUserId }) => {
  if (!lowerText.startsWith('/mute') && !lowerText.startsWith('/мут')) return false;
  if (!ctx.isChat) { await ctx.send('Только в беседах'); return true; }
  if (!isAdmin) { await ctx.send('Только админы'); return true; }

  const targetId = await getTargetUserId(ctx, vk);
  if (!targetId) {
    await ctx.send('Укажите пользователя: @id... или ответьте');
    return true;
  }

  const match = ctx.text.match(/\s+(\d+)(?:\s+(.+))?$/i);
  if (!match) {
    await ctx.send('Использование: /mute @id... 30 [причина]');
    return true;
  }

  const minutes = Number(match[1]);
  const reason = match[2] || 'Без причины';
  const until = Math.floor(Date.now() / 1000) + minutes * 60;

  try {
    await db.run(
      `INSERT INTO punishes (chat_id, user_id, type, reason, until, active) VALUES (?,?,?,?,?,1)`,
      [ctx.chatId, targetId, 'mute', reason, until]
    );
    await ctx.send(`[id${targetId}| ] замучен на ${minutes} мин. Причина: ${reason}`);
  } catch (e) {
    await ctx.send(`Ошибка: ${e.message}`);
  }
  return true;
};