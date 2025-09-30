// Email functionality - manual email sending mode
// SendGrid integration disabled per user preference

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(
  params: EmailParams
): Promise<boolean> {
  // Mock email sending - user will handle emails manually
  console.log('Email would be sent to:', params.to);
  console.log('Subject:', params.subject);
  if (params.text) console.log('Text:', params.text);
  if (params.html) console.log('HTML content provided');
  return true; // Always succeed since manual email handling
}

export async function sendAchievementCard(email: string, totalScore: number): Promise<boolean> {
  // Log achievement card details for manual email sending
  console.log('=== ACHIEVEMENT CARD REQUEST ===');
  console.log('Email:', email);
  console.log('Total Score:', totalScore.toLocaleString());
  console.log('Message: Congratulations! You\'ve earned', totalScore.toLocaleString(), 'points learning about sustainability and global citizenship.');
  console.log('=====================================');
  
  return true; // Always succeed - user will handle manually
}