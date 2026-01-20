export const command = async (ctx, vk, db, { lowerText }) => {
  if (lowerText !== '/nicks') return false;
  if (!ctx.isChat) { await ctx.send('Только в беседах'); return true; }

  const members = await vk.api.messages.getConversationMembers({ peer_id: ctx.peerId });
  const nicks = await db.all(`SELECT * FROM nicks WHERE chat_id = ?`, [ctx.chatId]);
  const nickMap = Object.fromEntries(nicks.map(n => [n.user_id, n.nick]));

  let text = 'Ники:\n';
  members.profiles.forEach(p => {
    text += `• [id${p.id}|${p.first_name} ${p.last_name}] — ${nickMap[p.id] || '—'}\n`;
  });
  await ctx.send(text);
  return true;
};