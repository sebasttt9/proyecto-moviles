import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.page.html',
  styleUrls: ['./webcam.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class WebcamPage implements OnInit {
  private router = inject(Router);
  private alertCtrl = inject(AlertController);

  constructor() { }

  ngOnInit() {
  }

  // Navegación a reservaciones
  goToReservations() {
    this.showFeatureNotAvailable('Reservaciones');
  }

  // Agendar grooming
  scheduleGrooming() {
    this.showFeatureNotAvailable('Servicio de Grooming');
  }

  // Contactar veterinario
  contactVet() {
    this.showFeatureNotAvailable('Atención Veterinaria');
  }

  // Ir a tienda
  goToStore() {
    this.showFeatureNotAvailable('Tienda');
  }

  // Ir a adopción
  goToAdoption() {
    this.showFeatureNotAvailable('Adopción');
  }

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
}
