import { Component, OnInit, inject } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UtilityService } from '../services/utility.service';
import { NavigationHeaderComponent } from '../components/navigation-header.component';

@Component({
  selector: 'app-adopcion',
  templateUrl: './adopcion.page.html',
  styleUrls: ['./adopcion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, ]
})
export class AdopcionPage implements OnInit {
  private alertCtrl = inject(AlertController);
  private router = inject(Router);
  private utilityService = inject(UtilityService);
  
  // Loading state
  isLoading = false;
  
  // Stats
  totalAnimals = 0;
  adoptedAnimals = 12;
  availableSpecies = 3;
  
  // Modal properties
  isModalOpen = false;
  modalTitle = '';
  currentAnimals: any[] = [];
  selectedAnimal: any = null;

  // Catálogos de animales
  roedores = [
    {
      id: 1,
      name: 'Luna',
      species: 'Hámster Dorado',
      age: '6 meses',
      size: 'Pequeño',
      care: 'Básico',
      temperament: 'Dócil y juguetón',
      description: 'Luna es una hámster muy activa y cariñosa, ideal para familias con niños.',
      image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=300&fit=crop&auto=format',
      price: '$25.000',
      status: 'available',
      forAdoption: false
    },
    {
      id: 2,
      name: 'Coco',
      species: 'Cobaya',
      age: '1 año',
      size: 'Mediano',
      care: 'Intermedio',
      temperament: 'Sociable y tranquilo',
      description: 'Coco es muy sociable y le encanta interactuar con las personas.',
      image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400&h=300&fit=crop&auto=format',
      price: '$35.000',
      status: 'available',
      forAdoption: true
    },
    {
      id: 3,
      name: 'Nuez',
      species: 'Chinchilla',
      age: '8 meses',
      size: 'Mediano',
      care: 'Avanzado',
      temperament: 'Activo y curioso',
      description: 'Nuez es una chinchilla muy activa que necesita mucho ejercicio.',
      image: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=400&h=300&fit=crop&auto=format',
      price: '$80.000',
      status: 'available',
      forAdoption: false
    },
    {
      id: 4,
      name: 'Whiskers',
      species: 'Rata Dumbo',
      age: '4 meses',
      size: 'Pequeño',
      care: 'Básico',
      temperament: 'Inteligente y cariñoso',
      description: 'Whiskers es muy inteligente y forma vínculos fuertes con sus dueños.',
      image: 'https://images.unsplash.com/photo-1606215777292-2306b3995ddb?w=400&h=300&fit=crop&auto=format',
      price: '$18.000',
      status: 'available',
      forAdoption: true
    }
  ];

  reptiles = [
    {
      id: 5,
      name: 'Esmeralda',
      species: 'Gecko Leopardo',
      age: '2 años',
      size: 'Mediano',
      care: 'Intermedio',
      temperament: 'Tranquilo y nocturno',
      description: 'Esmeralda es un gecko muy tranquilo, ideal para principiantes en reptiles.',
      image: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=400&h=300&fit=crop&auto=format',
      price: '$120.000',
      status: 'available',
      forAdoption: false
    },
    {
      id: 6,
      name: 'Spike',
      species: 'Dragón Barbudo',
      age: '1.5 años',
      size: 'Grande',
      care: 'Avanzado',
      temperament: 'Dócil y sociable',
      description: 'Spike es un dragón barbudo muy sociable que disfruta de la interacción.',
      image: 'https://images.unsplash.com/photo-1544717684-4b6e1ae8f7f9?w=400&h=300&fit=crop&auto=format',
      price: '$200.000',
      status: 'available',
      forAdoption: true
    },
    {
      id: 7,
      name: 'Sasha',
      species: 'Serpiente del Maíz',
      age: '3 años',
      size: 'Mediano',
      care: 'Intermedio',
      temperament: 'Tranquilo y manejable',
      description: 'Sasha es una serpiente muy tranquila, perfecta para quienes buscan una mascota única.',
      image: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=400&h=300&fit=crop&auto=format',
      price: '$90.000',
      status: 'available',
      forAdoption: false
    },
    {
      id: 8,
      name: 'Tortuga',
      species: 'Tortuga Rusa',
      age: '5 años',
      size: 'Mediano',
      care: 'Básico',
      temperament: 'Tranquilo y longevo',
      description: 'Una tortuga rusa muy longeva que puede vivir más de 50 años.',
      image: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=400&h=300&fit=crop&auto=format',
      price: '$150.000',
      status: 'available',
      forAdoption: true
    }
  ];

  peces = [
    {
      id: 9,
      name: 'Nemo',
      species: 'Pez Betta',
      age: '6 meses',
      size: 'Pequeño',
      care: 'Básico',
      temperament: 'Territorial pero hermoso',
      description: 'Nemo es un pez betta de colores vibrantes, ideal para acuarios pequeños.',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&auto=format',
      price: '$15.000',
      status: 'available',
      forAdoption: false
    },
    {
      id: 10,
      name: 'Dory',
      species: 'Pez Ángel',
      age: '1 año',
      size: 'Mediano',
      care: 'Intermedio',
      temperament: 'Pacífico y elegante',
      description: 'Dory es un pez ángel muy elegante que necesita un acuario bien establecido.',
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop&auto=format',
      price: '$35.000',
      status: 'available',
      forAdoption: true
    },
    {
      id: 11,
      name: 'Goldie',
      species: 'Pez Dorado',
      age: '8 meses',
      size: 'Mediano',
      care: 'Básico',
      temperament: 'Activo y resistente',
      description: 'Goldie es un pez dorado muy resistente, perfecto para principiantes.',
      image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c35a?w=400&h=300&fit=crop&auto=format',
      price: '$8.000',
      status: 'available',
      forAdoption: false
    },
    {
      id: 12,
      name: 'Coral',
      species: 'Pez Guppy',
      age: '3 meses',
      size: 'Pequeño',
      care: 'Básico',
      temperament: 'Pacífico y colorido',
      description: 'Coral es un guppy muy colorido que se reproduce fácilmente.',
      image: 'https://images.unsplash.com/photo-1605020420620-20c943cc4669?w=400&h=300&fit=crop&auto=format',
      price: '$5.000',
      status: 'available',
      forAdoption: true
    }
  ];

  constructor() { }

  ngOnInit() {
    console.log('Adopción page initialized');
    this.calculateStats();
  }

  // Modal methods for animal catalog
  openAnimalModal(category: string) {
    this.selectedAnimal = null;
    
    switch (category) {
      case 'roedores':
        this.modalTitle = 'Roedores Disponibles';
        this.currentAnimals = this.roedores;
        break;
      case 'reptiles':
        this.modalTitle = 'Reptiles Disponibles';
        this.currentAnimals = this.reptiles;
        break;
      case 'peces':
        this.modalTitle = 'Peces Disponibles';
        this.currentAnimals = this.peces;
        break;
      default:
        this.modalTitle = 'Animales Disponibles';
        this.currentAnimals = [];
    }
    
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedAnimal = null;
    this.currentAnimals = [];
    this.modalTitle = '';
  }

  selectAnimal(animal: any) {
    this.selectedAnimal = animal;
  }

  async processAdoption(animal: any) {
    const isAdoption = animal.forAdoption;
    const action = isAdoption ? 'adopción' : 'compra';
    const actionTitle = isAdoption ? 'Solicitar Adopción' : 'Proceder a Compra';
    
    const alert = await this.alertCtrl.create({
      header: actionTitle,
      message: `¿Estás seguro de que quieres proceder con la ${action} de ${animal.name}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.processConfirmation(animal, isAdoption);
          }
        }
      ]
    });

    await alert.present();
  }

  async processConfirmation(animal: any, isAdoption: boolean) {
    const successAlert = await this.alertCtrl.create({
      header: 'Éxito',
      message: isAdoption 
        ? `Tu solicitud de adopción para ${animal.name} ha sido enviada. Te contactaremos pronto.`
        : `Compra de ${animal.name} procesada exitosamente. Te contactaremos para coordinar la entrega.`,
      buttons: ['OK']
    });
    
    await successAlert.present();
    
    // Update animal status
    animal.status = isAdoption ? 'adoption-pending' : 'sold';
    
    // Close modal
    this.closeModal();
  }

  // Handle image loading errors
  onImageError(event: any) {
    const img = event.target;
    img.style.display = 'none';
    
    // Create placeholder element
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.innerHTML = '🐾';
    placeholder.style.cssText = `
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      opacity: 0.5;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
    `;
    
    // Replace image with placeholder
    if (img.parentElement) {
      img.parentElement.appendChild(placeholder);
    }
  }
  
  // Nuevos métodos para la funcionalidad moderna
  
  calculateStats() {
    this.totalAnimals = this.roedores.length + this.reptiles.length + this.peces.length;
  }
  
  getAnimalCount(category: string): number {
    switch(category) {
      case 'roedores': return this.roedores.filter(animal => animal.status === 'available').length;
      case 'reptiles': return this.reptiles.filter(animal => animal.status === 'available').length;
      case 'peces': return this.peces.filter(animal => animal.status === 'available').length;
      default: return 0;
    }
  }
  
  // Ir a home
  goToHome() {
    this.utilityService.goToHome();
  }
  
  // Método de navegación hacia atrás
  goBack() {
    this.utilityService.goBack();
  }
  
  // Mostrar proceso de adopción
  async showAdoptionProcess() {
    const alert = await this.alertCtrl.create({
      header: '🏠 Proceso de Adopción',
      message: `
        <div style="text-align: left; line-height: 1.6;">
          <p><strong>Pasos para adoptar:</strong></p>
          <p>1. 📋 Llena el formulario de adopción</p>
          <p>2. 🏠 Visita domiciliaria</p>
          <p>3. 💬 Entrevista con el equipo</p>
          <p>4. 🎉 ¡Adopta a tu nueva mascota!</p>
          <br>
          <p><strong>Requisitos:</strong></p>
          <p>• Ser mayor de 18 años</p>
          <p>• Tener vivienda adecuada</p>
          <p>• Compromiso de cuidado</p>
        </div>
      `,
      cssClass: 'custom-info-alert',
      buttons: [
        {
          text: 'Iniciar Adopción',
          cssClass: 'confirm-button',
          handler: () => {
            this.startAdoptionProcess();
          }
        },
        {
          text: 'Cerrar',
          cssClass: 'cancel-button'
        }
      ]
    });
    await alert.present();
  }
  
  // Mostrar mis adopciones
  async showMyAdoptions() {
    const alert = await this.alertCtrl.create({
      header: '💙 Mis Adopciones',
      message: `
        <div style="text-align: left; line-height: 1.6;">
          <p><strong>Adopciones en proceso:</strong></p>
          <p>🐰 Coco (Cobaya) - En revisión</p>
          <p>🐠 Nemo (Pez Ángel) - Aprobado</p>
          <br>
          <p><strong>Adopciones completadas:</strong></p>
          <p>🐹 Max (Hámster) - Adoptado hace 2 meses</p>
        </div>
      `,
      cssClass: 'custom-info-alert',
      buttons: [
        {
          text: 'Ver Detalles',
          cssClass: 'confirm-button'
        },
        {
          text: 'Cerrar',
          cssClass: 'cancel-button'
        }
      ]
    });
    await alert.present();
  }
  
  // Iniciar proceso de adopción
  startAdoptionProcess() {
    // Aquí se puede implementar la lógica para iniciar el proceso
    console.log('Iniciando proceso de adopción...');
  }
}
