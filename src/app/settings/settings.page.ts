import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { UtilityService } from '../services/utility.service';
import { NavigationHeaderComponent } from '../components/navigation-header.component';


interface AppSettings {
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
    appointmentReminders: boolean;
    vaccinationReminders: boolean;
    promotions: boolean;
  };
  privacy: {
    shareDataWithVets: boolean;
    allowAnalytics: boolean;
    publicProfile: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    fontSize: 'small' | 'medium' | 'large';
  };
  account: {
    twoFactorAuth: boolean;
    biometricAuth: boolean;
    autoLogout: boolean;
    autoLogoutTime: number;
  };
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NavigationHeaderComponent]
})
export class SettingsPage implements OnInit {
  settings: AppSettings = {
    notifications: {
      push: true,
      email: true,
      sms: false,
      appointmentReminders: true,
      vaccinationReminders: true,
      promotions: false
    },
    privacy: {
      shareDataWithVets: true,
      allowAnalytics: false,
      publicProfile: false
    },
    appearance: {
      theme: 'light',
      language: 'es',
      fontSize: 'medium'
    },
    account: {
      twoFactorAuth: false,
      biometricAuth: false,
      autoLogout: false,
      autoLogoutTime: 30
    }
  };

  selectedSegment = 'notifications';
  isLoading = false;

