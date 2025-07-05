import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { 
  Pet, 
  PetSpecies, 
  PetGender, 
  Vaccination, 
  VaccinationType, 
  MedicalRecord, 
  MedicalVisitType, 
  ApiResponse,
  PaginatedResponse,
  SearchFilters 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private petsSubject = new BehaviorSubject<Pet[]>([]);
  public pets$ = this.petsSubject.asObservable();

  private selectedPetSubject = new BehaviorSubject<Pet | null>(null);
  public selectedPet$ = this.selectedPetSubject.asObservable();

  constructor() {
    this.loadPets();
  }

  // Pet CRUD operations
  async loadPets(userId?: string): Promise<void> {
    // Simulate API call
    setTimeout(() => {
      const pets = this.getMockPets(userId);
      this.petsSubject.next(pets);
    }, 500);
  }

  async getPetById(petId: string): Promise<ApiResponse<Pet>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const pets = this.petsSubject.value;
        const pet = pets.find(p => p.id === petId);
        
        if (pet) {
          resolve({
            success: true,
            data: pet,
            timestamp: new Date()
          });
        } else {
          resolve({
            success: false,
            error: 'Pet not found',
            timestamp: new Date()
          });
        }
      }, 300);
    });
  }

  async createPet(petData: Partial<Pet>): Promise<ApiResponse<Pet>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPet: Pet = {
          id: Date.now().toString(),
          name: petData.name!,
          species: petData.species!,
          breed: petData.breed!,
          age: petData.age!,
          gender: petData.gender!,
          weight: petData.weight!,
          color: petData.color!,
          microchip: petData.microchip,
          profileImage: petData.profileImage,
          medicalNotes: petData.medicalNotes,
          ownerId: petData.ownerId!,
          vaccinations: [],
          medicalHistory: [],
          lastVetVisit: petData.lastVetVisit,
          nextVetVisit: petData.nextVetVisit,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const currentPets = this.petsSubject.value;
        this.petsSubject.next([...currentPets, newPet]);

        resolve({
          success: true,
          data: newPet,
          message: 'Pet created successfully',
          timestamp: new Date()
        });
      }, 1000);
    });
  }

  async updatePet(petId: string, petData: Partial<Pet>): Promise<ApiResponse<Pet>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentPets = this.petsSubject.value;
        const petIndex = currentPets.findIndex(p => p.id === petId);
        
        if (petIndex !== -1) {
          const updatedPet: Pet = {
            ...currentPets[petIndex],
            ...petData,
            updatedAt: new Date()
          };
          
          const updatedPets = [...currentPets];
          updatedPets[petIndex] = updatedPet;
          this.petsSubject.next(updatedPets);

          resolve({
            success: true,
            data: updatedPet,
            message: 'Pet updated successfully',
            timestamp: new Date()
          });
        } else {
          resolve({
            success: false,
            error: 'Pet not found',
            timestamp: new Date()
          });
        }
      }, 800);
    });
  }

  async deletePet(petId: string): Promise<ApiResponse<boolean>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentPets = this.petsSubject.value;
        const updatedPets = currentPets.filter(p => p.id !== petId);
        
        if (updatedPets.length < currentPets.length) {
          this.petsSubject.next(updatedPets);
          resolve({
            success: true,
            data: true,
            message: 'Pet deleted successfully',
            timestamp: new Date()
          });
        } else {
          resolve({
            success: false,
            error: 'Pet not found',
            timestamp: new Date()
          });
        }
      }, 600);
    });
  }

  // Vaccination methods
  async addVaccination(petId: string, vaccinationData: Partial<Vaccination>): Promise<ApiResponse<Vaccination>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentPets = this.petsSubject.value;
        const petIndex = currentPets.findIndex(p => p.id === petId);
        
        if (petIndex !== -1) {
          const newVaccination: Vaccination = {
            id: Date.now().toString(),
            petId: petId,
            name: vaccinationData.name!,
            vaccinationType: vaccinationData.vaccinationType!,
            administrationDate: vaccinationData.administrationDate!,
            nextDueDate: vaccinationData.nextDueDate,
            veterinarianId: vaccinationData.veterinarianId!,
            veterinarianName: vaccinationData.veterinarianName!,
            clinicName: vaccinationData.clinicName!,
            batchNumber: vaccinationData.batchNumber,
            notes: vaccinationData.notes,
            documentUrl: vaccinationData.documentUrl,
            createdAt: new Date(),
            updatedAt: new Date()
          };

          const updatedPets = [...currentPets];
          updatedPets[petIndex].vaccinations.push(newVaccination);
          this.petsSubject.next(updatedPets);

          resolve({
            success: true,
            data: newVaccination,
            message: 'Vaccination added successfully',
            timestamp: new Date()
          });
        } else {
          resolve({
            success: false,
            error: 'Pet not found',
            timestamp: new Date()
          });
        }
      }, 800);
    });
  }

  async updateVaccination(petId: string, vaccinationId: string, vaccinationData: Partial<Vaccination>): Promise<ApiResponse<Vaccination>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentPets = this.petsSubject.value;
        const petIndex = currentPets.findIndex(p => p.id === petId);
        
        if (petIndex !== -1) {
          const pet = currentPets[petIndex];
          const vaccinationIndex = pet.vaccinations.findIndex(v => v.id === vaccinationId);
          
          if (vaccinationIndex !== -1) {
            const updatedVaccination: Vaccination = {
              ...pet.vaccinations[vaccinationIndex],
              ...vaccinationData,
              updatedAt: new Date()
            };
            
            const updatedPets = [...currentPets];
            updatedPets[petIndex].vaccinations[vaccinationIndex] = updatedVaccination;
            this.petsSubject.next(updatedPets);

            resolve({
              success: true,
              data: updatedVaccination,
              message: 'Vaccination updated successfully',
              timestamp: new Date()
            });
          } else {
            resolve({
              success: false,
              error: 'Vaccination not found',
              timestamp: new Date()
            });
          }
        } else {
          resolve({
            success: false,
            error: 'Pet not found',
            timestamp: new Date()
          });
        }
      }, 600);
    });
  }

  async deleteVaccination(petId: string, vaccinationId: string): Promise<ApiResponse<boolean>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentPets = this.petsSubject.value;
        const petIndex = currentPets.findIndex(p => p.id === petId);
        
        if (petIndex !== -1) {
          const pet = currentPets[petIndex];
          const updatedVaccinations = pet.vaccinations.filter(v => v.id !== vaccinationId);
          
          if (updatedVaccinations.length < pet.vaccinations.length) {
            const updatedPets = [...currentPets];
            updatedPets[petIndex].vaccinations = updatedVaccinations;
            this.petsSubject.next(updatedPets);

            resolve({
              success: true,
              data: true,
              message: 'Vaccination deleted successfully',
              timestamp: new Date()
            });
          } else {
            resolve({
              success: false,
              error: 'Vaccination not found',
              timestamp: new Date()
            });
          }
        } else {
          resolve({
            success: false,
            error: 'Pet not found',
            timestamp: new Date()
          });
        }
      }, 400);
    });
  }

  // Medical record methods
  async addMedicalRecord(petId: string, recordData: Partial<MedicalRecord>): Promise<ApiResponse<MedicalRecord>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentPets = this.petsSubject.value;
        const petIndex = currentPets.findIndex(p => p.id === petId);
        
        if (petIndex !== -1) {
          const newRecord: MedicalRecord = {
            id: Date.now().toString(),
            petId: petId,
            veterinarianId: recordData.veterinarianId!,
            veterinarianName: recordData.veterinarianName!,
            clinicName: recordData.clinicName!,
            visitDate: recordData.visitDate!,
            visitType: recordData.visitType!,
            diagnosis: recordData.diagnosis!,
            treatment: recordData.treatment!,
            medications: recordData.medications || [],
            weight: recordData.weight!,
            temperature: recordData.temperature,
            heartRate: recordData.heartRate,
            notes: recordData.notes,
            followUpDate: recordData.followUpDate,
            documentUrls: recordData.documentUrls || [],
            cost: recordData.cost,
            createdAt: new Date(),
            updatedAt: new Date()
          };

          const updatedPets = [...currentPets];
          updatedPets[petIndex].medicalHistory.push(newRecord);
          this.petsSubject.next(updatedPets);

          resolve({
            success: true,
            data: newRecord,
            message: 'Medical record added successfully',
            timestamp: new Date()
          });
        } else {
          resolve({
            success: false,
            error: 'Pet not found',
            timestamp: new Date()
          });
        }
      }, 1000);
    });
  }

  // Search and filter methods
  async searchPets(filters: SearchFilters): Promise<PaginatedResponse<Pet>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredPets = this.petsSubject.value;

        // Apply filters
        if (filters.query) {
          filteredPets = filteredPets.filter(pet =>
            pet.name.toLowerCase().includes(filters.query!.toLowerCase()) ||
            pet.breed.toLowerCase().includes(filters.query!.toLowerCase())
          );
        }

        if (filters.species) {
          filteredPets = filteredPets.filter(pet => pet.species === filters.species);
        }

        if (filters.gender) {
          filteredPets = filteredPets.filter(pet => pet.gender === filters.gender);
        }

        if (filters.age) {
          filteredPets = filteredPets.filter(pet => 
            pet.age >= filters.age!.min && pet.age <= filters.age!.max
          );
        }

        // Pagination
        const page = 1;
        const pageSize = 10;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedPets = filteredPets.slice(startIndex, endIndex);

        resolve({
          data: paginatedPets,
          total: filteredPets.length,
          page: page,
          pageSize: pageSize,
          totalPages: Math.ceil(filteredPets.length / pageSize),
          hasNextPage: endIndex < filteredPets.length,
          hasPreviousPage: page > 1
        });
      }, 500);
    });
  }

  // Statistics methods
  async getPetStatistics(petId: string): Promise<ApiResponse<any>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const pet = this.petsSubject.value.find(p => p.id === petId);
        
        if (pet) {
          const stats = {
            totalVaccinations: pet.vaccinations.length,
            overdueVaccinations: pet.vaccinations.filter(v => 
              v.nextDueDate && v.nextDueDate < new Date()
            ).length,
            upcomingVaccinations: pet.vaccinations.filter(v => 
              v.nextDueDate && v.nextDueDate > new Date() && 
              v.nextDueDate <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            ).length,
            totalMedicalRecords: pet.medicalHistory.length,
            lastVisit: pet.lastVetVisit,
            nextVisit: pet.nextVetVisit
          };

          resolve({
            success: true,
            data: stats,
            timestamp: new Date()
          });
        } else {
          resolve({
            success: false,
            error: 'Pet not found',
            timestamp: new Date()
          });
        }
      }, 300);
    });
  }

  // Utility methods
  getCurrentPets(): Pet[] {
    return this.petsSubject.value;
  }

  selectPet(pet: Pet): void {
    this.selectedPetSubject.next(pet);
  }

  getSelectedPet(): Pet | null {
    return this.selectedPetSubject.value;
  }

  // Mock data generation
  private getMockPets(userId?: string): Pet[] {
    return [
      {
        id: '1',
        name: 'Max',
        species: PetSpecies.DOG,
        breed: 'Golden Retriever',
        age: 3,
        gender: PetGender.MALE,
        weight: 28.5,
        color: 'Dorado',
        microchip: '123456789012345',
        profileImage: '/assets/pets/max.jpg',
        medicalNotes: 'Alérgico al pollo',
        ownerId: userId || '1',
        vaccinations: [
          {
            id: '1',
            petId: '1',
            name: 'Rabia',
            vaccinationType: VaccinationType.RABIES,
            administrationDate: new Date('2023-06-15'),
            nextDueDate: new Date('2024-06-15'),
            veterinarianId: '1',
            veterinarianName: 'Dr. García',
            clinicName: 'Clínica Veterinaria Central',
            batchNumber: 'RAB-2023-001',
            notes: 'Vacuna anual',
            createdAt: new Date('2023-06-15'),
            updatedAt: new Date('2023-06-15')
          },
          {
            id: '2',
            petId: '1',
            name: 'DHPP',
            vaccinationType: VaccinationType.DHPP,
            administrationDate: new Date('2023-07-01'),
            nextDueDate: new Date('2024-07-01'),
            veterinarianId: '1',
            veterinarianName: 'Dr. García',
            clinicName: 'Clínica Veterinaria Central',
            batchNumber: 'DHPP-2023-002',
            notes: 'Vacuna múltiple',
            createdAt: new Date('2023-07-01'),
            updatedAt: new Date('2023-07-01')
          }
        ],
        medicalHistory: [
          {
            id: '1',
            petId: '1',
            veterinarianId: '1',
            veterinarianName: 'Dr. García',
            clinicName: 'Clínica Veterinaria Central',
            visitDate: new Date('2023-08-20'),
            visitType: MedicalVisitType.CHECKUP,
            diagnosis: 'Chequeo general - Estado saludable',
            treatment: 'Ningún tratamiento necesario',
            medications: [],
            weight: 28.5,
            temperature: 38.5,
            heartRate: 120,
            notes: 'Mascota en excelente estado de salud',
            followUpDate: new Date('2024-02-20'),
            documentUrls: [],
            cost: 150,
            createdAt: new Date('2023-08-20'),
            updatedAt: new Date('2023-08-20')
          }
        ],
        lastVetVisit: new Date('2023-08-20'),
        nextVetVisit: new Date('2024-02-20'),
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-08-20')
      },
      {
        id: '2',
        name: 'Luna',
        species: PetSpecies.CAT,
        breed: 'Siamés',
        age: 2,
        gender: PetGender.FEMALE,
        weight: 4.2,
        color: 'Gris y blanco',
        microchip: '987654321098765',
        profileImage: '/assets/pets/luna.jpg',
        medicalNotes: 'Esterilizada',
        ownerId: userId || '1',
        vaccinations: [
          {
            id: '3',
            petId: '2',
            name: 'Triple Felina',
            vaccinationType: VaccinationType.FVRCP,
            administrationDate: new Date('2023-07-10'),
            nextDueDate: new Date('2024-07-10'),
            veterinarianId: '2',
            veterinarianName: 'Dra. Martínez',
            clinicName: 'Clínica Veterinaria Norte',
            batchNumber: 'FVRCP-2023-001',
            notes: 'Vacuna anual',
            createdAt: new Date('2023-07-10'),
            updatedAt: new Date('2023-07-10')
          }
        ],
        medicalHistory: [
          {
            id: '2',
            petId: '2',
            veterinarianId: '2',
            veterinarianName: 'Dra. Martínez',
            clinicName: 'Clínica Veterinaria Norte',
            visitDate: new Date('2023-09-15'),
            visitType: MedicalVisitType.CHECKUP,
            diagnosis: 'Chequeo general - Estado saludable',
            treatment: 'Ningún tratamiento necesario',
            medications: [],
            weight: 4.2,
            temperature: 38.8,
            heartRate: 180,
            notes: 'Gata joven en excelente estado',
            followUpDate: new Date('2024-03-15'),
            documentUrls: [],
            cost: 120,
            createdAt: new Date('2023-09-15'),
            updatedAt: new Date('2023-09-15')
          }
        ],
        lastVetVisit: new Date('2023-09-15'),
        nextVetVisit: new Date('2024-03-15'),
        isActive: true,
        createdAt: new Date('2023-02-01'),
        updatedAt: new Date('2023-09-15')
      }
    ];
  }

  generateMockPets(count: number = 20): Pet[] {
    const pets: Pet[] = [];
    const breeds = {
      [PetSpecies.DOG]: ['Golden Retriever', 'Labrador', 'German Shepherd', 'Bulldog', 'Beagle', 'Poodle'],
      [PetSpecies.CAT]: ['Siamés', 'Persa', 'Maine Coon', 'British Shorthair', 'Ragdoll', 'Bengal']
    };

    for (let i = 1; i <= count; i++) {
      const species = i % 2 === 0 ? PetSpecies.DOG : PetSpecies.CAT;
      const gender = i % 2 === 0 ? PetGender.MALE : PetGender.FEMALE;
      const breedOptions = breeds[species];
      
      pets.push({
        id: (i + 2).toString(),
        name: `Pet${i}`,
        species: species,
        breed: breedOptions[i % breedOptions.length],
        age: Math.floor(Math.random() * 15) + 1,
        gender: gender,
        weight: species === PetSpecies.DOG ? Math.random() * 40 + 5 : Math.random() * 8 + 2,
        color: ['Negro', 'Blanco', 'Marrón', 'Gris', 'Dorado', 'Multicolor'][i % 6],
        microchip: `${Math.random().toString().slice(2, 17)}`,
        profileImage: `/assets/pets/pet${i}.jpg`,
        medicalNotes: i % 3 === 0 ? 'Notas médicas especiales' : undefined,
        ownerId: '1',
        vaccinations: [],
        medicalHistory: [],
        lastVetVisit: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        nextVetVisit: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000),
        isActive: true,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      });
    }

    return pets;
  }
}
