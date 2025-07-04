import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [CommonModule, IonicModule, RouterModule],
  standalone: true
})
export class HomePage implements OnInit {
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  
  isLoading = false;

  constructor() {}

  ngOnInit() {
    console.log('Home page initialized');
  }

  async goToAdoption() {
    console.log('🚀 goToAdoption called');
    this.router.navigateByUrl('/adopcion', { replaceUrl: true });
  }

  async goToStore() {
    const alert = await this.alertCtrl.create({
      header: 'Tienda',
      message: 'La tienda estará disponible próximamente.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async goToProfile() {
    const alert = await this.alertCtrl.create({
      header: 'Perfil',
      message: 'La sección de perfil estará disponible próximamente.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async goToServices() {
    const alert = await this.alertCtrl.create({
      header: '🎯 Servicios Disponibles',
      subHeader: 'Selecciona el servicio que necesitas',
      cssClass: 'custom-services-alert',
      buttons: [
        {
          text: '📹 Web Cam',
          cssClass: 'webcam-button',
          handler: () => {
            this.router.navigateByUrl('/webcam', { replaceUrl: true });
          }
        },
        {
          text: '✂️ Grooming',
          cssClass: 'grooming-button',
          handler: () => {
            this.router.navigateByUrl('/grooming', { replaceUrl: true });
          }
        },
        {
          text: '🏥 Veterinaria',
          cssClass: 'vet-button',
          handler: () => {
            this.router.navigateByUrl('/veterinaria', { replaceUrl: true });
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
}
