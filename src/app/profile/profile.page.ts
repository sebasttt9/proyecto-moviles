import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationHeaderComponent } from '../components/navigation-header.component';
import { UtilityService } from '../services/utility.service';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  emergencyContact: string;
  emergencyPhone: string;
  profileImage: string;
  memberSince: string;
  totalAppointments: number;
  favoriteServices: string[];
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, ReactiveFormsModule, ]
})
export class ProfilePage implements OnInit {
  isEditing = false;
  profileForm: FormGroup;
  
  userProfile: UserProfile = {
    id: '1',
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'admin@example.com',
    phone: '+57 300 123 4567',
    address: 'Calle 123 #45-67',
    city: 'Bogotá',
    emergencyContact: 'María Pérez',
    emergencyPhone: '+57 300 765 4321',
    profileImage: 'assets/icon/user-avatar.png',
    memberSince: '2023-01-15',
    totalAppointments: 24,
    favoriteServices: ['Consulta General', 'Corte Completo', 'Vacunación']
  };

  stats = {
    totalPets: 3,
    completedAppointments: 18,
    upcomingAppointments: 2,
    loyaltyPoints: 450
  };

  constructor(
    private router: Router,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private fb: FormBuilder,
    private utilityService: UtilityService
  ) {
    this.profileForm = this.fb.group({
      firstName: [this.userProfile.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [this.userProfile.lastName, [Validators.required, Validators.minLength(2)]],
      email: [this.userProfile.email, [Validators.required, Validators.email]],
      phone: [this.userProfile.phone, [Validators.required]],
      address: [this.userProfile.address, [Validators.required]],
      city: [this.userProfile.city, [Validators.required]],
      emergencyContact: [this.userProfile.emergencyContact, [Validators.required]],
      emergencyPhone: [this.userProfile.emergencyPhone, [Validators.required]]
    });
  }

  ngOnInit() {
    // Inicialización si es necesaria
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    
    if (!this.isEditing) {
      // Si cancelamos la edición, restauramos los valores originales
      this.profileForm.patchValue({
        firstName: this.userProfile.firstName,
        lastName: this.userProfile.lastName,
        email: this.userProfile.email,
        phone: this.userProfile.phone,
        address: this.userProfile.address,
        city: this.userProfile.city,
        emergencyContact: this.userProfile.emergencyContact,
        emergencyPhone: this.userProfile.emergencyPhone
      });
    }
  }

  async saveProfile() {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;
      
      // Aquí se conectaría con el backend
      this.userProfile = { ...this.userProfile, ...formData };
      this.isEditing = false;
      
      const alert = await this.alertController.create({
        header: 'Perfil Actualizado',
        message: 'Tu información ha sido guardada exitosamente.',
        cssClass: 'custom-info-alert',
        buttons: [
          {
            text: 'OK',
            cssClass: 'confirm-button'
          }
        ]
      });
      
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor completa todos los campos correctamente.',
        cssClass: 'custom-info-alert',
        buttons: [
          {
            text: 'OK',
            cssClass: 'cancel-button'
          }
        ]
      });
      
      await alert.present();
    }
  }

  async changeProfileImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Cambiar Foto de Perfil',
      cssClass: 'custom-action-sheet',
      buttons: [
        {
          text: 'Tomar Foto',
          icon: 'camera-outline',
          handler: () => {
            this.takePhoto();
          }
        },
        {
          text: 'Seleccionar de Galería',
          icon: 'images-outline',
          handler: () => {
            this.selectFromGallery();
          }
        },
        {
          text: 'Cancelar',
          icon: 'close-outline',
          role: 'cancel'
        }
      ]
    });
    
    await actionSheet.present();
  }

  takePhoto() {
    // Aquí se implementaría la lógica de la cámara
    console.log('Tomando foto...');
  }

  selectFromGallery() {
    // Aquí se implementaría la lógica de la galería
    console.log('Seleccionando de galería...');
  }

  async changePassword() {
    const alert = await this.alertController.create({
      header: 'Cambiar Contraseña',
      cssClass: 'custom-info-alert',
      inputs: [
        {
          name: 'currentPassword',
          type: 'password',
          placeholder: 'Contraseña actual'
        },
        {
          name: 'newPassword',
          type: 'password',
          placeholder: 'Nueva contraseña'
        },
        {
          name: 'confirmPassword',
          type: 'password',
          placeholder: 'Confirmar nueva contraseña'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button'
        },
        {
          text: 'Cambiar',
          cssClass: 'confirm-button',
          handler: (data) => {
            if (data.newPassword !== data.confirmPassword) {
              this.showErrorMessage('Las contraseñas no coinciden');
              return false;
            }
            if (data.newPassword.length < 6) {
              this.showErrorMessage('La contraseña debe tener al menos 6 caracteres');
              return false;
            }
            // Aquí se conectaría con el backend
            this.showSuccessMessage('Contraseña cambiada exitosamente');
            return true;
          }
        }
      ]
    });
    
    await alert.present();
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      cssClass: 'custom-info-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button'
        },
        {
          text: 'Cerrar Sesión',
          cssClass: 'confirm-button',
          handler: () => {
            // Aquí se limpiarían los datos de sesión
            this.router.navigateByUrl('/login', { replaceUrl: true });
          }
        }
      ]
    });
    
    await alert.present();
  }

  async deleteAccount() {
    const alert = await this.alertController.create({
      header: 'Eliminar Cuenta',
      message: '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.',
      cssClass: 'custom-info-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button'
        },
        {
          text: 'Eliminar',
          cssClass: 'confirm-button',
          handler: () => {
            // Aquí se conectaría con el backend para eliminar la cuenta
            this.showSuccessMessage('Cuenta eliminada exitosamente');
            this.router.navigateByUrl('/login', { replaceUrl: true });
          }
        }
      ]
    });
    
    await alert.present();
  }

  async showSuccessMessage(message: string) {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: message,
      cssClass: 'custom-info-alert',
      buttons: [
        {
          text: 'OK',
          cssClass: 'confirm-button'
        }
      ]
    });
    
    await alert.present();
  }

  async showErrorMessage(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      cssClass: 'custom-info-alert',
      buttons: [
        {
          text: 'OK',
          cssClass: 'cancel-button'
        }
      ]
    });
    
    await alert.present();
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['minlength']) return `${fieldName} es muy corto`;
    }
    return '';
  }

  getMembershipDuration(): string {
    const memberSince = new Date(this.userProfile.memberSince);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - memberSince.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    
    if (diffMonths < 1) {
      return `${diffDays} días`;
    } else if (diffMonths < 12) {
      return `${diffMonths} meses`;
    } else {
      const years = Math.floor(diffMonths / 12);
      const remainingMonths = diffMonths % 12;
      return `${years} ${years === 1 ? 'año' : 'años'}${remainingMonths > 0 ? ` y ${remainingMonths} meses` : ''}`;
    }
  }

  goToHome() {
    this.utilityService.goToHome();
  }

  goToAppointmentHistory() {
    this.router.navigateByUrl('/appointment-history', { replaceUrl: true });
  }

  goToMyPets() {
    this.router.navigateByUrl('/my-pets', { replaceUrl: true });
  }
}
