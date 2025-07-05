import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { UtilityService } from '../services/utility.service';
import { NavigationHeaderComponent } from '../components/navigation-header.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface NavigationCard {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  action?: () => Promise<void>;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [CommonModule, IonicModule, RouterModule, NavigationHeaderComponent],
  standalone: true
})
export class HomePage implements OnInit, OnDestroy {
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  private utilityService = inject(UtilityService);
  private destroy$ = new Subject<void>();
  
  isLoading = false;
  userEmail = '';

  navigationCards: NavigationCard[] = [
    {
      title: 'Adopción',
      description: 'Encuentra tu nuevo compañero',
      icon: 'heart',
      route: '/adopcion',
      color: 'danger',
      action: () => this.navigateToPage('/adopcion')
    },
    {
      title: 'Grooming',
      description: 'Cuidado y belleza para tu mascota',
      icon: 'cut',
      route: '/grooming',
      color: 'secondary',
      action: () => this.navigateToPage('/grooming')
    },
    {
      title: 'Veterinaria',
      description: 'Consultas y citas médicas',
      icon: 'medical',
      route: '/veterinaria',
      color: 'success',
      action: () => this.navigateToPage('/veterinaria')
    },
    {
      title: 'Webcam',
      description: 'Monitoreo en tiempo real',
      icon: 'videocam',
      route: '/webcam',
      color: 'warning',
      action: () => this.navigateToPage('/webcam')
    },
    {
      title: 'Mis Mascotas',
      description: 'Gestiona tus compañeros',
      icon: 'paw',
      route: '/my-pets',
      color: 'tertiary',
      action: () => this.navigateToPage('/my-pets')
    },
    {
      title: 'Mi Perfil',
      description: 'Configuración de cuenta',
      icon: 'person',
      route: '/profile',
      color: 'medium',
      action: () => this.navigateToPage('/profile')
    }
  ];

  constructor() {}

  ngOnInit() {
    this.loadUserData();
    this.setupLoadingSubscription();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.utilityService.cleanup();
  }

  private loadUserData(): void {
    try {
      this.userEmail = this.utilityService.getItem<string>('userEmail') || 'Usuario';
    } catch (error) {
      this.utilityService.handleError(error, 'HomePage.loadUserData');
    }
  }

  private setupLoadingSubscription(): void {
    this.utilityService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
      });
  }

  async navigateToPage(route: string): Promise<void> {
    try {
      await this.utilityService.showLoading('Navegando...');
      await this.router.navigateByUrl(route, { replaceUrl: true });
    } catch (error) {
      this.utilityService.handleError(error, 'HomePage.navigateToPage');
    } finally {
      await this.utilityService.hideLoading();
    }
  }

  async onCardClick(card: NavigationCard): Promise<void> {
    if (card.action) {
      await card.action();
    } else {
      await this.navigateToPage(card.route);
    }
  }

  async goToStore(): Promise<void> {
    await this.utilityService.showAlert(
      'Tienda',
      'La tienda estará disponible próximamente. ¡Mantente atento a las actualizaciones!'
    );
  }

  async goToAppointmentHistory(): Promise<void> {
    await this.navigateToPage('/appointment-history');
  }

  async goToSettings(): Promise<void> {
    await this.navigateToPage('/settings');
  }

  // Emergency contact functionality
  async callEmergencyVet(): Promise<void> {
    const confirmed = await this.utilityService.showConfirm(
      'Llamada de Emergencia',
      '¿Deseas llamar al veterinario de emergencia?'
    );
    
    if (confirmed) {
      try {
        // Replace with actual emergency number
        window.open('tel:+34911234567');
      } catch (error) {
        this.utilityService.handleError(error, 'HomePage.callEmergencyVet');
      }
    }
  }

  // Logout functionality
  async logout(): Promise<void> {
    const confirmed = await this.utilityService.showConfirm(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?'
    );
    
    if (confirmed) {
      try {
        this.utilityService.removeItem('userToken');
        this.utilityService.removeItem('userEmail');
        await this.router.navigateByUrl('/login', { replaceUrl: true });
        await this.utilityService.showSuccessToast('Sesión cerrada correctamente');
      } catch (error) {
        this.utilityService.handleError(error, 'HomePage.logout');
      }
    }
  }

  // Quick actions
  async showQuickActions(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Acciones Rápidas',
      buttons: [
        {
          text: 'Emergencia Veterinaria',
          handler: () => this.callEmergencyVet()
        },
        {
          text: 'Historial de Citas',
          handler: () => this.goToAppointmentHistory()
        },
        {
          text: 'Configuración',
          handler: () => this.goToSettings()
        },
        {
          text: 'Cerrar Sesión',
          handler: () => this.logout()
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ],
      cssClass: 'custom-alert'
    });
    await alert.present();
  }

  // Navigation methods for template compatibility
  async goToMyPets(): Promise<void> {
    await this.navigateToPage('/my-pets');
  }

  async goToProfile(): Promise<void> {
    await this.navigateToPage('/profile');
  }
}