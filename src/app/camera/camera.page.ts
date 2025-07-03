import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CameraPage implements OnInit {
  private router = inject(Router);
  private location = inject(Location);
  private alertCtrl = inject(AlertController);
  private loadingCtrl = inject(LoadingController);

  capturedImage: string | undefined;
  isLoading: boolean = false;
  isConnected: boolean = false;

  constructor() { }

  ngOnInit() {
    // Simular conexión después de 2 segundos
    setTimeout(() => {
      this.isConnected = true;
    }, 2000);
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
        buttons: [
          {
            text: 'Tomar otra',
            handler: () => {
              this.capturedImage = undefined;
              this.takePicture();
            }
          },
          {
            text: 'OK',
            role: 'cancel'
          }
        ]
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

  // Regresar a la página anterior
  goBack() {
    console.log('Going back to webcam...');
    this.location.back();
  }
}
