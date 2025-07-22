export const getTimeBasedGreeting = (): string => {
  const currentHour = new Date().getHours();
  
  if (currentHour >= 5 && currentHour < 12) {
    return "Good morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    return "Good afternoon";
  } else if (currentHour >= 17 && currentHour < 22) {
    return "Good evening";
  } else {
    return "Good evening";
  }
};

export const getPersonalizedGreeting = (fullName?: string): string => {
  const timeGreeting = getTimeBasedGreeting();
  
  if (fullName) {
    // Extract first name from full name
    const firstName = fullName.split(' ')[0];
    return `${timeGreeting}, Professor ${firstName}!`;
  }
  
  return `${timeGreeting}, Professor!`;
};