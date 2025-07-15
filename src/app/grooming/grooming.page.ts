import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NavigationHeaderComponent } from '../components/navigation-header.component';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-grooming',
  templateUrl: './grooming.page.html',
  styleUrls: ['./grooming.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, ]
})
export class GroomingPage implements OnInit {
  stats = {
    totalGrooming: 1250,
    satisfaction: 98,
    avgTime: 45
  };
  
  services = [
    {
      icon: 'cut-outline',
      name: 'Corte Completo',
      description: 'Corte de pelo completo según la raza y preferencias',
      price: '$25.000',
      details: {
        duration: '45-60 minutos',
        includes: [
          'Consulta sobre el estilo más adecuado',
          'Corte personalizado según la raza',
          'Arreglo de pelo facial y patas',
          'Acabado profesional con tijeras',
          'Cepillado final'
        ],
        process: 'Nuestro proceso comienza con una evaluación del tipo de pelo y condición de la mascota. Utilizamos técnicas especializadas para cada raza, asegurando un corte que realce la belleza natural de tu mascota.',
        aftercare: 'Recomendaciones de cuidado post-corte y productos para mantener el pelo saludable.'
      }
    },
    {
      icon: 'water-outline',
      name: 'Baño Premium',
      description: 'Baño con productos especializados y secado',
      price: '$18.000',
      details: {
        duration: '30-45 minutos',
        includes: [
          'Baño con shampoo especializado',
          'Acondicionador nutritivo',
          'Secado profesional',
          'Cepillado durante el secado',
          'Perfume para mascotas'
        ],
        process: 'Utilizamos productos hipoalergénicos y agua a temperatura ideal. El proceso incluye masaje relajante durante el baño y secado gradual para evitar estrés.',
        aftercare: 'Tu mascota quedará completamente limpia, con pelo suave y aroma fresco que durará días.'
      }
    },
    {
      icon: 'brush-outline',
      name: 'Cepillado',
      description: 'Cepillado profundo y desenredado',
      price: '$12.000',
      details: {
        duration: '20-30 minutos',
        includes: [
          'Desenredado suave y cuidadoso',
          'Cepillado profundo por capas',
          'Eliminación de pelo muerto',
          'Masaje estimulante',
          'Revisión de la piel'
        ],
        process: 'Utilizamos diferentes tipos de cepillos según el tipo de pelo. Proceso gradual y paciencioso para mascotas sensibles.',
        aftercare: 'Mejora la circulación, reduce la caída de pelo en casa y deja el pelaje brillante y saludable.'
      }
    },
    {
      icon: 'paw-outline',
      name: 'Corte de Uñas',
      description: 'Corte y limado de uñas profesional',
      price: '$8.000',
      details: {
        duration: '15-20 minutos',
        includes: [
          'Corte preciso de uñas',
          'Limado suave de bordes',
          'Revisión de almohadillas',
          'Desinfección de herramientas',
          'Consejos de mantenimiento'
        ],
        process: 'Técnica profesional que evita cortar la parte viva de la uña. Especial cuidado para mascotas nerviosas.',
        aftercare: 'Uñas en longitud ideal, mejor caminar y menos riesgo de arañazos accidentales.'
      }
    },
    {
      icon: 'ear-outline',
      name: 'Limpieza Oídos',
      description: 'Limpieza profunda y cuidado de oídos',
      price: '$10.000',
      details: {
        duration: '15-25 minutos',
        includes: [
          'Inspección detallada del oído',
          'Limpieza con productos especializados',
          'Eliminación de cera y suciedad',
          'Secado cuidadoso',
          'Detección de posibles problemas'
        ],
        process: 'Proceso delicado usando productos veterinarios. Técnica segura que no daña el canal auditivo.',
        aftercare: 'Previene infecciones, elimina malos olores y mejora la salud auditiva de tu mascota.'
      }
    },
    {
      icon: 'sparkles-outline',
      name: 'Paquete Completo',
      description: 'Todos los servicios incluidos',
      price: '$60.000',
      details: {
        duration: '90-120 minutos',
        includes: [
          'Todos los servicios anteriores',
          'Limpieza dental básica',
          'Revisión general de salud',
          'Fotografía profesional de antes/después',
          'Certificado de grooming',
          '15% de descuento'
        ],
        process: 'Experiencia completa de spa para mascotas. Atención personalizada y tiempo sin prisa para máximo confort.',
        aftercare: 'Tu mascota sale completamente renovada, saludable y hermosa. Incluye plan de mantenimiento.'
      }
    }
  ];
  
