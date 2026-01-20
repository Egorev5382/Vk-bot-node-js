export const command = async (ctx, vk, db, { lowerText, isAdmin, getTargetUserId }) => {
  if (!lowerText.startsWith('/unban') && !lowerText.startsWith('/разбан')) return false;
  if (!ctx.isChat) { await ctx.send('Только в беседах'); return true; }
  if (!isAdmin) { await ctx.send('Только админы'); return true; }

  const targetId = await getTargetUserId(ctx, vk);
  if (!targetId) {
    await ctx.send('Укажите пользователя: @id... или ответьте');
    return true;
  }

  await db.run(
    `UPDATE punishes SET active = 0 WHERE chat_id = ? AND user_id = ? AND type = 'ban'`,
    [ctx.chatId, targetId]
  );

  try {
    await vk.api.messages.addChatUser({ chat_id: ctx.chatId, user_id: targetId });
    await ctx.send(`[id${targetId}| ] разбанен и приглашён`);
  } catch {
    await ctx.send(`[id${targetId}| ] разбанен (пригласите вручную)`);
  }
  return true;
};