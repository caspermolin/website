export interface Project {
  id: string;
  title: string;
  year: number;
  director: string;
  producer?: string;
  type: ProjectType;
  genre?: string;
  poster: string;
  heroImage: string;
  description: string;
  credits: ProjectCredits;
  roles: string[];
  tags: string[];
  slug: string;
  featured: boolean;
  gallery?: string[];
  client?: string;
  duration?: string;
  format?: string;
  status?: string;
}

export type ProjectType = 
  | 'Documentary'
  | 'Feature Film'
  | 'One Night Stand'
  | 'Short'
  | 'TV/VOD series'
  | 'TV Movie';

export interface ProjectCredits {
  soundDesign?: string[];
  reRecordingMix?: string[];
  adr?: string[];
  foley?: string[];
  audioPostProducer?: string[];
  soundEditor?: string[];
  dialogueEditor?: string[];
  additionalRoles?: { [key: string]: string[] };
}

export interface CreditRole {
  id: string;
  name: string;
  category: 'core' | 'additional';
  description?: string;
  order: number;
}

export interface Person {
  id: string;
  name: string;
  role: string;
  roles: string[];
  bio: string;
  image: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  specialties?: string[];
  experience?: string;
  education?: string;
  awards?: string[];
  featured: boolean;
  order?: number;
}

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  updatedAt: string;
  heroImage: string;
  category: string;
  tags: string[];
  featured: boolean;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  features: string[];
  equipment: string[];
  workflow: string[];
  deliverables: string[];
  icon: string;
  featured: boolean;
}

export interface Facility {
  id: string;
  name: string;
  type: string;
  description: string;
  specifications: FacilitySpecs;
  images: string[];
  featured: boolean;
}

export interface FacilitySpecs {
  monitoring: string[];
  screen?: string;
  projector?: string;
  acoustics: string[];
  capacity: string;
  dimensions: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phone?: string;
  email?: string;
  description?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
  };
  twitter?: {
    title?: string;
    description?: string;
    image?: string;
  };
}
