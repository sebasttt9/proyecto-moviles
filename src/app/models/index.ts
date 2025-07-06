// ===================================================
// 🔹 BASE MODEL
// ===================================================
export interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===================================================
// 🔹 ENUMS GENERALES
// ===================================================
export enum PetGender {
  FEMALE = 'female',
  MALE = 'male'
}

export enum PetSize {
  EXTRA_SMALL = 'extra_small',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  EXTRA_LARGE = 'extra_large'
}

export enum PetSpecies {
  BIRD = 'bird',
  CAT = 'cat',
  DOG = 'dog',
  FISH = 'fish',
  HAMSTER = 'hamster',
  OTHER = 'other',
  RABBIT = 'rabbit',
  REPTILE = 'reptile'
}

// ===================================================
// 🔹 USUARIOS
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

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  VETERINARIAN = 'veterinarian'
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

// ===================================================
// 🔹 MASCOTAS
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

// ===================================================
// 🔹 VACUNACIÓN
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
  BORDETELLA = 'bordetella',
  DHPP = 'dhpp',
  FELINE_LEUKEMIA = 'feline_leukemia',
  FVRCP = 'fvrcp',
  LYME = 'lyme',
  OTHER = 'other',
  RABIES = 'rabies'
}

// ===================================================
// 🔹 HISTORIAL MÉDICO
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
  DENTAL = 'dental',
  EMERGENCY = 'emergency',
  GROOMING = 'grooming',
  ILLNESS = 'illness',
  OTHER = 'other',
  SURGERY = 'surgery',
  VACCINATION = 'vaccination'
}

// ===================================================
// 🔹 CITAS
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
  duration: number;
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
  CONSULTATION = 'consultation',
  DENTAL = 'dental',
  EMERGENCY = 'emergency',
  GROOMING = 'grooming',
  OTHER = 'other',
  SURGERY = 'surgery',
  VACCINATION = 'vaccination'
}

export enum AppointmentStatus {
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled',
  SCHEDULED = 'scheduled'
}

// ===================================================
// 🔹 VETERINARIOS Y CLÍNICAS
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
  CARDIOLOGY = 'cardiology',
  DENTISTRY = 'dentistry',
  DERMATOLOGY = 'dermatology',
  EMERGENCY = 'emergency',
  EXOTIC_PETS = 'exotic_pets',
  GENERAL_PRACTICE = 'general_practice',
  ONCOLOGY = 'oncology',
  OPHTHALMOLOGY = 'ophthalmology',
  ORTHOPEDICS = 'orthopedics',
  SURGERY = 'surgery'
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
  duration: number;
  category: ServiceCategory;
  isActive: boolean;
}

export enum ServiceCategory {
  BOARDING = 'boarding',
  EMERGENCY = 'emergency',
  GROOMING = 'grooming',
  OTHER = 'other',
  TRAINING = 'training',
  VETERINARY = 'veterinary'
}

export interface TimeSlot {
  dayOfWeek: number; // 0–6 (Sunday = 0)
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
}

// ===================================================
// 🔹 ADOPCIONES
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

export enum AdoptionStatus {
  ADOPTED = 'adopted',
  AVAILABLE = 'available',
  ON_HOLD = 'on_hold',
  PENDING = 'pending',
  UNAVAILABLE = 'unavailable'
}

export enum HealthStatus {
  EXCELLENT = 'excellent',
  FAIR = 'fair',
  GOOD = 'good',
  NEEDS_MEDICAL_ATTENTION = 'needs_medical_attention'
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
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
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
  APARTMENT = 'apartment',
  CONDO = 'condo',
  HOUSE = 'house',
  OTHER = 'other',
  TOWNHOUSE = 'townhouse'
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
// 🔹 NOTIFICACIONES
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
  ADOPTION_UPDATE = 'adoption_update',
  APPOINTMENT_REMINDER = 'appointment_reminder',
  GENERAL = 'general',
  GROOMING_REMINDER = 'grooming_reminder',
  MEDICATION_REMINDER = 'medication_reminder',
  PROMOTION = 'promotion',
  SYSTEM_ALERT = 'system_alert',
  VACCINATION_REMINDER = 'vaccination_reminder'
}

// ===================================================
// 🔹 STATS Y FILTROS
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
