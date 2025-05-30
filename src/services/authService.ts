import { Credentials, User } from '../types';

// Mock users for demonstration
const MOCK_USERS: User[] = [
  {
    username: 'admin',
    password: 'admin123',
    isAdmin: true
  },
  {
    username: 'user',
    password: 'user123',
    isAdmin: false
  }
];

/**
 * Simulates authentication with backend
 */
export const loginUser = async (credentials: Credentials): Promise<User | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = MOCK_USERS.find(
    u => u.username === credentials.username && u.password === credentials.password
  );
  
  if (user) {
    // Clone the user object without the password for security
    const { password, ...secureUser } = user;
    return { ...secureUser, password: '' };
  }
  
  return null;
};