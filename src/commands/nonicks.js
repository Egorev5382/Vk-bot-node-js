export const command = async (ctx, vk, db, { lowerText }) => {
  if (lowerText !== '/nonicks') return false;
  if (!ctx.isChat) { await ctx.send('Только в беседах'); return true; }

  const members = await vk.api.messages.getConversationMembers({ peer_id: ctx.peerId });
  const nicks = await db.all(`SELECT user_id FROM nicks WHERE chat_id = ?`, [ctx.chatId]);
  const hasNick = new Set(nicks.map(r => r.user_id));

  let text = 'Без ников:\n';
  members.profiles.filter(p => !hasNick.has(p.id)).forEach(p => {
    text += `• [id${p.id}|${p.first_name} ${p.last_name}]\n`;
  });
  await ctx.send(text || 'Все имеют ники');
  return true;
};