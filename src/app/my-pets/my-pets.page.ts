import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { UtilityService } from '../services/utility.service';
import { NavigationHeaderComponent } from '../components/navigation-header.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  weight: number;
  color: string;
  microchip?: string;
  medicalNotes?: string;
  profileImage?: string;
  vaccinations: Vaccination[];
  lastVetVisit?: Date;
  nextVetVisit?: Date;
}

interface Vaccination {
  id: string;
  name: string;
  date: Date;
  nextDue?: Date;
  veterinarian: string;
  notes?: string;
}

@Component({
  selector: 'app-my-pets',
  templateUrl: './my-pets.page.html',
  styleUrls: ['./my-pets.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NavigationHeaderComponent]
})
export class MyPetsPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  pets: Pet[] = [];
  isLoading = false;
  selectedSegment = 'pets';
  
  // Form data for adding/editing pets
  petForm: Partial<Pet> = {
    name: '',
    species: 'dog',
    breed: '',
    age: 0,
    gender: 'male',
    weight: 0,
    color: '',
    microchip: '',
    medicalNotes: '',
    vaccinations: []
  };

  showAddForm = false;
  editingPet: Pet | null = null;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController,
    private utilityService: UtilityService
  ) {}

  ngOnInit() {
    this.loadPets();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack() {
    this.utilityService.goToHome();
  }

  loadPets() {
    this.isLoading = true;
    
    // Simulate loading pets from storage/backend
    setTimeout(() => {
      this.pets = this.getMockPets();
      this.isLoading = false;
    }, 1000);
  }

  getMockPets(): Pet[] {
    return [
      {
        id: '1',
        name: 'Max',
        species: 'dog',
        breed: 'Golden Retriever',
        age: 3,
        gender: 'male',
        weight: 28.5,
        color: 'Dorado',
        microchip: '123456789012345',
        medicalNotes: 'Alérgico al pollo',
        profileImage: '/assets/pets/max.jpg',
        vaccinations: [
          {
            id: '1',
            name: 'Rabia',
            date: new Date('2023-06-15'),
            nextDue: new Date('2024-06-15'),
            veterinarian: 'Dr. García',
            notes: 'Vacuna anual'
          }
        ],
        lastVetVisit: new Date('2023-08-20'),
        nextVetVisit: new Date('2024-02-20')
      },
      {
        id: '2',
        name: 'Luna',
        species: 'cat',
        breed: 'Siamés',
        age: 2,
        gender: 'female',
        weight: 4.2,
        color: 'Gris y blanco',
        microchip: '987654321098765',
        medicalNotes: 'Esterilizada',
        profileImage: '/assets/pets/luna.jpg',
        vaccinations: [
          {
            id: '2',
            name: 'Triple Felina',
            date: new Date('2023-07-10'),
            nextDue: new Date('2024-07-10'),
            veterinarian: 'Dra. Martínez',
            notes: 'Vacuna anual'
          }
        ],
        lastVetVisit: new Date('2023-09-15'),
        nextVetVisit: new Date('2024-03-15')
      }
    ];
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  addPet() {
    this.showAddForm = true;
    this.editingPet = null;
    this.resetForm();
  }

  editPet(pet: Pet) {
    this.editingPet = pet;
    this.petForm = { ...pet };
    this.showAddForm = true;
  }

  async deletePet(pet: Pet) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que quieres eliminar a ${pet.name}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.pets = this.pets.filter(p => p.id !== pet.id);
            this.showSuccessAlert('Mascota eliminada correctamente');
          }
        }
      ],
      cssClass: 'custom-alert'
    });

    await alert.present();
  }

  async savePet() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      if (this.editingPet) {
        // Update existing pet
        const index = this.pets.findIndex(p => p.id === this.editingPet!.id);
        if (index !== -1) {
          this.pets[index] = { ...this.editingPet, ...this.petForm };
        }
        this.showSuccessAlert('Mascota actualizada correctamente');
      } else {
        // Add new pet
        const newPet: Pet = {
          id: Date.now().toString(),
          ...this.petForm,
          vaccinations: this.petForm.vaccinations || []
        } as Pet;
        this.pets.push(newPet);
        this.showSuccessAlert('Mascota agregada correctamente');
      }

      this.isLoading = false;
      this.cancelForm();
    }, 1000);
  }

  validateForm(): boolean {
    if (!this.petForm.name || !this.petForm.breed || this.petForm.age! <= 0) {
      this.showErrorAlert('Por favor completa todos los campos obligatorios');
      return false;
    }
    return true;
  }

  cancelForm() {
    this.showAddForm = false;
    this.editingPet = null;
    this.resetForm();
  }

  resetForm() {
    this.petForm = {
      name: '',
      species: 'dog',
      breed: '',
      age: 0,
      gender: 'male',
      weight: 0,
      color: '',
      microchip: '',
      medicalNotes: '',
      vaccinations: []
    };
  }

  async showPetDetails(pet: Pet) {
    const alert = await this.alertController.create({
      header: pet.name,
      message: `
        <div class="pet-details">
          <p><strong>Especie:</strong> ${pet.species === 'dog' ? 'Perro' : 'Gato'}</p>
          <p><strong>Raza:</strong> ${pet.breed}</p>
          <p><strong>Edad:</strong> ${pet.age} años</p>
          <p><strong>Género:</strong> ${pet.gender === 'male' ? 'Macho' : 'Hembra'}</p>
          <p><strong>Peso:</strong> ${pet.weight} kg</p>
          <p><strong>Color:</strong> ${pet.color}</p>
          ${pet.microchip ? `<p><strong>Microchip:</strong> ${pet.microchip}</p>` : ''}
          ${pet.medicalNotes ? `<p><strong>Notas médicas:</strong> ${pet.medicalNotes}</p>` : ''}
          <p><strong>Vacunas:</strong> ${pet.vaccinations.length} registradas</p>
        </div>
      `,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        },
        {
          text: 'Editar',
          handler: () => {
            this.editPet(pet);
          }
        }
      ],
      cssClass: 'custom-alert pet-details-alert'
    });

    await alert.present();
  }

  async showVaccinationDetails(pet: Pet) {
    const vaccinationList = pet.vaccinations.map(v => `
      <div class="vaccination-item">
        <strong>${v.name}</strong><br>
        Fecha: ${v.date.toLocaleDateString()}<br>
        ${v.nextDue ? `Próxima: ${v.nextDue.toLocaleDateString()}` : ''}<br>
        Veterinario: ${v.veterinarian}
      </div>
    `).join('');

    const alert = await this.alertController.create({
      header: `Vacunas de ${pet.name}`,
      message: vaccinationList || 'No hay vacunas registradas',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        },
        {
          text: 'Agregar Vacuna',
          handler: () => {
            this.addVaccination(pet);
          }
        }
      ],
      cssClass: 'custom-alert vaccination-details-alert'
    });

    await alert.present();
  }

  async addVaccination(pet: Pet) {
    const alert = await this.alertController.create({
      header: 'Agregar Vacuna',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre de la vacuna'
        },
        {
          name: 'veterinarian',
          type: 'text',
          placeholder: 'Veterinario'
        },
        {
          name: 'notes',
          type: 'textarea',
          placeholder: 'Notas (opcional)'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.name && data.veterinarian) {
              const newVaccination: Vaccination = {
                id: Date.now().toString(),
                name: data.name,
                date: new Date(),
                veterinarian: data.veterinarian,
                notes: data.notes || ''
              };
              
              pet.vaccinations.push(newVaccination);
              this.showSuccessAlert('Vacuna agregada correctamente');
            }
          }
        }
      ],
      cssClass: 'custom-alert'
    });

    await alert.present();
  }

  getPetIcon(species: string): string {
    return species === 'dog' ? 'paw' : 'heart';
  }

  getPetAge(age: number): string {
    return age === 1 ? '1 año' : `${age} años`;
  }

  getVaccinationStatus(pet: Pet): string {
    const now = new Date();
    const overdueVaccinations = pet.vaccinations.filter(v => 
      v.nextDue && v.nextDue < now
    );
    
    if (overdueVaccinations.length > 0) {
      return 'overdue';
    }
    
    const upcomingVaccinations = pet.vaccinations.filter(v => 
      v.nextDue && v.nextDue > now && v.nextDue <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    );
    
    if (upcomingVaccinations.length > 0) {
      return 'upcoming';
    }
    
    return 'up-to-date';
  }

  isVaccinationOverdue(vaccination: Vaccination): boolean {
    if (!vaccination.nextDue) return false;
    return vaccination.nextDue < new Date();
  }

  getVaccinationIcon(vaccination: Vaccination): string {
    return this.isVaccinationOverdue(vaccination) ? 'warning' : 'checkmark-circle';
  }

  getVaccinationColor(vaccination: Vaccination): string {
    return this.isVaccinationOverdue(vaccination) ? 'warning' : 'success';
  }

  async showSuccessAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: message,
      buttons: ['OK'],
      cssClass: 'custom-alert success-alert'
    });
    await alert.present();
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK'],
      cssClass: 'custom-alert error-alert'
    });
    await alert.present();
  }
}
