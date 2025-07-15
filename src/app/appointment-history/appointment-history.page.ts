import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NavigationHeaderComponent } from '../components/navigation-header.component';
import { UtilityService } from '../services/utility.service';

interface Appointment {
  id: string;
  type: 'veterinaria' | 'grooming';
  petName: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'confirmada' | 'pendiente' | 'completada' | 'cancelada';
  price: string;
  notes?: string;
  veterinarian?: string;
  groomer?: string;
}

@Component({
  selector: 'app-appointment-history',
  templateUrl: './appointment-history.page.html',
  styleUrls: ['./appointment-history.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, ]
})
export class AppointmentHistoryPage implements OnInit {
  appointments: Appointment[] = [
    {
      id: '1',
      type: 'veterinaria',
      petName: 'Max',
      serviceName: 'Consulta General',
      date: '2025-01-15',
      time: '10:00',
      status: 'confirmada',
      price: '$45.000',
      veterinarian: 'Dr. María González',
      notes: 'Chequeo de rutina'
    },
    {
      id: '2',
      type: 'grooming',
      petName: 'Luna',
      serviceName: 'Corte Completo',
      date: '2025-01-10',
      time: '14:30',
      status: 'completada',
      price: '$25.000',
      groomer: 'Carlos Mendez'
    },
    {
      id: '3',
      type: 'veterinaria',
      petName: 'Toby',
      serviceName: 'Vacunación',
      date: '2025-01-20',
      time: '09:15',
      status: 'pendiente',
      price: '$35.000',
      veterinarian: 'Dr. Pedro Ruiz'
    },
    {
      id: '4',
      type: 'grooming',
      petName: 'Bella',
      serviceName: 'Baño Premium',
      date: '2025-01-05',
      time: '16:00',
      status: 'completada',
      price: '$18.000',
      groomer: 'Ana López'
    },
    {
      id: '5',
      type: 'veterinaria',
      petName: 'Rocky',
      serviceName: 'Cirugía Menor',
      date: '2024-12-28',
      time: '11:30',
      status: 'cancelada',
      price: '$120.000',
      veterinarian: 'Dr. Laura Vega',
      notes: 'Cancelada por enfermedad del veterinario'
    }
  ];

  filteredAppointments: Appointment[] = [];
  selectedFilter: string = 'todas';

  stats = {
    total: 0,
    completed: 0,
    pending: 0,
    cancelled: 0
  };

  constructor(
    private router: Router,
    private alertController: AlertController,
    private utilityService: UtilityService
  ) {}

  ngOnInit() {
    this.calculateStats();
    this.filterAppointments('todas');
  }

  calculateStats() {
    this.stats.total = this.appointments.length;
    this.stats.completed = this.appointments.filter(apt => apt.status === 'completada').length;
    this.stats.pending = this.appointments.filter(apt => apt.status === 'pendiente' || apt.status === 'confirmada').length;
    this.stats.cancelled = this.appointments.filter(apt => apt.status === 'cancelada').length;
  }

  filterAppointments(filter: string) {
    this.selectedFilter = filter;
    
    switch (filter) {
      case 'veterinaria':
        this.filteredAppointments = this.appointments.filter(apt => apt.type === 'veterinaria');
        break;
      case 'grooming':
        this.filteredAppointments = this.appointments.filter(apt => apt.type === 'grooming');
        break;
      case 'pendientes':
        this.filteredAppointments = this.appointments.filter(apt => 
          apt.status === 'pendiente' || apt.status === 'confirmada'
        );
        break;
      case 'completadas':
        this.filteredAppointments = this.appointments.filter(apt => apt.status === 'completada');
        break;
      case 'todas':
      default:
        this.filteredAppointments = [...this.appointments];
        break;
    }

    // Ordenar por fecha (más recientes primero)
    this.filteredAppointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'confirmada': return 'primary';
      case 'completada': return 'success';
      case 'pendiente': return 'warning';
      case 'cancelada': return 'danger';
      default: return 'medium';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'confirmada': return 'Confirmada';
      case 'completada': return 'Completada';
      case 'pendiente': return 'Pendiente';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  }

  getTypeIcon(type: string): string {
    return type === 'veterinaria' ? 'medical-outline' : 'cut-outline';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  async showAppointmentDetails(appointment: Appointment) {
    const alert = await this.alertController.create({
      header: `${appointment.serviceName}`,
      message: `
        <div>
          <p><strong>Mascota:</strong> ${appointment.petName}</p>
          <p><strong>Fecha:</strong> ${this.formatDate(appointment.date)}</p>
          <p><strong>Hora:</strong> ${appointment.time}</p>
          <p><strong>Tipo:</strong> ${appointment.type === 'veterinaria' ? 'Veterinaria' : 'Grooming'}</p>
          <p><strong>Estado:</strong> ${this.getStatusText(appointment.status)}</p>
          <p><strong>Precio:</strong> ${appointment.price}</p>
          ${appointment.veterinarian ? `<p><strong>Veterinario:</strong> ${appointment.veterinarian}</p>` : ''}
          ${appointment.groomer ? `<p><strong>Groomer:</strong> ${appointment.groomer}</p>` : ''}
          ${appointment.notes ? `<p><strong>Notas:</strong> ${appointment.notes}</p>` : ''}
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
          text: appointment.status === 'pendiente' ? 'Reagendar' : 'Nueva Cita',
          cssClass: 'confirm-button',
          handler: () => {
            this.scheduleNewAppointment(appointment.type);
          }
        }
      ]
    });

    await alert.present();
  }

  async cancelAppointment(appointment: Appointment) {
    if (appointment.status === 'completada' || appointment.status === 'cancelada') {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Cancelar Cita',
      message: `¿Estás seguro de que quieres cancelar la cita de ${appointment.serviceName} para ${appointment.petName}?`,
      cssClass: 'custom-info-alert',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'cancel-button'
        },
        {
          text: 'Sí, Cancelar',
          cssClass: 'confirm-button',
          handler: () => {
            appointment.status = 'cancelada';
            this.calculateStats();
            this.filterAppointments(this.selectedFilter);
            this.showSuccessMessage('Cita cancelada exitosamente');
          }
        }
      ]
    });

    await alert.present();
  }

  scheduleNewAppointment(type: string) {
    if (type === 'veterinaria') {
      this.router.navigateByUrl('/veterinaria', { replaceUrl: true });
    } else {
      this.router.navigateByUrl('/grooming', { replaceUrl: true });
    }
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

  goToHome() {
    this.utilityService.goToHome();
  }

  goToVeterinaria() {
    this.router.navigateByUrl('/veterinaria', { replaceUrl: true });
  }

  goToGrooming() {
    this.router.navigateByUrl('/grooming', { replaceUrl: true });
  }
}
