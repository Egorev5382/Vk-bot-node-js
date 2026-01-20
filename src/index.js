import { VK } from 'vk-io';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDb } from './db.js';
import { isChatAdmin } from './utils/isAdmin.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const vk = new VK({
  token: process.env.TOKEN,
  pollingGroupId: Number(process.env.GROUP_ID || 0),
});

const db = await getDb();

vk.updates.use(async (ctx, next) => {
  if (!ctx.isChat || ctx.senderId <= 0) return next();

  const punishes = await db.all(
    `SELECT * FROM punishes WHERE chat_id = ? AND user_id = ? AND active = 1`,
    [ctx.chatId, ctx.senderId]
  );

  for (const p of punishes) {
    if (p.type === 'ban') {
      try { await vk.api.messages.removeChatUser({ chat_id: ctx.chatId, member_id: ctx.senderId }); } catch {}
      return;
    }
    if (p.type === 'mute') {
      if (Date.now() / 1000 > p.until) {
        await db.run(`UPDATE punishes SET active = 0 WHERE id = ?`, [p.id]);
      } else {
        try { await vk.api.messages.delete({ message_ids: ctx.id, delete_for_all: 1 }); } catch {}
        return;
      }
    }
  }

  await next();
});

async function getTargetUserId(ctx, vk) {
  if (ctx.replyMessage && ctx.replyMessage.senderId > 0) {
    return ctx.replyMessage.senderId;
  }

  if (ctx.forwards && ctx.forwards.length > 0) {
    const fw = ctx.forwards[0];
    if (fw.senderId > 0) return fw.senderId;
  }

  if (ctx.mentions && ctx.mentions.length > 0) {
    const mention = ctx.mentions[0];
    if (mention.type === 'user' && mention.id > 0) return mention.id;
  }

  const text = ctx.text || '';
  const regexMention = /@id(\d+)/i;
  const regexBracket = /\[id(\d+)\|/i;

  let match = text.match(regexMention) || text.match(regexBracket);
  if (match && match[1]) return Number(match[1]);

  return null;
}

const commands = [];

const commandsPath = path.join(__dirname, 'commands');
const files = await fs.readdir(commandsPath);

for (const file of files) {
  if (!file.endsWith('.js')) continue;
  try {
    const module = await import(`./commands/${file}`);
    if (module.command) {
      commands.push(module.command);
      console.log(`Загружена: ${file.replace('.js', '')}`);
    }
  } catch (err) {
    console.error(`Ошибка загрузки ${file}:`, err);
  }
}

vk.updates.on('message_new', async (ctx) => {
  if (!ctx.text) return;

  const text = ctx.text.trim();
  const lowerText = text.toLowerCase();
  const isAdmin = await isChatAdmin(vk, ctx.peerId, ctx.senderId);

  for (const cmd of commands) {
    const handled = await cmd(ctx, vk, db, { text, lowerText, isAdmin, getTargetUserId });
    if (handled) return;
  }
});

console.log('Бот запущен');
await vk.updates.startPolling().catch(console.error);