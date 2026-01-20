export const command = async (ctx, vk, db, { lowerText, isAdmin, getTargetUserId }) => {
  if (!lowerText.startsWith('/ban') && !lowerText.startsWith('/бан')) return false;
  if (!ctx.isChat) { await ctx.send('Только в беседах'); return true; }
  if (!isAdmin) { await ctx.send('Только админы'); return true; }

  const targetId = await getTargetUserId(ctx, vk);
  if (!targetId) {
    await ctx.send('Укажите пользователя: @id... или ответьте на сообщение');
    return true;
  }

  const reasonMatch = ctx.text.match(/\/(?:ban|бан)\s*(.+)?$/i);
  const reason = reasonMatch?.[1]?.trim() || 'Без причины';

  try {
    await vk.api.messages.removeChatUser({ chat_id: ctx.chatId, member_id: targetId });
    await db.run(
      `INSERT INTO punishes (chat_id, user_id, type, reason, until, active) VALUES (?,?,?,?,0,1)`,
      [ctx.chatId, targetId, 'ban', reason]
    );
    await ctx.send(`[id${targetId}| ] забанен. Причина: ${reason}`);
  } catch (e) {
    await ctx.send(`Ошибка: ${e.message}`);
  }
  return true;
};