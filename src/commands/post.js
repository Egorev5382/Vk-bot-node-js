export const command = async (ctx, vk, db, { lowerText }) => {
  if (!lowerText.startsWith('/post')) return false;

  const match = ctx.text.match(/^\/post\s+(.+)$/is);
  if (!match) { await ctx.send('Использование: /post <текст>'); return true; }

  const text = match[1].trim();

  try {
    const { post_id } = await vk.api.wall.post({
      owner_id: -Number(process.env.GROUP_ID),
      from_group: 1,
      message: text
    });
    await ctx.send(`Пост: https://vk.com/wall-${process.env.GROUP_ID}_${post_id}`);
  } catch (e) {
    await ctx.send(`Ошибка: ${e.message}`);
  }
  return true;
};