export type Booking = {
  id: number;
  artistId: number;
  artistName: string;
  artistAvatar: string;
  serviceName: string;
  date: string;
  time: string;
  status: string;
  price: number;
};

export type Review = {
  id: number;
  artistId: number;
  artistName: string;
  artistAvatar: string;
  rating: number;
  comment: string;
  date: string;
};

export type Service = {
  id: number;
  name: string;
  description: string;
  price: string;
  priceType: string;
  duration: string;
  maxCapacity: string;
  availableTimes: string;
  tags: string;
};

export type Studio = {
  studioName: string;
  description: string;
  avatarImage: string | null;
  location: string;
  studioTypes: string[];
  languages: string[];
  preferredGenres: string[];
  galleryImages: string[];
  schedule: Record<string, { open: boolean; start: string; end: string }>;
  contact: {
    website: string;
    instagram: string;
    soundcloud: string;
    youtube: string;
    email: string;
    phone: string;
  };
  services: Service[];
  additionalInfo: {
    rules: string;
    cancellationPolicy: string;
    amenities: string[];
  };
  equipment: string[];
};


export type Earning = {
    total: number;
    pending: number;
    completed: number;
    thisMonth: number;
    lastMonth: number
}


export type Demo = {
  file: string | ArrayBuffer | null;
  title: string;
  playing: boolean;
};

export type ArtistFormData = {
  fullName: string;
  artistName: string;
  avatarImage: string | null;
  bio: string;
  location: string;
  contact: {
    email: string;
    phone: string;
    instagram: string;
    soundcloud: string;
    youtube: string;
  };
  genres: string[];
  instruments: string[];
  demos: Demo[];
  collaborators: string[];
  languages: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'pro';
  yearsOfExperience: number | null;
  availability: string;
  portfolio: { url: string; title: string; type: 'image' | 'video' | 'audio' }[];
};

export type SettingsData = {
  payoutMethods: Array<{
    id: number;
    type: string;
    last4?: string;
    email?: string;
    primary: boolean;
  }>;
  payoutHistory: Array<{
    id: number;
    date: string;
    amount: number;
    method: string;
    status: string;
  }>;
  connectedAccounts: Array<{
    id: number;
    provider: string;
    connected: boolean;
  }>;
  notifications: {
    bookingConfirmation: { email: boolean; sms: boolean; push: boolean };
    bookingReminder: { email: boolean; sms: boolean; push: boolean };
    bookingAttendance: { email: boolean; sms: boolean; push: boolean };
    artistReview: { email: boolean; sms: boolean; push: boolean };
    platformNews: { email: boolean; sms: boolean; push: boolean };
    payoutUpdates: { email: boolean; sms: boolean; push: boolean };
  };
  privacySettings: {
    profileVisibility: string;
    showReviews: boolean;
    analyticsTracking: boolean;
  };
  securitySettings: {
    twoFactorAuth: boolean;
  };
  regionalSettings: {
    language: string;
    timezone: string;
    currency: string;
    timeFormat: string;
  };
};
