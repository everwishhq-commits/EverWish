/* 🔹 Módulo de administración Everwish */
export const EverwishAdmin = {
  createFreeCard(slug, user) {
    return {
      id: `${slug}-${Date.now()}`,
      slug,
      user,
      status: "free",
      createdAt: new Date().toISOString(),
    };
  },

  sendToMultiple(cardId, recipients) {
    console.log(`Sending card ${cardId} to:`, recipients);
    return recipients.map((r) => ({
      recipient: r,
      link: `https://everwish.cards/view/${cardId}?to=${encodeURIComponent(r)}`,
    }));
  },

  markAsOpened(cardId) {
    console.log(`Card ${cardId} marked as opened`);
    return { cardId, opened: true, openedAt: new Date().toISOString() };
  },
};
