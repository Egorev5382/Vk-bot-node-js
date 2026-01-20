export async function isChatAdmin(vk, peerId, userId) {
  try {
    const { items } = await vk.api.messages.getConversationMembers({ peer_id: peerId });
    return items.some(m => m.member_id === userId && m.is_admin);
  } catch {
    return false;
  }
}