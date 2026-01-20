export const command = async (ctx, vk, db, { lowerText, isAdmin }) => {
  if (!lowerText.startsWith('/changename') && !lowerText.startsWith('/название')) return false;
  if (!ctx.isChat) { await ctx.send('Только в беседах'); return true; }
  if (!isAdmin) { await ctx.send('Только админы'); return true; }

  const match = ctx.text.match(/^\/changename\s+(.+)$/i);
  if (!match) { await ctx.send('Использование: /changename <новое название>'); return true; }

  const title = match[1].trim();

  try {
    await vk.api.messages.editChat({ chat_id: ctx.chatId, title });
    await ctx.send(`Название изменено на "${title}"`);
  } catch (e) {
    await ctx.send(`Ошибка: ${e.message}`);
  }
  return true;
};