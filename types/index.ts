export interface User {
  id: string;
  profilePicture: string;
  username: string;
  email: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  pricePerHour: number;
  banner: string;
  category: string;
}

export interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  timestamp: string;
  user: User;
}

export interface Booking {
  id: string;
  bookingDate: string;
  title: string;
  description: string;
  status: string;
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  bookingId: string;
  serviceTitle: string;
  bookingStatus: string;
}

