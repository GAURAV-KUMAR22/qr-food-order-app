export const playNotificationSound = () => {
  const audio = new Audio("/notification.mp3"); // or path to your sound file
  audio.play().catch((error) => {
    console.error("Audio play failed:", error);
  });
};
