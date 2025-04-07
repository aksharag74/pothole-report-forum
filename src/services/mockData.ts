
import { PotholeReport, User } from "@/types";

export const mockUsers: User[] = [
  {
    id: "1",
    email: "john@example.com",
    username: "john_doe",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    email: "jane@example.com",
    username: "jane_smith",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "3",
    email: "guest@example.com",
    username: "guest_user",
    avatarUrl: "https://i.pravatar.cc/150?img=8",
  },
];

export const mockReports: PotholeReport[] = [
  {
    id: "1",
    title: "Deep pothole on Main Street",
    description: "Large pothole near the intersection, about 8 inches deep and growing.",
    imageUrl: "https://images.unsplash.com/photo-1663666515619-3a9804d31f03?w=800&auto=format&fit=crop",
    location: {
      address: "123 Main St, Anytown, USA",
      lat: 40.712776,
      lng: -74.005974,
    },
    status: "reported",
    upvotes: 15,
    downvotes: 2,
    createdAt: "2023-09-15T10:30:00Z",
    updatedAt: "2023-09-15T10:30:00Z",
    comments: [
      {
        id: "101",
        content: "I hit this pothole yesterday and damaged my tire. Please fix ASAP!",
        createdAt: "2023-09-15T14:20:00Z",
        user: mockUsers[1],
      },
      {
        id: "102",
        content: "It's getting worse after the recent rain.",
        createdAt: "2023-09-16T09:15:00Z",
        user: mockUsers[0],
      },
    ],
    author: mockUsers[0],
  },
  {
    id: "2",
    title: "Multiple potholes on Oak Avenue",
    description: "Several potholes along Oak Ave between 5th and 7th street. Creating hazardous driving conditions.",
    imageUrl: "https://images.unsplash.com/photo-1597246144127-d28330a9c263?w=800&auto=format&fit=crop",
    location: {
      address: "546 Oak Ave, Anytown, USA",
      lat: 40.714001,
      lng: -74.008234,
    },
    status: "in_progress",
    upvotes: 28,
    downvotes: 1,
    createdAt: "2023-09-10T08:45:00Z",
    updatedAt: "2023-09-14T11:20:00Z",
    comments: [
      {
        id: "201",
        content: "I counted at least 5 significant potholes in this stretch. Needs urgent attention.",
        createdAt: "2023-09-10T12:30:00Z",
        user: mockUsers[2],
      },
    ],
    author: mockUsers[1],
  },
  {
    id: "3",
    title: "Sinkhole forming on Cedar Road",
    description: "What started as a pothole is now turning into a sinkhole. About 2 feet in diameter.",
    imageUrl: "https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=800&auto=format&fit=crop",
    location: {
      address: "789 Cedar Rd, Anytown, USA",
      lat: 40.718234,
      lng: -74.001567,
    },
    status: "reported",
    upvotes: 45,
    downvotes: 0,
    createdAt: "2023-09-05T15:20:00Z",
    updatedAt: "2023-09-05T15:20:00Z",
    comments: [
      {
        id: "301",
        content: "This is extremely dangerous! Cars are swerving into oncoming traffic to avoid it.",
        createdAt: "2023-09-05T18:45:00Z",
        user: mockUsers[0],
      },
      {
        id: "302",
        content: "It's gotten bigger since last week. City needs to address this immediately.",
        createdAt: "2023-09-07T10:15:00Z",
        user: mockUsers[1],
      },
      {
        id: "303",
        content: "I've reported this to the city council as well.",
        createdAt: "2023-09-08T14:30:00Z",
        user: mockUsers[2],
      },
    ],
    author: mockUsers[2],
  },
];
