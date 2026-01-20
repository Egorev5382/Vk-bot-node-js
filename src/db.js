import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../storage/bot.db');

let db = null;

export async function getDb() {
  if (!db) {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS nicks (
        chat_id INTEGER,
        user_id INTEGER,
        nick TEXT,
        PRIMARY KEY (chat_id, user_id)
      );

      CREATE TABLE IF NOT EXISTS punishes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chat_id INTEGER,
        user_id INTEGER,
        type TEXT,
        reason TEXT,
        until INTEGER,
        active INTEGER DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS settings (
        chat_id INTEGER PRIMARY KEY,
        vid INTEGER
      );
    `);
  }
  return db;
}