
export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: User;
}

export interface PotholeReport {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  status: 'reported' | 'in_progress' | 'fixed';
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  author: User;
}
