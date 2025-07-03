import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, NavController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.page.html',
  styleUrls: ['./webcam.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class WebcamPage implements OnInit {
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  private navCtrl = inject(NavController);

  capturedImage: string | undefined;
  isLoading: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  // Tomar foto con la cámara
  async takePicture() {
    this.isLoading = true;
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      this.capturedImage = image.dataUrl;
      
      const alert = await this.alertCtrl.create({
        header: 'Foto capturada',
        message: '¡Foto tomada exitosamente!',
        buttons: ['OK']
      });
      await alert.present();
    } catch (error) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'No se pudo acceder a la cámara. Asegúrate de dar permisos.',
        buttons: ['OK']
      });
      await alert.present();
    } finally {
      this.isLoading = false;
    }
  }

  // Seleccionar imagen de la galería
  async selectFromGallery() {
    this.isLoading = true;
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      this.capturedImage = image.dataUrl;
      
      const alert = await this.alertCtrl.create({
        header: 'Imagen seleccionada',
        message: '¡Imagen seleccionada de la galería!',
        buttons: ['OK']
      });
      await alert.present();
    } catch (error) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'No se pudo acceder a la galería.',
        buttons: ['OK']
      });
      await alert.present();
    } finally {
      this.isLoading = false;
    }
  }

  // Navegación a reservaciones
  goToReservations() {
    this.showFeatureNotAvailable('Reservaciones');
  }

  // Agendar grooming
  // scheduleGrooming() {
  //   this.showFeatureNotAvailable('Servicio de Grooming');
  // }

  // Contactar veterinario
  // (Método duplicado eliminado para evitar error)

  // Ir a tienda
  goToStore() {
    this.showFeatureNotAvailable('Tienda');
  }

  // Ir a adopción
  // Método duplicado eliminado para evitar error

  // Ir a webcam (página actual)
  goToWebcam() {
    // Ya estamos en webcam
  }

  // Mostrar mensaje de funcionalidad no disponible
  async showFeatureNotAvailable(feature: string) {
    const alert = await this.alertCtrl.create({
      header: 'Próximamente',
      message: `La funcionalidad de ${feature} estará disponible pronto.`,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Mostrar detalles de mascotas
  async showPetDetails(petType: string) {
    const petNames: { [key: string]: string } = {
      'peces': 'Peces',
      'reptiles': 'Reptiles', 
      'roedores': 'Roedores'
    };
    
    const alert = await this.alertCtrl.create({
      header: `${petNames[petType]}`,
      message: `Conoce más sobre nuestros ${petNames[petType].toLowerCase()} y encuentra tu mascota ideal.`,
      buttons: [
        {
          text: 'Ver Catálogo',
          handler: () => {
            this.goToStore();
          }
        },
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  // Abrir webcam en vivo
  async openLiveWebcam() {
    const alert = await this.alertCtrl.create({
      header: 'Webcam en Vivo',
      message: 'Conectando con las cámaras de nuestras instalaciones...',
      buttons: [
        {
          text: 'Cámara Principal',
          handler: () => {
            this.showFeatureNotAvailable('Cámara Principal');
          }
        },
        {
          text: 'Área de Juego',
          handler: () => {
            this.showFeatureNotAvailable('Cámara Área de Juego');
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  // Compartir imagen
  async shareImage() {
    if (!this.capturedImage) return;
    
    const alert = await this.alertCtrl.create({
      header: 'Compartir Foto',
      message: 'Elige cómo quieres compartir tu foto',
      buttons: [
        {
          text: 'Redes Sociales',
          handler: () => {
            this.showFeatureNotAvailable('Compartir en Redes Sociales');
          }
        },
        {
          text: 'Email',
          handler: () => {
            this.showFeatureNotAvailable('Enviar por Email');
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  // Eliminar imagen
  async deleteImage() {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Foto',
      message: '¿Estás seguro de que quieres eliminar esta foto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.capturedImage = undefined;
          }
        }
      ]
    });
    await alert.present();
  }

  // Descargar imagen
  async downloadImage() {
    if (!this.capturedImage) return;
    
    try {
      // En una implementación real, aquí descargarías la imagen
      const alert = await this.alertCtrl.create({
        header: 'Descarga Iniciada',
        message: 'Tu foto se ha guardado en la galería del dispositivo.',
        buttons: ['OK']
      });
      await alert.present();
    } catch (error) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'No se pudo descargar la imagen.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  // Navegación a diferentes páginas
  openWebCam() {
    this.router.navigate(['/camera']);
  }

  scheduleGrooming() {
    this.router.navigate(['/grooming']);
  }

  contactVet() {
    this.router.navigate(['/veterinaria']);
  }

  goToAdoption() {
    this.router.navigate(['/adopcion']);
  }

  openEstancias() {
    this.router.navigate(['/estancias']);
  }

  openReservar() {
    this.router.navigate(['/reservar']);
  }

  // Ir a home
  goToHome() {
    this.router.navigate(['/home']);
  }

  // Ir a login
  goToLogin() {
    this.router.navigate(['/login']);
  }

  // Ir a register
  goToRegister() {
    this.router.navigate(['/register']);
  }

  activateCamera() {
    console.log('Activating camera...');
    // Add logic to activate the Ionic camera service here
  }
}
