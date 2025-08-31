export type User = {
    id: number;
    user_id: number;
    full_name: string;
    email: string;
    status: string;
    instagram: string;
    genre: string;
    verified: boolean;
  };

export  type Studio = {
    id: number;
    user_id: number;
    name: string;
    location: string;
    status: string;
    revenue: number;
    bookings: number;
    rating: number;
  };