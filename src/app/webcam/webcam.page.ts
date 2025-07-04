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
    // Optimización mínima: asegurar que Angular detecte cambios
    Promise.resolve().then(() => {
      // Forzar un ciclo de detección después de la inicialización
    });
  }

  // Tomar foto con la cámara
  async takePicture() {
    this.isLoading = true;
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 1024,
        height: 1024
      });

      this.capturedImage = image.dataUrl;
      
      const alert = await this.alertCtrl.create({
        header: '✅ Foto Capturada',
        message: '¡Foto tomada exitosamente! ¿Qué deseas hacer con ella?',
        cssClass: 'success-alert',
        buttons: [
          {
            text: '👀 Ver Foto',
            cssClass: 'view-button',
            handler: () => {
              this.showImagePreview();
            }
          },
          {
            text: '💾 Guardar',
            cssClass: 'save-button',
            handler: () => {
              this.downloadImage();
            }
          },
          {
            text: 'OK',
            cssClass: 'ok-button'
          }
        ]
      });
      await alert.present();
    } catch (error) {
      const alert = await this.alertCtrl.create({
        header: '❌ Error',
        message: 'No se pudo acceder a la cámara. Asegúrate de dar permisos de cámara a la aplicación.',
        cssClass: 'error-alert',
        buttons: [{
          text: 'Entendido',
          cssClass: 'error-ok-button'
        }]
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
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
        width: 1024,
        height: 1024
      });

      this.capturedImage = image.dataUrl;
      
      const alert = await this.alertCtrl.create({
        header: '✅ Imagen Seleccionada',
        message: '¡Imagen cargada desde la galería! ¿Qué deseas hacer con ella?',
        cssClass: 'success-alert',
        buttons: [
          {
            text: '👀 Ver Imagen',
            cssClass: 'view-button',
            handler: () => {
              this.showImagePreview();
            }
          },
          {
            text: '📤 Compartir',
            cssClass: 'share-button',
            handler: () => {
              this.shareImage();
            }
          },
          {
            text: 'OK',
            cssClass: 'ok-button'
          }
        ]
      });
      await alert.present();
    } catch (error) {
      const alert = await this.alertCtrl.create({
        header: '❌ Error',
        message: 'No se pudo acceder a la galería. Verifica los permisos de almacenamiento.',
        cssClass: 'error-alert',
        buttons: [{
          text: 'Entendido',
          cssClass: 'error-ok-button'
        }]
      });
      await alert.present();
    } finally {
      this.isLoading = false;
    }
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

  // Abrir webcam en vivo
  async openLiveWebcam() {
    const alert = await this.alertCtrl.create({
      header: '📹 Webcam en Vivo',
      subHeader: 'Conecta con las cámaras de nuestras instalaciones',
      message: 'Selecciona qué cámara quieres ver en tiempo real:',
      cssClass: 'live-webcam-alert',
      buttons: [
        {
          text: '🏠 Cámara Principal',
          cssClass: 'main-camera-button',
          handler: () => {
            this.connectToCamera('principal');
          }
        },
        {
          text: '🎮 Área de Juego',
          cssClass: 'play-camera-button',
          handler: () => {
            this.connectToCamera('juego');
          }
        },
        {
          text: '🛏️ Área de Descanso',
          cssClass: 'rest-camera-button',
          handler: () => {
            this.connectToCamera('descanso');
          }
        },
        {
          text: '❌ Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button'
        }
      ]
    });
    await alert.present();
  }

  // Conectar a cámara específica
  async connectToCamera(cameraType: string) {
    const cameraNames: { [key: string]: string } = {
      'principal': 'Cámara Principal',
      'juego': 'Área de Juego',
      'descanso': 'Área de Descanso'
    };

    // Simular conexión
    const loadingAlert = await this.alertCtrl.create({
      header: '🔄 Conectando...',
      message: `Conectando con ${cameraNames[cameraType]}`,
      cssClass: 'loading-alert'
    });
    await loadingAlert.present();

    // Simular tiempo de conexión
    setTimeout(async () => {
      await loadingAlert.dismiss();
      
      const alert = await this.alertCtrl.create({
        header: '📹 ' + cameraNames[cameraType],
        message: `
          <div style="text-align: center; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); height: 200px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; margin-bottom: 15px;">
              🎥 Stream en vivo<br>
              <small style="opacity: 0.8;">Cámara activa</small>
            </div>
            <p style="color: #666; font-size: 14px;">Vista en tiempo real de ${cameraNames[cameraType]}</p>
          </div>
        `,
        cssClass: 'camera-stream-alert',
        buttons: [
          {
            text: '📸 Capturar',
            cssClass: 'capture-button',
            handler: () => {
              this.captureFromStream();
            }
          },
          {
            text: 'Cerrar',
            role: 'cancel',
            cssClass: 'close-button'
          }
        ]
      });
      await alert.present();
    }, 2000);
  }

  // Capturar desde stream en vivo
  async captureFromStream() {
    const alert = await this.alertCtrl.create({
      header: '✅ Captura Realizada',
      message: '¡Imagen capturada desde la webcam en vivo!',
      cssClass: 'success-alert',
      buttons: [{
        text: 'Excelente',
        cssClass: 'ok-button'
      }]
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
  async openWebCam() {
    const alert = await this.alertCtrl.create({
      header: '📷 Opciones de Cámara',
      subHeader: 'Elige una opción para capturar tu foto',
      cssClass: 'camera-options-alert',
      buttons: [
        {
          text: '📸 Tomar Foto',
          cssClass: 'camera-button',
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: '🖼️ Subir desde Galería',
          cssClass: 'gallery-button',
          handler: () => {
            this.selectFromGallery();
          }
        },
        {
          text: '📹 Webcam en Vivo',
          cssClass: 'live-button',
          handler: () => {
            this.openLiveWebcam();
          }
        },
        {
          text: '❌ Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button'
        }
      ]
    });
    await alert.present();
  }

  // Ir a home
  goToHome() {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }

  // Mostrar preview de la imagen capturada
  async showImagePreview() {
    if (!this.capturedImage) return;
    
    const alert = await this.alertCtrl.create({
      header: '📸 Vista Previa',
      message: `
        <div style="text-align: center; padding: 10px;">
          <img src="${this.capturedImage}" style="max-width: 100%; max-height: 300px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
          <p style="margin-top: 15px; color: #666; font-size: 14px;">Tu foto está lista</p>
        </div>
      `,
      cssClass: 'image-preview-alert',
      buttons: [
        {
          text: '💾 Guardar',
          cssClass: 'save-button',
          handler: () => {
            this.downloadImage();
          }
        },
        {
          text: '📤 Compartir',
          cssClass: 'share-button',
          handler: () => {
            this.shareImage();
          }
        },
        {
          text: '🗑️ Eliminar',
          cssClass: 'delete-button',
          handler: () => {
            this.deleteImage();
          }
        },
        {
          text: 'Cerrar',
          role: 'cancel',
          cssClass: 'cancel-button'
        }
      ]
    });
    await alert.present();
  }
}
