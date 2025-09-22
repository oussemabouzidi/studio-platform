export type Studio = {
  rating: number,
  avatar: string ,
  id: number,
  name: string,
  location: string,
  level?: number,
  genres: string[],
  price: number,
  equipment: string[],
  availability: string[],
  amenities: string[],
  types: string[],
  languages: string[],
};

export type Studio_details = {
  id: number;
  name: string;
  avatar: string;
  coverPhoto: string;
  rating: number;
  location: string;
  types: string[];
  genres: string[];
  price: number;
  amenities: string[];
  equipment: string[];
  languages: string[];
  availability: string[];
  description?: string;
  contact?: {
    email: string;
    phone: string;
    website: string;
    instagram: string;
    soundcloud: string;
    youtube: string;
  };
  services?: {
    id: number;
    name: string;
    description: string;
    price: string;
    priceType: string;
    duration: string;
    maxCapacity: string;
    availableTimes: string;
    tags: string;
  }[];
  rules?: string;
  cancellationPolicy?: string;
};


export type Booking = {
    bookingId: number,
    bookingDate: Date,
    bookingTime: Date,
    nbrGuests: number,
    status: boolean,
    studio: {
      id: number,
      name: String,
      location: String,
      description: String,
      avatar: String ,
      email: String,
      phone: number,
      website: String,
      instagram: String,
      soundCloud: String,
      youtube: String,
      studioRules: String,
      cancellationPolicy: String,
    },
    service: {
      name: String,
      price: Number,
      duration: Date,
    },
};

export type Reviews = {
    id: Number,
    artist_id: Number,
    studioId: Number,
    rating: Number,
    comment: String,
    date: Date,
    user_id: Number,
    studioName: String,
    location: String,
    description: String
}


export type Notfications = {
    id: number,
    title: String,
    type: String,
    amount: number,
    claimed: boolean,
    description: String,
    time: string,
    unread: boolean,
    date: string,
}

export type Profile = {
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
      spotify: string;
    };
    genres: string[];
    instruments: string[];
    demo: DemoType[];
    collaborators: string[];
    languages: string[];
    experienceLevel: 'beginner' | 'intermediate' | 'pro';
    yearsOfExperience: number | null;
    availability: string;
    portfolio: { url: string; title: string; type: 'image' | 'video' | 'audio' }[];
  };

export type DemoType = {
  file: string | ArrayBuffer | null;
  title: string;
  playing: boolean;
};

export type SettingsState = {
  activeTab: string;
  showPassword: boolean;
  paymentMethods: Array<{
  }>;
  invoices: Array<{
    id: number;
    date: string;
    studio: string;
    amount: number;
    fee: number;
  }>;
  connectedAccounts: Array<{
    id: number;
    provider: string;
    connected: boolean;
  }>;
  notifications: {
    bookingConfirmation: { email: boolean; sms: boolean; push: boolean };
    bookingReminder: { email: boolean; sms: boolean; push: boolean };
    platformNews: { email: boolean; sms: boolean; push: boolean };
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