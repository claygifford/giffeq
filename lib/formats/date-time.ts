export const getDateTime = (timestamp: number) => {
  const current = new Date(Date.now());
  const date = new Date(timestamp);
  if (date.getFullYear() !== current.getFullYear()) {
    return date.toLocaleDateString();
  }

  if (date.getDay() !== current.getDay()) {
    return date.toLocaleString('default', {
      month: 'short',
      day: 'numeric',
    });
  }

  return date.toLocaleTimeString('default', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};
