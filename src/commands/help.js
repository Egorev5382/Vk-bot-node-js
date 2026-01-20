export const command = async (ctx, vk, db, { lowerText }) => {
  if (lowerText === '/help' || lowerText === '/помощь') {
    await ctx.send(`
/ping
/ban @id... или ответ [причина]
/unban @id... или ответ
/mute @id... минуты [причина]
/unmute @id... или ответ
/kick @id... или ответ
/checkpunish [@id...]
/delmessage (ответ)
/multidell <число>
/pin (ответ)
/changename <название>
/nick <ник>
/setname @id... <ник>
/clearnick
/nicks
/nonicks
/inchat @id...
/post <текст>
/set_vid <число>
/chat
    `.trim());
    return true;
  }
  return false;
};