export const command = async (ctx, vk, db, { lowerText, isAdmin, getTargetUserId }) => {
  if (!lowerText.startsWith('/kick') && !lowerText.startsWith('/кик')) return false;
  if (!ctx.isChat) { await ctx.send('Только в беседах'); return true; }
  if (!isAdmin) { await ctx.send('Только админы'); return true; }

  const targetId = await getTargetUserId(ctx, vk);
  if (!targetId) {
    await ctx.send('Укажите пользователя: @id... или ответьте');
    return true;
  }

  try {
    await vk.api.messages.removeChatUser({ chat_id: ctx.chatId, member_id: targetId });
    await ctx.send(`[id${targetId}| ] кикнут`);
  } catch (e) {
    await ctx.send(`Ошибка: ${e.message}`);
  }
  return true;
};