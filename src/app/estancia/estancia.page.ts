import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { NavigationHeaderComponent } from '../components/navigation-header.component';
import { UtilityService } from '../services/utility.service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-estancia',
  templateUrl: './estancia.page.html',
  styleUrls: ['./estancia.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, NavigationHeaderComponent]
})
export class EstanciaPage implements OnInit {

  // Datos de ejemplo para la estancia
  stats = {
    totalAnimals: 45,
    availableSpaces: 12,
    satisfaction: 98,
    avgStay: 7
  };

  services = [
    {
      name: 'Estancia Diurna',
      description: 'Cuidado durante el día mientras trabajas',
      price: '$25.000/día',
      icon: 'sunny-outline',
      duration: '8 horas'
    },
    {
      name: 'Estancia Nocturna', 
      description: 'Cuidado nocturno para tu mascota',
      price: '$35.000/noche',
      icon: 'moon-outline',
      duration: '12 horas'
    },
    {
      name: 'Estancia Semanal',
      description: 'Cuidado completo por una semana',
      price: '$150.000/semana',
      icon: 'calendar-outline',
      duration: '7 días'
    },
    {
      name: 'Estancia de Emergencia',
      description: 'Disponible 24/7 para emergencias',
      price: '$50.000/día',
      icon: 'medical-outline',
      duration: 'Flexible'
    }
  ];

  // Datos de ubicación
  userLocation: { latitude: number, longitude: number } | null = null;
  nearbyEstancias: any[] = [];
  isLoadingLocation = false;

  // Estancias de ejemplo con coordenadas
  estancias = [
    {
      id: 1,
      name: 'Estancia Pet Paradise',
      address: 'Calle 123 #45-67, Bogotá',
      latitude: 4.6097,
      longitude: -74.0817,
      distance: 0,
      rating: 4.8,
      availableSpaces: 5,
      priceRange: '$20.000 - $50.000',
      image: 'assets/img/estancia1.jpg',
      phone: '+57 300 123 4567',
      specialties: ['Perros grandes', 'Gatos', 'Cuidado médico']
    },
    {
      id: 2,
      name: 'Hogar Temporal Mascotas',
      address: 'Carrera 15 #78-90, Bogotá',
      latitude: 4.6351,
      longitude: -74.0703,
      distance: 0,
      rating: 4.6,
      availableSpaces: 8,
      priceRange: '$18.000 - $45.000',
      image: 'assets/img/estancia2.jpg',
      phone: '+57 301 234 5678',
      specialties: ['Perros pequeños', 'Animales exóticos', 'Entrenamiento']
    },
    {
      id: 3,
      name: 'Pet Care Center',
      address: 'Avenida 68 #25-30, Bogotá',
      latitude: 4.6482,
      longitude: -74.0559,
      distance: 0,
      rating: 4.9,
      availableSpaces: 3,
      priceRange: '$25.000 - $60.000',
      image: 'assets/img/estancia3.jpg',
      phone: '+57 302 345 6789',
      specialties: ['Cuidado premium', 'Spa para mascotas', 'Guardería']
    },
    {
      id: 4,
      name: 'Refugio Amigo Fiel',
      address: 'Calle 85 #12-34, Bogotá',
      latitude: 4.6736,
      longitude: -74.0473,
      distance: 0,
      rating: 4.7,
      availableSpaces: 12,
      priceRange: '$15.000 - $40.000',
      image: 'assets/img/estancia4.jpg',
      phone: '+57 303 456 7890',
      specialties: ['Rescate', 'Rehabilitación', 'Adopción']
    },
    {
      id: 5,
      name: 'VIP Pet Hotel',
      address: 'Zona Rosa, Calle 82 #11-15, Bogotá',
      latitude: 4.6658,
      longitude: -74.0545,
      distance: 0,
      rating: 4.9,
      availableSpaces: 6,
      priceRange: '$40.000 - $80.000',
      image: 'assets/img/estancia5.jpg',
      phone: '+57 304 567 8901',
      specialties: ['Lujo', 'Spa', 'Servicio 24/7']
    }
  ];

  constructor(
    private router: Router,
    private utilityService: UtilityService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.loadNearbyEstancias();
  }

  // Función para obtener la ubicación del usuario y cargar estancias cercanas
  async loadNearbyEstancias(): Promise<void> {
    try {
      this.isLoadingLocation = true;
      
      // Mostrar loading
      const loading = await this.loadingController.create({
        message: 'Buscando estancias cercanas...',
        spinner: 'circles'
      });
      await loading.present();

      // Solicitar permisos de geolocalización
      const permissions = await Geolocation.requestPermissions();
      
      if (permissions.location === 'granted') {
        // Obtener ubicación actual
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000
        });

        this.userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };

