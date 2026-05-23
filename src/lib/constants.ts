function mockAvatarUrl(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=CB6CE6&color=fff&size=100`;
}

export const MOCK_USERS = [
  {
    id: 'user-1',
    name: 'Aryan Batra',
    email: 'aryan@peerly.dev',
    avatar: 'AB',
    imageUrl: mockAvatarUrl('Aryan Batra'),
    bio: 'Full-stack developer, building the future one commit at a time.',
    rating: 4.8,
    ratingCount: 24,
    status: 'available' as const,
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: 'user-2',
    name: 'Elena Voss',
    email: 'elena@peerly.dev',
    avatar: 'EV',
    imageUrl: mockAvatarUrl('Elena Voss'),
    bio: 'Systems engineer. Love distributed systems & compilers.',
    rating: 4.6,
    ratingCount: 18,
    status: 'available' as const,
    createdAt: Date.now() - 86400000 * 25,
  },
  {
    id: 'user-3',
    name: 'Marcus Johnson',
    email: 'marcus@peerly.dev',
    avatar: 'MJ',
    imageUrl: mockAvatarUrl('Marcus Johnson'),
    bio: 'Frontend architect. React, design systems, and accessibility.',
    rating: 4.9,
    ratingCount: 31,
    status: 'available' as const,
    createdAt: Date.now() - 86400000 * 20,
  },
  {
    id: 'user-4',
    name: 'Priya Patel',
    email: 'priya@peerly.dev',
    avatar: 'PP',
    imageUrl: mockAvatarUrl('Priya Patel'),
    bio: 'ML engineer. Making machines learn so we don\'t have to.',
    rating: 4.7,
    ratingCount: 15,
    status: 'busy' as const,
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    id: 'user-5',
    name: 'Alex Kim',
    email: 'alex@peerly.dev',
    avatar: 'AK',
    imageUrl: mockAvatarUrl('Alex Kim'),
    bio: 'DevOps & cloud. The infrastructure behind the infrastructure.',
    rating: 4.5,
    ratingCount: 12,
    status: 'available' as const,
    createdAt: Date.now() - 86400000 * 10,
  },
];

export const APP_NAME = 'Peerly';
export const APP_TAGLINE = 'Find your focus partner.';
export const APP_DESCRIPTION = 'A calendar-based peer matching platform for focused work sessions.';
