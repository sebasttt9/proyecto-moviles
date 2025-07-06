// ===================================================
// 🔹 BASE MODEL
// ===================================================
export interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===================================================
// 🔹 USER MODELS
// ===================================================
export interface User extends BaseModel {
  email: string;
  name: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: Date;
  address?: Address;
  preferences: UserPreferences;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface UserPreferences {
  notifications: NotificationSettings;
  language: string;
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
}

export interface NotificationSettings {
  push: boolean;
  email: boolean;
  sms: boolean;
  appointmentReminders: boolean;
  vaccinationReminders: boolean;
  promotions: boolean;
}

export enum UserRole {
  USER = 'user',
  VETERINARIAN = 'veterinarian',
  ADMIN = 'admin'
}

// ===================================================
// 🔹 PET MODELS
// ===================================================
export interface Pet extends BaseModel {
  name: string;
  species: PetSpecies;
  breed: string;
  age: number;
  gender: PetGender;
  weight: number;
  color: string;
  microchip?: string;
  profileImage?: string;
  medicalNotes?: string;
  ownerId: string;
  vaccinations: Vaccination[];
  medicalHistory: MedicalRecord[];
  lastVetVisit?: Date;
  nextVetVisit?: Date;
  isActive: boolean;
}

export enum PetSpecies {
  DOG = 'dog',
  CAT = 'cat',
  BIRD = 'bird',
  RABBIT = 'rabbit',
  HAMSTER = 'hamster',
  FISH = 'fish',
  REPTILE = 'reptile',
  OTHER = 'other'
}

export enum PetGender {
  MALE = 'male',
  FEMALE = 'female'
}

// ===================================================
// 🔹 VACCINATION MODELS
// ===================================================
export interface Vaccination extends BaseModel {
  petId: string;
  name: string;
  vaccinationType: VaccinationType;
  administrationDate: Date;
  nextDueDate?: Date;
  veterinarianId: string;
  veterinarianName: string;
  clinicName: string;
  batchNumber?: string;
  notes?: string;
  documentUrl?: string;
}

export enum VaccinationType {
  RABIES = 'rabies',
  DHPP = 'dhpp',
  FVRCP = 'fvrcp',
  BORDETELLA = 'bordetella',
  LYME = 'lyme',
  FELINE_LEUKEMIA = 'feline_leukemia',
  OTHER = 'other'
}

// ===================================================
// 🔹 MEDICAL RECORD MODELS
// ===================================================
export interface MedicalRecord extends BaseModel {
  petId: string;
  veterinarianId: string;
  veterinarianName: string;
  clinicName: string;
  visitDate: Date;
  visitType: MedicalVisitType;
  diagnosis: string;
  treatment: string;
  medications: Medication[];
  weight: number;
  temperature?: number;
  heartRate?: number;
  notes?: string;
  followUpDate?: Date;
  documentUrls: string[];
  cost?: number;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  instructions: string;
}

export enum MedicalVisitType {
  CHECKUP = 'checkup',
  VACCINATION = 'vaccination',
  ILLNESS = 'illness',
  SURGERY = 'surgery',
  DENTAL = 'dental',
  GROOMING = 'grooming',
  EMERGENCY = 'emergency',
  OTHER = 'other'
}

// ===================================================
// 🔹 APPOINTMENT MODELS
// ===================================================
export interface Appointment extends BaseModel {
  userId: string;
  petId: string;
  petName: string;
  veterinarianId: string;
  veterinarianName: string;
  clinicId: string;
  clinicName: string;
  appointmentDate: Date;
  duration: number; // in minutes
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  cost?: number;
  reminderSent: boolean;
  followUpRequired: boolean;
  followUpDate?: Date;
}

export enum AppointmentType {
  CHECKUP = 'checkup',
  VACCINATION = 'vaccination',
  CONSULTATION = 'consultation',
  SURGERY = 'surgery',
  GROOMING = 'grooming',
  DENTAL = 'dental',
  EMERGENCY = 'emergency',
  OTHER = 'other'
}

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled'
}

// ===================================================
// 🔹 VETERINARIAN & CLINIC
// ===================================================
export interface Veterinarian extends BaseModel {
  userId: string;
  licenseNumber: string;
  specializations: VeterinarySpecialization[];
  experience: number;
  rating: number;
  reviewCount: number;
  clinicId: string;
  clinicName: string;
  isAvailable: boolean;
  consultationFee: number;
  availability: TimeSlot[];
}

export enum VeterinarySpecialization {
  GENERAL_PRACTICE = 'general_practice',
  SURGERY = 'surgery',
  DENTISTRY = 'dentistry',
  CARDIOLOGY = 'cardiology',
  DERMATOLOGY = 'dermatology',
  ONCOLOGY = 'oncology',
  ORTHOPEDICS = 'orthopedics',
  OPHTHALMOLOGY = 'ophthalmology',
  EXOTIC_PETS = 'exotic_pets',
  EMERGENCY = 'emergency'
}

export interface TimeSlot {
  dayOfWeek: number; // 0-6, Sunday = 0
  startTime: string; // HH:MM format
  endTime: string;   // HH:MM format
}

export interface Clinic extends BaseModel {
  name: string;
  address: Address;
  phone: string;
  email: string;
  website?: string;
  description?: string;
  services: ClinicService[];
  operatingHours: TimeSlot[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  imageUrls: string[];
}

export interface ClinicService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: ServiceCategory;
  isActive: boolean;
}

