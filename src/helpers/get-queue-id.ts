export const getQueueId = (queueType: string) => {
  switch (queueType) {
    case 'RANKED_SOLO_5x5':
      return 420;
    case 'RANKED_SOLO_5x5':
    default:
      return 440;
  }
};
