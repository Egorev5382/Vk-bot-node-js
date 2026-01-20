export const command = async (ctx, vk, db, { lowerText }) => {
  if (lowerText === '/ping' || lowerText === '/пинг') {
    await ctx.send('Pong!');
    return true;
  }
  return false;
};