export const command = async (ctx, vk, db, { lowerText, isAdmin, getTargetUserId }) => {
  if (!lowerText.startsWith('/checkpunish') && !lowerText.startsWith('/проверитьнаказания')) return false;
  if (!ctx.isChat) { await ctx.send('Только в беседах'); return true; }
  if (!isAdmin) { await ctx.send('Только админы'); return true; }

  let targetId = await getTargetUserId(ctx, vk);

  let query = `SELECT * FROM punishes WHERE chat_id = ? AND active = 1`;
  let params = [ctx.chatId];
  if (targetId) {
    query += ` AND user_id = ?`;
    params.push(targetId);
  }

  const rows = await db.all(query, params);

  if (!rows.length) {
    await ctx.send('Активных наказаний нет');
    return true;
  }

  let text = 'Наказания:\n';
  for (const r of rows) {
    const time = r.until ? new Date(r.until * 1000).toLocaleString('ru') : 'навсегда';
    text += `• [id${r.user_id}| ] — ${r.type} — ${r.reason} — до ${time}\n`;
  }
  await ctx.send(text);
  return true;
};