  constructor(
    private router: Router,
    private alertController: AlertController,
    private utilityService: UtilityService
  ) {}
  
  ngOnInit() {
    // Inicialización si es necesaria
  }
  
  goToHome() {
    this.utilityService.goToHome();
  }
  
  async scheduleAppointment() {
    const alert = await this.alertController.create({
      header: 'Agendar Cita de Grooming',
      message: `
        <div>
          <p><strong>Horarios Disponibles:</strong></p>
          <p>• Lunes a Viernes: 8:00 AM - 6:00 PM</p>
          <p>• Sábados: 9:00 AM - 4:00 PM</p>
          <p>• Domingos: 10:00 AM - 2:00 PM</p>
          <br>
          <p><strong>Información:</strong></p>
          <p>• Duración promedio: 45 minutos</p>
          <p>• Se requiere cita previa</p>
          <p>• Descuentos por paquetes</p>
        </div>
      `,
      cssClass: 'custom-info-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button'
        },
        {
          text: 'Llamar Ahora',
          cssClass: 'confirm-button',
          handler: () => {
            console.log('Redirigiendo a llamada...');
          }
        }
      ]
    });
    
    await alert.present();
  }
  
  async viewPrices() {
    const alert = await this.alertController.create({
      header: 'Lista de Precios',
      message: `
        <div>
          <p><strong>Servicios Individuales:</strong></p>
          <p>• Corte Completo: $25.000</p>
          <p>• Baño Premium: $18.000</p>
          <p>• Cepillado: $12.000</p>
          <p>• Corte de Uñas: $8.000</p>
          <p>• Limpieza Oídos: $10.000</p>
          <br>
          <p><strong>Paquetes Especiales:</strong></p>
          <p>• Paquete Completo: $60.000</p>
          <p>• Descuento por 3 servicios: 10%</p>
        </div>
      `,
      cssClass: 'custom-info-alert',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
          cssClass: 'cancel-button'
        },
        {
          text: 'Agendar',
          cssClass: 'confirm-button',
          handler: () => {
            this.scheduleAppointment();
          }
        }
      ]
    });
    
    await alert.present();
  }
  
  async showServiceDetails(service: any) {
    const alert = await this.alertController.create({
      header: service.name,
      message: `
        <div>
          <div class="service-detail-header">
            <p><strong>Duración:</strong> ${service.details.duration}</p>
            <p><strong>Precio:</strong> ${service.price}</p>
          </div>
          
          <div class="service-process">
            <h4>¿Qué incluye?</h4>
            <ul>
              ${service.details.includes.map((item: string) => `<li>${item}</li>`).join('')}
            </ul>
          </div>
          
          <div class="service-process">
            <h4>Proceso:</h4>
            <p>${service.details.process}</p>
          </div>
          
          <div class="service-aftercare">
            <h4>Beneficios:</h4>
            <p>${service.details.aftercare}</p>
          </div>
        </div>
      `,
      cssClass: 'custom-service-alert',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
          cssClass: 'cancel-button'
        },
        {
          text: 'Agendar',
          cssClass: 'confirm-button',
          handler: () => {
            this.scheduleServiceAppointment(service);
          }
        }
      ]
    });
    
    await alert.present();
  }
  
  async scheduleServiceAppointment(service: any) {
    const alert = await this.alertController.create({
      header: `Agendar ${service.name}`,
      message: `
        <div>
          <p><strong>Servicio:</strong> ${service.name}</p>
          <p><strong>Precio:</strong> ${service.price}</p>
          <p><strong>Duración:</strong> ${service.details.duration}</p>
          <br>
          <p><strong>Horarios Disponibles:</strong></p>
          <p>• Lunes a Viernes: 8:00 AM - 6:00 PM</p>
          <p>• Sábados: 9:00 AM - 4:00 PM</p>
          <p>• Domingos: 10:00 AM - 2:00 PM</p>
          <br>
          <p><strong>Información:</strong></p>
          <p>• Se requiere cita previa</p>
          <p>• Lleva la cartilla de vacunación</p>
          <p>• Mascota en ayunas (solo agua)</p>
        </div>
      `,
      cssClass: 'custom-info-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button'
        },
        {
          text: 'Llamar Ahora',
          cssClass: 'confirm-button',
          handler: () => {
            console.log(`Agendando cita para: ${service.name}`);
            // Aquí se conectará con tu base de datos Appointment
          }
        }
      ]
    });
    
    await alert.present();
  }
}
