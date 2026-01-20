export const command = async (ctx, vk, db, { lowerText }) => {
  if (!lowerText.startsWith('/set_vid')) return false;
  if (!ctx.isChat) { await ctx.send('Только в беседах'); return true; }

  const match = ctx.text.match(/^\/set_vid\s+(\d+)$/i);
  if (!match) { await ctx.send('Использование: /set_vid <число>'); return true; }

  const vid = Number(match[1]);

  await db.run(`INSERT OR REPLACE INTO settings (chat_id, vid) VALUES (?, ?)`, [ctx.chatId, vid]);
  await ctx.send(`VID установлен: ${vid}`);
  return true;
};