export enum ServiceCategory {
  VETERINARY = 'veterinary',
  GROOMING = 'grooming',
  BOARDING = 'boarding',
  TRAINING = 'training',
  EMERGENCY = 'emergency',
  OTHER = 'other'
}

// ===================================================
// 🔹 GROOMING
// ===================================================
export interface GroomingService extends BaseModel {
  name: string;
  description: string;
  price: number;
  duration: number;
  category: GroomingCategory;
  petSpecies: PetSpecies[];
  imageUrl?: string;
  isActive: boolean;
}

export enum GroomingCategory {
  BATH = 'bath',
  HAIRCUT = 'haircut',
  NAIL_TRIM = 'nail_trim',
  TEETH_CLEANING = 'teeth_cleaning',
  EAR_CLEANING = 'ear_cleaning',
  FULL_GROOMING = 'full_grooming',
  SPECIAL_TREATMENT = 'special_treatment'
}

export interface GroomingAppointment extends BaseModel {
  userId: string;
  petId: string;
  petName: string;
  services: GroomingService[];
  appointmentDate: Date;
  duration: number;
  totalCost: number;
  status: AppointmentStatus;
  notes?: string;
  groomerId: string;
  groomerName: string;
  beforePhotos: string[];
  afterPhotos: string[];
}

// ===================================================
// 🔹 ADOPTION
// ===================================================
export interface AdoptionPet extends BaseModel {
  name: string;
  species: PetSpecies;
  breed: string;
  age: number;
  gender: PetGender;
  weight: number;
  color: string;
  description: string;
  healthStatus: HealthStatus;
  temperament: string[];
  isVaccinated: boolean;
  isSpayedNeutered: boolean;
  isMicrochipped: boolean;
  specialNeeds?: string;
  adoptionFee: number;
  images: string[];
  videoUrl?: string;
  shelterId: string;
  shelterName: string;
  location: string;
  dateAdded: Date;
  status: AdoptionStatus;
  applicantCount: number;
}

export enum HealthStatus {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  NEEDS_MEDICAL_ATTENTION = 'needs_medical_attention'
}

export enum AdoptionStatus {
  AVAILABLE = 'available',
  PENDING = 'pending',
  ADOPTED = 'adopted',
  ON_HOLD = 'on_hold',
  UNAVAILABLE = 'unavailable'
}

export interface AdoptionApplication extends BaseModel {
  userId: string;
  petId: string;
  petName: string;
  shelterId: string;
  status: ApplicationStatus;
  personalInfo: PersonalInfo;
  housingInfo: HousingInfo;
  experienceInfo: ExperienceInfo;
  references: Reference[];
  additionalNotes?: string;
  submissionDate: Date;
  reviewDate?: Date;
  reviewNotes?: string;
  reviewerId?: string;
}

export enum ApplicationStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn'
}

export interface PersonalInfo {
  occupation: string;
  workSchedule: string;
  hasChildren: boolean;
  childrenAges?: number[];
  hasOtherPets: boolean;
  otherPetsInfo?: string;
}

export interface HousingInfo {
  type: HousingType;
  isOwned: boolean;
  hasYard: boolean;
  yardSize?: string;
  isFenced: boolean;
  landlordPermission?: boolean;
}

export enum HousingType {
  HOUSE = 'house',
  APARTMENT = 'apartment',
  CONDO = 'condo',
  TOWNHOUSE = 'townhouse',
  OTHER = 'other'
}

export interface ExperienceInfo {
  hasPetExperience: boolean;
  previousPets?: string;
  currentPets?: string;
  vetReference?: string;
  whyAdopting: string;
  expectations: string;
}

export interface Reference {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

// ===================================================
// 🔹 NOTIFICATIONS
// ===================================================
export interface Notification extends BaseModel {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  isActionable: boolean;
  actionUrl?: string;
  expiresAt?: Date;
}

export enum NotificationType {
  APPOINTMENT_REMINDER = 'appointment_reminder',
  VACCINATION_REMINDER = 'vaccination_reminder',
  MEDICATION_REMINDER = 'medication_reminder',
  GROOMING_REMINDER = 'grooming_reminder',
  ADOPTION_UPDATE = 'adoption_update',
  PROMOTION = 'promotion',
  SYSTEM_ALERT = 'system_alert',
  GENERAL = 'general'
}

// ===================================================
// 🔹 UTILS - RESPONSES, FORMS, FILTERS, STATS
// ===================================================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: string;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  location?: string;
  priceRange?: PriceRange;
  dateRange?: DateRange;
  species?: PetSpecies;
  age?: AgeRange;
  gender?: PetGender;
  size?: PetSize;
  isActive?: boolean;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface AgeRange {
  min: number;
  max: number;
}

export enum PetSize {
  EXTRA_SMALL = 'extra_small',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  EXTRA_LARGE = 'extra_large'
}

export interface UserStatistics {
  totalPets: number;
  totalAppointments: number;
  completedAppointments: number;
  upcomingAppointments: number;
  totalVaccinations: number;
  overdueVaccinations: number;
  upcomingVaccinations: number;
  favoriteServices: string[];
  totalSpent: number;
  lastActivity: Date;
}

export interface AppStatistics {
  totalUsers: number;
  activeUsers: number;
  totalPets: number;
  totalAppointments: number;
  totalAdoptions: number;
  completedAdoptions: number;
  revenueThisMonth: number;
  popularServices: string[];
  averageRating: number;
  systemHealth: 'excellent' | 'good' | 'fair' | 'poor';
}
