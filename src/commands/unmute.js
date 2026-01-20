export const command = async (ctx, vk, db, { lowerText, isAdmin, getTargetUserId }) => {
  if (!lowerText.startsWith('/unmute') && !lowerText.startsWith('/размут')) return false;
  if (!ctx.isChat) { await ctx.send('Только в беседах'); return true; }
  if (!isAdmin) { await ctx.send('Только админы'); return true; }

  const targetId = await getTargetUserId(ctx, vk);
  if (!targetId) {
    await ctx.send('Укажите пользователя: @id... или ответьте');
    return true;
  }

  await db.run(
    `UPDATE punishes SET active = 0 WHERE chat_id = ? AND user_id = ? AND type = 'mute'`,
    [ctx.chatId, targetId]
  );

  await ctx.send(`[id${targetId}| ] размучен`);
  return true;
};