        // Calcular distancias y ordenar estancias
        this.calculateDistances();
        this.nearbyEstancias = this.estancias
          .filter(estancia => estancia.distance <= 50) // Máximo 50 km
          .sort((a, b) => a.distance - b.distance);

        this.utilityService.showToast('Estancias cercanas encontradas', 'success');
      } else {
        // Si no se conceden permisos, usar ubicación por defecto (Bogotá centro)
        this.userLocation = {
          latitude: 4.6097,
          longitude: -74.0817
        };
        this.calculateDistances();
        this.nearbyEstancias = this.estancias.sort((a, b) => a.distance - b.distance);
        this.utilityService.showToast('Usando ubicación por defecto', 'warning');
      }

      await loading.dismiss();
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      
      // Usar ubicación por defecto en caso de error
      this.userLocation = {
        latitude: 4.6097,
        longitude: -74.0817
      };
      this.calculateDistances();
      this.nearbyEstancias = this.estancias.sort((a, b) => a.distance - b.distance);
      
      this.utilityService.showToast('Error obteniendo ubicación, mostrando todas las estancias', 'warning');
      
      if (this.isLoadingLocation) {
        const loading = await this.loadingController.getTop();
        if (loading) {
          await loading.dismiss();
        }
      }
    } finally {
      this.isLoadingLocation = false;
    }
  }

  // Función para calcular distancias usando fórmula de Haversine
  private calculateDistances(): void {
    if (!this.userLocation) return;

    this.estancias.forEach(estancia => {
      estancia.distance = this.calculateDistance(
        this.userLocation!.latitude,
        this.userLocation!.longitude,
        estancia.latitude,
        estancia.longitude
      );
    });
  }

  // Fórmula de Haversine para calcular distancia entre dos puntos
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // Redondear a 1 decimal
  }

  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Función para refrescar la ubicación
  async refreshLocation(): Promise<void> {
    await this.loadNearbyEstancias();
  }

  // Función para ver detalles de una estancia
  async viewEstanciaDetails(estancia: any): Promise<void> {
    const alert = await this.alertController.create({
      header: estancia.name,
      message: `
        <div style="text-align: left;">
          <p><strong>📍 Dirección:</strong><br>${estancia.address}</p>
          <p><strong>📞 Teléfono:</strong><br>${estancia.phone}</p>
          <p><strong>⭐ Calificación:</strong> ${estancia.rating}/5</p>
          <p><strong>🏠 Espacios disponibles:</strong> ${estancia.availableSpaces}</p>
          <p><strong>💰 Rango de precios:</strong><br>${estancia.priceRange}</p>
          <p><strong>🎯 Especialidades:</strong><br>${estancia.specialties.join(', ')}</p>
          <p><strong>📏 Distancia:</strong> ${estancia.distance} km</p>
        </div>
      `,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        },
        {
          text: 'Llamar',
          handler: () => {
            this.callEstancia(estancia);
          }
        },
        {
          text: 'Reservar',
          handler: () => {
            this.reserveEstancia(estancia);
          }
        }
      ]
    });
    await alert.present();
  }

  async callEstancia(estancia: any): Promise<void> {
    this.utilityService.showToast(`Llamando a ${estancia.name}...`, 'success');
    // Aquí podrías implementar la funcionalidad de llamada real
    // window.open(`tel:${estancia.phone}`, '_system');
  }

  async reserveEstancia(estancia: any): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Reservar Estancia',
      message: `¿Deseas reservar una estancia en ${estancia.name}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.utilityService.showToast(`Reserva en ${estancia.name} confirmada`, 'success');
            // Aquí podrías navegar a una página de reserva o enviar datos al backend
          }
        }
      ]
    });
    await alert.present();
  }

  async reserveStay(service: any): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Reservar Estancia',
      message: `¿Deseas reservar ${service.name}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Reservar',
          handler: () => {
            this.utilityService.showToast(`Reserva de ${service.name} confirmada`, 'success');
          }
        }
      ]
    });
    await alert.present();
  }

  async viewSchedule(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Horarios Disponibles',
      message: 'Consulta nuestros horarios de estancia disponibles',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        },
        {
          text: 'Ver Calendario',
          handler: () => {
            // Aquí podrías navegar a una página de calendario
            this.utilityService.showToast('Funcionalidad de calendario próximamente', 'primary');
          }
        }
      ]
    });
    await alert.present();
  }

  async contactUs(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Contacto',
      message: '¿Cómo prefieres contactarnos?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'WhatsApp',
          handler: () => {
            this.utilityService.showToast('Abriendo WhatsApp...', 'success');
          }
        },
        {
          text: 'Llamar',
          handler: () => {
            this.utilityService.showToast('Iniciando llamada...', 'success');
          }
        }
      ]
    });
    await alert.present();
  }

}
