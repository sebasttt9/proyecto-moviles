import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, NavController, ModalController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Interfaces basadas en el esquema de BD
interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  description?: string;
  status: 'AVAILABLE' | 'ADOPTED' | 'IN_TREATMENT' | 'DROPPED_OFF';
  ownerId?: string;
}

interface Appointment {
  id: string;
  userId: string;
  petId: string;
  petName: string;
  date: string;
  reason?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  formattedDate: string;
  cameraUrl?: string;
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  hasAppointment: boolean;
  isDisabled: boolean;
  fullDate: Date;
}

@Component({
  selector: 'app-veterinaria',
  templateUrl: './veterinaria.page.html',
  styleUrls: ['./veterinaria.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule]
})
export class VeterinariaPage implements OnInit {
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  private navCtrl = inject(NavController);
  private modalCtrl = inject(ModalController);

  // Estado de la página
  isLoading: boolean = false;
  showCalendar: boolean = false;
  
  // Estadísticas
  totalAppointments: number = 0;
  upcomingAppointments: number = 0;
  totalPets: number = 0;

  // Datos de citas
  recentAppointments: Appointment[] = [];
  userPets: Pet[] = [];
  
  // Calendario
  currentDate: Date = new Date();
  selectedDate: Date | null = null;
  currentMonthYear: string = '';
  weekDays: string[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  calendarDays: CalendarDay[] = [];

  // Horarios disponibles
  availableTimeSlots: string[] = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30'
  ];

  constructor() { }

  ngOnInit() {
    this.loadData();
    this.generateCalendar();
    this.updateMonthYear();
  }

  // Cargar datos iniciales
  loadData() {
    // Simular datos de mascotas del usuario
    this.userPets = [
      {
        id: '1',
        name: 'Max',
        species: 'Perro',
        breed: 'Golden Retriever',
        age: 3,
        status: 'AVAILABLE',
        ownerId: 'user1'
      },
      {
        id: '2',
        name: 'Luna',
        species: 'Gato',
        breed: 'Siamés',
        age: 2,
        status: 'AVAILABLE',
        ownerId: 'user1'
      }
    ];

    // Simular citas recientes
    this.recentAppointments = [
      {
        id: '1',
        userId: 'user1',
        petId: '1',
        petName: 'Max',
        date: '2025-01-10T10:00:00',
        reason: 'Consulta general',
        status: 'SCHEDULED',
        formattedDate: '10 Ene, 10:00 AM'
      },
      {
        id: '2',
        userId: 'user1',
        petId: '2',
        petName: 'Luna',
        date: '2025-01-05T15:30:00',
        reason: 'Vacunación',
        status: 'COMPLETED',
        formattedDate: '5 Ene, 3:30 PM'
      }
    ];

    // Actualizar estadísticas
    this.totalAppointments = this.recentAppointments.length;
    this.upcomingAppointments = this.recentAppointments.filter(
      app => app.status === 'SCHEDULED' && new Date(app.date) > new Date()
    ).length;
    this.totalPets = this.userPets.length;
  }

  // Generar calendario
  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    this.calendarDays = [];
    
    // Días del mes anterior
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = prevMonth.getDate() - i;
      this.calendarDays.push({
        date: date,
        isCurrentMonth: false,
        isSelected: false,
        isToday: false,
        hasAppointment: false,
        isDisabled: true,
        fullDate: new Date(year, month - 1, date)
      });
    }
    
    // Días del mes actual
    const today = new Date();
    for (let date = 1; date <= daysInMonth; date++) {
      const fullDate = new Date(year, month, date);
      const isToday = fullDate.toDateString() === today.toDateString();
      const isSelected = this.selectedDate?.toDateString() === fullDate.toDateString();
      const hasAppointment = this.hasAppointmentOnDate(fullDate);
      const isDisabled = fullDate < today;
      
      this.calendarDays.push({
        date: date,
        isCurrentMonth: true,
        isSelected: isSelected,
        isToday: isToday,
        hasAppointment: hasAppointment,
        isDisabled: isDisabled,
        fullDate: fullDate
      });
    }
    
    // Días del mes siguiente
    const remainingDays = 42 - this.calendarDays.length;
    for (let date = 1; date <= remainingDays; date++) {
      this.calendarDays.push({
        date: date,
        isCurrentMonth: false,
        isSelected: false,
        isToday: false,
        hasAppointment: false,
        isDisabled: true,
        fullDate: new Date(year, month + 1, date)
      });
    }
  }

  // Verificar si hay citas en una fecha
  hasAppointmentOnDate(date: Date): boolean {
    return this.recentAppointments.some(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.toDateString() === date.toDateString();
    });
  }

  // Actualizar el título del mes y año
  updateMonthYear() {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    this.currentMonthYear = `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }

  // Navegar a mes anterior
  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
    this.updateMonthYear();
  }

  // Navegar a mes siguiente
  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
    this.updateMonthYear();
  }

  // Seleccionar fecha
  selectDate(day: CalendarDay) {
    if (day.isDisabled || !day.isCurrentMonth) return;
    
    // Desmarcar fecha anterior
    this.calendarDays.forEach(d => d.isSelected = false);
    
    // Marcar nueva fecha
    day.isSelected = true;
    this.selectedDate = day.fullDate;
    
    // Mostrar horarios disponibles
    this.showAvailableTimeSlots(day.fullDate);
  }

  // Mostrar horarios disponibles
  async showAvailableTimeSlots(date: Date) {
    const formattedDate = date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const alert = await this.alertCtrl.create({
      header: '🕐 Horarios Disponibles',
      subHeader: formattedDate,
      cssClass: 'time-slots-alert',
      buttons: [
        ...this.availableTimeSlots.map(time => ({
          text: time,
          cssClass: 'time-slot-button',
          handler: () => {
            this.selectTimeAndProceed(date, time);
          }
        })),
        {
          text: '❌ Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button'
        }
      ]
    });

    await alert.present();
  }

  // Seleccionar hora y proceder
  selectTimeAndProceed(date: Date, time: string) {
    const [hours, minutes] = time.split(':').map(Number);
    const appointmentDate = new Date(date);
    appointmentDate.setHours(hours, minutes, 0, 0);
    
    this.proceedWithAppointment(appointmentDate);
  }

  // Proceder con la cita
  async proceedWithAppointment(date: Date) {
    if (this.userPets.length === 0) {
      const alert = await this.alertCtrl.create({
        header: '⚠️ Sin Mascotas',
        message: 'Primero debes registrar una mascota para agendar una cita.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const alert = await this.alertCtrl.create({
      header: '🐾 Selecciona tu Mascota',
      cssClass: 'pet-selection-alert',
      buttons: [
        ...this.userPets.map(pet => ({
          text: `${pet.name} (${pet.species})`,
          cssClass: 'pet-button',
          handler: () => {
            this.showAppointmentForm(date, pet);
          }
        })),
        {
          text: '❌ Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button'
        }
      ]
    });

    await alert.present();
  }

  // Mostrar formulario de cita
  async showAppointmentForm(date: Date, pet: Pet) {
    const alert = await this.alertCtrl.create({
      header: '📝 Nueva Cita Médica',
      subHeader: `${pet.name} - ${date.toLocaleString('es-ES')}`,
      cssClass: 'appointment-form-alert',
      inputs: [
        {
          name: 'reason',
          type: 'textarea',
          placeholder: 'Motivo de la consulta (opcional)',
          attributes: {
            rows: 3
          }
        }
      ],
      buttons: [
        {
          text: '❌ Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button'
        },
        {
          text: '✅ Agendar Cita',
          cssClass: 'confirm-button',
          handler: (data) => {
            this.createAppointment(date, pet, data.reason);
          }
        }
      ]
    });

    await alert.present();
  }

  // Crear cita
  async createAppointment(date: Date, pet: Pet, reason: string) {
    this.isLoading = true;

    try {
      // Simular creación de cita
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        userId: 'user1',
        petId: pet.id,
        petName: pet.name,
        date: date.toISOString(),
        reason: reason || 'Consulta general',
        status: 'SCHEDULED',
        formattedDate: date.toLocaleString('es-ES', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      // Agregar a la lista
      this.recentAppointments.unshift(newAppointment);
      
      // Actualizar estadísticas
      this.totalAppointments++;
      this.upcomingAppointments++;
      
      // Regenerar calendario
      this.generateCalendar();

      const successAlert = await this.alertCtrl.create({
        header: '✅ Cita Agendada',
        message: `Tu cita para ${pet.name} ha sido agendada exitosamente para el ${date.toLocaleString('es-ES')}.`,
        cssClass: 'success-alert',
        buttons: [
          {
            text: 'Ver Citas',
            cssClass: 'view-button',
            handler: () => {
              this.showMyAppointments();
            }
          },
          {
            text: 'OK',
            cssClass: 'ok-button'
          }
        ]
      });

      await successAlert.present();

    } catch (error) {
      const errorAlert = await this.alertCtrl.create({
        header: '❌ Error',
        message: 'No se pudo agendar la cita. Inténtalo nuevamente.',
        cssClass: 'error-alert',
        buttons: ['OK']
      });
      await errorAlert.present();
    } finally {
      this.isLoading = false;
    }
  }

  // Mostrar modal de nueva cita
  async showNewAppointmentModal() {
    this.showCalendar = true;
    
    const alert = await this.alertCtrl.create({
      header: '📅 Agendar Nueva Cita',
      message: 'Selecciona una fecha en el calendario para continuar.',
      cssClass: 'info-alert',
      buttons: [
        {
          text: 'Entendido',
          cssClass: 'ok-button'
        }
      ]
    });
    
    await alert.present();
  }

  // Mostrar mis citas
  async showMyAppointments() {
    if (this.recentAppointments.length === 0) {
      const alert = await this.alertCtrl.create({
        header: '📋 Sin Citas',
        message: 'No tienes citas agendadas. ¡Agenda tu primera cita!',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const appointmentsList = this.recentAppointments
      .map(app => `${app.petName} - ${app.formattedDate} (${app.status})`)
      .join('\n');

    const alert = await this.alertCtrl.create({
      header: '📋 Mis Citas',
      message: appointmentsList,
      cssClass: 'appointments-list-alert',
      buttons: ['OK']
    });

    await alert.present();
  }

  // Mostrar detalles de cita
  async showAppointmentDetails(appointment: Appointment) {
    const alert = await this.alertCtrl.create({
      header: '📋 Detalles de la Cita',
      message: `
        <div class="appointment-details">
          <p><strong>Mascota:</strong> ${appointment.petName}</p>
          <p><strong>Fecha:</strong> ${appointment.formattedDate}</p>
          <p><strong>Motivo:</strong> ${appointment.reason}</p>
          <p><strong>Estado:</strong> ${appointment.status}</p>
        </div>
      `,
      cssClass: 'appointment-details-alert',
      buttons: [
        {
          text: '📹 Ver Cámara',
          cssClass: 'camera-button',
          handler: () => {
            this.viewAppointmentCamera(appointment);
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

  // Ver cámara de la cita
  async viewAppointmentCamera(appointment: Appointment) {
    const alert = await this.alertCtrl.create({
      header: '📹 Cámara en Vivo',
      message: `
        <div style="text-align: center; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea, #764ba2); height: 200px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; margin-bottom: 15px;">
            🎥 Transmisión en vivo<br>
            <small style="opacity: 0.8;">${appointment.petName}</small>
          </div>
          <p style="color: #666; font-size: 14px;">Vista en tiempo real durante la consulta</p>
        </div>
      `,
      cssClass: 'camera-alert',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
          cssClass: 'close-button'
        }
      ]
    });

    await alert.present();
  }

  // Obtener color del estado
  getStatusColor(status: string): string {
    switch (status) {
      case 'SCHEDULED': return 'primary';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'danger';
      default: return 'medium';
    }
  }

  // Ir a home
  goToHome() {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }
}
