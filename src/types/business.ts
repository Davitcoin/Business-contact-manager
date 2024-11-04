export interface Business {
  id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  rating: number;
  reviews: number;
  openingHours: {
    [key: string]: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  lastUpdated: string;
}

export type BusinessFormData = Omit<Business, 'id' | 'lastUpdated'>;