  languages = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
    { value: 'pt', label: 'Português' }
  ];

  themes = [
    { value: 'light', label: 'Claro' },
    { value: 'dark', label: 'Oscuro' },
    { value: 'auto', label: 'Automático' }
  ];

  fontSizes = [
    { value: 'small', label: 'Pequeño' },
    { value: 'medium', label: 'Mediano' },
    { value: 'large', label: 'Grande' }
  ];

  autoLogoutTimes = [
    { value: 15, label: '15 minutos' },
    { value: 30, label: '30 minutos' },
    { value: 60, label: '1 hora' },
    { value: 120, label: '2 horas' }
  ];

  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private utilityService: UtilityService
  ) {}

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    // Load settings from local storage or backend
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
    }
  }

  saveSettings() {
    localStorage.setItem('appSettings', JSON.stringify(this.settings));
    this.showToast('Configuración guardada correctamente');
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  onNotificationToggle(setting: keyof AppSettings['notifications']) {
    this.settings.notifications[setting] = !this.settings.notifications[setting];
    this.saveSettings();
  }

  onPrivacyToggle(setting: keyof AppSettings['privacy']) {
    this.settings.privacy[setting] = !this.settings.privacy[setting];
    this.saveSettings();
  }

  onAccountToggle(setting: keyof AppSettings['account']) {
    const accountSetting = this.settings.account[setting];
    if (typeof accountSetting === 'boolean') {
      (this.settings.account as any)[setting] = !accountSetting;
    }
    this.saveSettings();
  }

  onThemeChange(event: any) {
    this.settings.appearance.theme = event.detail.value;
    this.applyTheme(event.detail.value);
    this.saveSettings();
  }

  onLanguageChange(event: any) {
    this.settings.appearance.language = event.detail.value;
    this.saveSettings();
    this.showToast('Idioma cambiado. Reinicia la app para aplicar los cambios.');
  }

  onFontSizeChange(event: any) {
    this.settings.appearance.fontSize = event.detail.value;
    this.applyFontSize(event.detail.value);
    this.saveSettings();
  }

  onAutoLogoutTimeChange(event: any) {
    this.settings.account.autoLogoutTime = event.detail.value;
    this.saveSettings();
  }

  applyTheme(theme: string) {
    // Apply theme to the app
    document.body.setAttribute('color-theme', theme);
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  applyFontSize(fontSize: string) {
    // Apply font size to the app
    document.body.setAttribute('font-size', fontSize);
  }

  async resetAllSettings() {
    const alert = await this.alertController.create({
      header: 'Restablecer Configuración',
      message: '¿Estás seguro de que quieres restablecer toda la configuración a los valores predeterminados?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Restablecer',
          role: 'destructive',
          handler: () => {
            this.resetSettings();
          }
        }
      ],
      cssClass: 'custom-alert'
    });

    await alert.present();
  }

  resetSettings() {
    this.settings = {
      notifications: {
        push: true,
        email: true,
        sms: false,
        appointmentReminders: true,
        vaccinationReminders: true,
        promotions: false
      },
      privacy: {
        shareDataWithVets: true,
        allowAnalytics: false,
        publicProfile: false
      },
      appearance: {
        theme: 'light',
        language: 'es',
        fontSize: 'medium'
      },
      account: {
        twoFactorAuth: false,
        biometricAuth: false,
        autoLogout: false,
        autoLogoutTime: 30
      }
    };

    localStorage.removeItem('appSettings');
    this.applyTheme('light');
    this.applyFontSize('medium');
    this.showToast('Configuración restablecida correctamente');
  }

  async exportSettings() {
    const settingsData = JSON.stringify(this.settings, null, 2);
    
    // Create a blob and download
    const blob = new Blob([settingsData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'petcare-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    
    this.showToast('Configuración exportada correctamente');
  }

  async importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          try {
            const importedSettings = JSON.parse(e.target.result);
            this.settings = { ...this.settings, ...importedSettings };
            this.saveSettings();
            this.applyTheme(this.settings.appearance.theme);
            this.applyFontSize(this.settings.appearance.fontSize);
            this.showToast('Configuración importada correctamente');
          } catch (error) {
            this.showToast('Error al importar la configuración');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  async clearAppData() {
    const alert = await this.alertController.create({
      header: 'Borrar Datos de la App',
      message: '¿Estás seguro de que quieres borrar todos los datos de la aplicación? Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Borrar Todo',
          role: 'destructive',
          handler: () => {
            this.performClearData();
          }
        }
      ],
      cssClass: 'custom-alert'
    });

    await alert.present();
  }

  performClearData() {
    // Clear all app data
    localStorage.clear();
    sessionStorage.clear();
    
    // Reset settings
    this.resetSettings();
    
    this.showToast('Datos de la aplicación borrados');
    
    // Redirect to login
    setTimeout(() => {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }, 2000);
  }

  async showAbout() {
    const alert = await this.alertController.create({
      header: 'Acerca de PetCare',
      message: `
        <div class="about-content">
          <h3>PetCare v1.0.0</h3>
          <p>Tu aplicación de confianza para el cuidado de mascotas</p>
          <br>
          <p><strong>Desarrollado por:</strong> Equipo PetCare</p>
          <p><strong>Licencia:</strong> MIT</p>
          <p><strong>Contacto:</strong> info@petcare.com</p>
          <br>
          <p>© 2024 PetCare. Todos los derechos reservados.</p>
        </div>
      `,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        },
        {
          text: 'Visitar Web',
          handler: () => {
            window.open('https://petcare.com', '_blank');
          }
        }
      ],
      cssClass: 'custom-alert about-alert'
    });

    await alert.present();
  }

  async showPrivacyPolicy() {
    const alert = await this.alertController.create({
      header: 'Política de Privacidad',
      message: `
        <div class="privacy-content">
          <p>En PetCare, valoramos tu privacidad y la de tus mascotas.</p>
          <br>
          <p><strong>Información que recopilamos:</strong></p>
          <ul>
            <li>Información de perfil y mascotas</li>
            <li>Historial de citas y servicios</li>
            <li>Preferencias de la aplicación</li>
          </ul>
          <br>
          <p><strong>Cómo usamos la información:</strong></p>
          <ul>
            <li>Proporcionar servicios personalizados</li>
            <li>Mejorar la experiencia del usuario</li>
            <li>Comunicarnos contigo sobre servicios</li>
          </ul>
          <br>
          <p>Para más información, visita nuestra política completa en nuestra web.</p>
        </div>
      `,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        },
        {
          text: 'Leer Completa',
          handler: () => {
            window.open('https://petcare.com/privacy', '_blank');
          }
        }
      ],
      cssClass: 'custom-alert privacy-alert'
    });

    await alert.present();
  }

  async showTermsOfService() {
    const alert = await this.alertController.create({
      header: 'Términos de Servicio',
      message: `
        <div class="terms-content">
          <p>Al usar PetCare, aceptas los siguientes términos:</p>
          <br>
          <p><strong>Uso de la aplicación:</strong></p>
          <ul>
            <li>Proporcionar información veraz sobre tus mascotas</li>
            <li>Respetar a otros usuarios y profesionales</li>
            <li>No usar la app para fines ilegales</li>
          </ul>
          <br>
          <p><strong>Responsabilidades:</strong></p>
          <ul>
            <li>La información médica es solo referencial</li>
            <li>Siempre consulta con un veterinario profesional</li>
            <li>Mantienes la responsabilidad sobre tus mascotas</li>
          </ul>
          <br>
          <p>Para más información, visita nuestros términos completos en nuestra web.</p>
        </div>
      `,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        },
        {
          text: 'Leer Completos',
          handler: () => {
            window.open('https://petcare.com/terms', '_blank');
          }
        }
      ],
      cssClass: 'custom-alert terms-alert'
    });

    await alert.present();
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: 'success',
      cssClass: 'custom-toast'
    });
    await toast.present();
  }

  goBack() {
    this.utilityService.goToHome();
  }
}
