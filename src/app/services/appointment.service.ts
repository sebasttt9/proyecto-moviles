import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { 
  Appointment, 
  AppointmentType, 
  AppointmentStatus, 
  ApiResponse,
  PaginatedResponse,
  SearchFilters,
  Veterinarian,
  VeterinarySpecialization,
  TimeSlot 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);
  public appointments$ = this.appointmentsSubject.asObservable();

  private selectedAppointmentSubject = new BehaviorSubject<Appointment | null>(null);
  public selectedAppointment$ = this.selectedAppointmentSubject.asObservable();

  constructor() {
    this.loadAppointments();
  }

  // Appointment CRUD operations
  async loadAppointments(userId?: string): Promise<void> {
    setTimeout(() => {
      const appointments = this.getMockAppointments(userId);
      this.appointmentsSubject.next(appointments);
    }, 500);
  }

  async getAppointmentById(appointmentId: string): Promise<ApiResponse<Appointment>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const appointments = this.appointmentsSubject.value;
        const appointment = appointments.find(a => a.id === appointmentId);
        
        if (appointment) {
          resolve({
            success: true,
            data: appointment,
            timestamp: new Date()
          });
        } else {
          resolve({
            success: false,
            error: 'Appointment not found',
            timestamp: new Date()
          });
        }
      }, 300);
    });
  }

  async createAppointment(appointmentData: Partial<Appointment>): Promise<ApiResponse<Appointment>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAppointment: Appointment = {
          id: Date.now().toString(),
          userId: appointmentData.userId!,
          petId: appointmentData.petId!,
          petName: appointmentData.petName!,
          veterinarianId: appointmentData.veterinarianId!,
          veterinarianName: appointmentData.veterinarianName!,
          clinicId: appointmentData.clinicId!,
          clinicName: appointmentData.clinicName!,
          appointmentDate: appointmentData.appointmentDate!,
          duration: appointmentData.duration || 30,
          appointmentType: appointmentData.appointmentType!,
          status: AppointmentStatus.SCHEDULED,
          reason: appointmentData.reason!,
          notes: appointmentData.notes,
          cost: appointmentData.cost,
          reminderSent: false,
          followUpRequired: false,
          followUpDate: appointmentData.followUpDate,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const currentAppointments = this.appointmentsSubject.value;
        this.appointmentsSubject.next([...currentAppointments, newAppointment]);

        resolve({
          success: true,
          data: newAppointment,
          message: 'Appointment created successfully',
          timestamp: new Date()
        });
      }, 1000);
    });
  }

  async updateAppointment(appointmentId: string, appointmentData: Partial<Appointment>): Promise<ApiResponse<Appointment>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentAppointments = this.appointmentsSubject.value;
        const appointmentIndex = currentAppointments.findIndex(a => a.id === appointmentId);
        
        if (appointmentIndex !== -1) {
          const updatedAppointment: Appointment = {
            ...currentAppointments[appointmentIndex],
            ...appointmentData,
            updatedAt: new Date()
          };
          
          const updatedAppointments = [...currentAppointments];
          updatedAppointments[appointmentIndex] = updatedAppointment;
          this.appointmentsSubject.next(updatedAppointments);

          resolve({
            success: true,
            data: updatedAppointment,
            message: 'Appointment updated successfully',
            timestamp: new Date()
          });
        } else {
          resolve({
            success: false,
            error: 'Appointment not found',
            timestamp: new Date()
          });
        }
      }, 800);
    });
  }

  async cancelAppointment(appointmentId: string, reason?: string): Promise<ApiResponse<boolean>> {
    return this.updateAppointment(appointmentId, { 
      status: AppointmentStatus.CANCELLED,
      notes: reason ? `Cancelled: ${reason}` : 'Cancelled by user'
    }).then(response => ({
      success: response.success,
      data: response.success,
      error: response.error,
      message: response.success ? 'Appointment cancelled successfully' : response.error,
      timestamp: new Date()
    }));
  }

  async rescheduleAppointment(appointmentId: string, newDate: Date): Promise<ApiResponse<Appointment>> {
    return this.updateAppointment(appointmentId, {
      appointmentDate: newDate,
      status: AppointmentStatus.RESCHEDULED
    });
  }

  async confirmAppointment(appointmentId: string): Promise<ApiResponse<Appointment>> {
    return this.updateAppointment(appointmentId, {
      status: AppointmentStatus.CONFIRMED
    });
  }

  async completeAppointment(appointmentId: string, completionData?: any): Promise<ApiResponse<Appointment>> {
    return this.updateAppointment(appointmentId, {
      status: AppointmentStatus.COMPLETED,
      ...completionData
    });
  }

  // Veterinarian and availability methods
  async getAvailableVeterinarians(date: Date, specialization?: VeterinarySpecialization): Promise<ApiResponse<Veterinarian[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let veterinarians = this.getMockVeterinarians();
        
        if (specialization) {
          veterinarians = veterinarians.filter(vet => 
            vet.specializations.includes(specialization)
          );
        }

        resolve({
          success: true,
          data: veterinarians,
          timestamp: new Date()
        });
      }, 600);
    });
  }

  async getAvailableTimeSlots(veterinarianId: string, date: Date): Promise<ApiResponse<string[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const timeSlots = this.generateTimeSlots(date);
        
        resolve({
          success: true,
          data: timeSlots,
          timestamp: new Date()
        });
      }, 400);
    });
  }

  // Search and filter methods
  async searchAppointments(filters: SearchFilters): Promise<PaginatedResponse<Appointment>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredAppointments = this.appointmentsSubject.value;

        // Apply filters
        if (filters.query) {
          filteredAppointments = filteredAppointments.filter(appointment =>
            appointment.petName.toLowerCase().includes(filters.query!.toLowerCase()) ||
            appointment.veterinarianName.toLowerCase().includes(filters.query!.toLowerCase()) ||
            appointment.clinicName.toLowerCase().includes(filters.query!.toLowerCase())
          );
        }

        if (filters.dateRange) {
          filteredAppointments = filteredAppointments.filter(appointment =>
            appointment.appointmentDate >= filters.dateRange!.startDate &&
            appointment.appointmentDate <= filters.dateRange!.endDate
          );
        }

        // Pagination
        const page = 1;
        const pageSize = 10;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);

        resolve({
          data: paginatedAppointments,
          total: filteredAppointments.length,
          page: page,
          pageSize: pageSize,
          totalPages: Math.ceil(filteredAppointments.length / pageSize),
          hasNextPage: endIndex < filteredAppointments.length,
          hasPreviousPage: page > 1
        });
      }, 500);
    });
  }

  async getAppointmentsByStatus(status: AppointmentStatus): Promise<Appointment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredAppointments = this.appointmentsSubject.value.filter(
          appointment => appointment.status === status
        );
        resolve(filteredAppointments);
      }, 300);
    });
  }

  async getUpcomingAppointments(userId?: string): Promise<Appointment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = new Date();
        const filteredAppointments = this.appointmentsSubject.value.filter(
          appointment => 
            appointment.appointmentDate > now &&
            (appointment.status === AppointmentStatus.SCHEDULED || appointment.status === AppointmentStatus.CONFIRMED) &&
            (!userId || appointment.userId === userId)
        );
        resolve(filteredAppointments.sort((a, b) => a.appointmentDate.getTime() - b.appointmentDate.getTime()));
      }, 300);
    });
  }

  async getPastAppointments(userId?: string): Promise<Appointment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = new Date();
        const filteredAppointments = this.appointmentsSubject.value.filter(
          appointment => 
            appointment.appointmentDate < now &&
            (!userId || appointment.userId === userId)
        );
        resolve(filteredAppointments.sort((a, b) => b.appointmentDate.getTime() - a.appointmentDate.getTime()));
      }, 300);
    });
  }

  // Statistics methods
  async getAppointmentStatistics(userId?: string): Promise<ApiResponse<any>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const appointments = userId 
          ? this.appointmentsSubject.value.filter(a => a.userId === userId)
          : this.appointmentsSubject.value;

        const now = new Date();
        const stats = {
          total: appointments.length,
          upcoming: appointments.filter(a => 
            a.appointmentDate > now && 
            (a.status === AppointmentStatus.SCHEDULED || a.status === AppointmentStatus.CONFIRMED)
          ).length,
          completed: appointments.filter(a => a.status === AppointmentStatus.COMPLETED).length,
          cancelled: appointments.filter(a => a.status === AppointmentStatus.CANCELLED).length,
          thisMonth: appointments.filter(a => {
            const appointmentDate = new Date(a.appointmentDate);
            return appointmentDate.getMonth() === now.getMonth() && 
                   appointmentDate.getFullYear() === now.getFullYear();
          }).length,
          totalSpent: appointments
            .filter(a => a.status === AppointmentStatus.COMPLETED && a.cost)
            .reduce((sum, a) => sum + (a.cost || 0), 0),
          averageCost: appointments.filter(a => a.cost).length > 0 
            ? appointments.filter(a => a.cost).reduce((sum, a) => sum + (a.cost || 0), 0) / appointments.filter(a => a.cost).length
            : 0
        };

        resolve({
          success: true,
          data: stats,
          timestamp: new Date()
        });
      }, 400);
    });
  }

  // Utility methods
  getCurrentAppointments(): Appointment[] {
    return this.appointmentsSubject.value;
  }

  selectAppointment(appointment: Appointment): void {
    this.selectedAppointmentSubject.next(appointment);
  }

  getSelectedAppointment(): Appointment | null {
    return this.selectedAppointmentSubject.value;
  }

  private generateTimeSlots(date: Date): string[] {
    const slots: string[] = [];
    const startHour = 9;
    const endHour = 17;
    const interval = 30; // minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }

    return slots;
  }

  // Mock data generation
  private getMockAppointments(userId?: string): Appointment[] {
    const appointments: Appointment[] = [
      {
        id: '1',
        userId: userId || '1',
        petId: '1',
        petName: 'Max',
        veterinarianId: '1',
        veterinarianName: 'Dr. García',
        clinicId: '1',
        clinicName: 'Clínica Veterinaria Central',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
        duration: 30,
        appointmentType: AppointmentType.CHECKUP,
        status: AppointmentStatus.SCHEDULED,
        reason: 'Chequeo general',
        notes: 'Primera visita del año',
        cost: 150,
        reminderSent: false,
        followUpRequired: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        userId: userId || '1',
        petId: '2',
        petName: 'Luna',
        veterinarianId: '2',
        veterinarianName: 'Dra. Martínez',
        clinicId: '2',
        clinicName: 'Clínica Veterinaria Norte',
        appointmentDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Two weeks
        duration: 45,
        appointmentType: AppointmentType.VACCINATION,
        status: AppointmentStatus.CONFIRMED,
        reason: 'Vacunación anual',
        notes: 'Revisar historial de vacunas',
        cost: 120,
        reminderSent: true,
        followUpRequired: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        userId: userId || '1',
        petId: '1',
        petName: 'Max',
        veterinarianId: '1',
        veterinarianName: 'Dr. García',
        clinicId: '1',
        clinicName: 'Clínica Veterinaria Central',
        appointmentDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last month
        duration: 60,
        appointmentType: AppointmentType.CHECKUP,
        status: AppointmentStatus.COMPLETED,
        reason: 'Chequeo general',
        notes: 'Todo en orden. Próxima cita en 6 meses.',
        cost: 180,
        reminderSent: true,
        followUpRequired: false,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    ];

    return appointments;
  }

  private getMockVeterinarians(): Veterinarian[] {
    return [
      {
        id: '1',
        userId: 'vet1',
        licenseNumber: 'VET-001-2020',
        specializations: [VeterinarySpecialization.GENERAL_PRACTICE, VeterinarySpecialization.SURGERY],
        experience: 10,
        rating: 4.8,
        reviewCount: 156,
        clinicId: '1',
        clinicName: 'Clínica Veterinaria Central',
        isAvailable: true,
        consultationFee: 150,
        availability: [
          { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' }
        ],
        createdAt: new Date('2020-01-01'),
        updatedAt: new Date()
      },
      {
        id: '2',
        userId: 'vet2',
        licenseNumber: 'VET-002-2021',
        specializations: [VeterinarySpecialization.GENERAL_PRACTICE, VeterinarySpecialization.DENTISTRY],
        experience: 7,
        rating: 4.6,
        reviewCount: 89,
        clinicId: '2',
        clinicName: 'Clínica Veterinaria Norte',
        isAvailable: true,
        consultationFee: 130,
        availability: [
          { dayOfWeek: 1, startTime: '08:00', endTime: '16:00' },
          { dayOfWeek: 2, startTime: '08:00', endTime: '16:00' },
          { dayOfWeek: 3, startTime: '08:00', endTime: '16:00' },
          { dayOfWeek: 4, startTime: '08:00', endTime: '16:00' },
          { dayOfWeek: 5, startTime: '08:00', endTime: '16:00' },
          { dayOfWeek: 6, startTime: '09:00', endTime: '13:00' }
        ],
        createdAt: new Date('2021-03-15'),
        updatedAt: new Date()
      },
      {
        id: '3',
        userId: 'vet3',
        licenseNumber: 'VET-003-2019',
        specializations: [VeterinarySpecialization.EMERGENCY, VeterinarySpecialization.SURGERY],
        experience: 15,
        rating: 4.9,
        reviewCount: 234,
        clinicId: '3',
        clinicName: 'Hospital Veterinario de Emergencias',
        isAvailable: true,
        consultationFee: 200,
        availability: [
          { dayOfWeek: 0, startTime: '00:00', endTime: '23:59' },
          { dayOfWeek: 1, startTime: '00:00', endTime: '23:59' },
          { dayOfWeek: 2, startTime: '00:00', endTime: '23:59' },
          { dayOfWeek: 3, startTime: '00:00', endTime: '23:59' },
          { dayOfWeek: 4, startTime: '00:00', endTime: '23:59' },
          { dayOfWeek: 5, startTime: '00:00', endTime: '23:59' },
          { dayOfWeek: 6, startTime: '00:00', endTime: '23:59' }
        ],
        createdAt: new Date('2019-06-01'),
        updatedAt: new Date()
      }
    ];
  }

  generateMockAppointments(count: number = 50): Appointment[] {
    const appointments: Appointment[] = [];
    const appointmentTypes = Object.values(AppointmentType);
    const statuses = Object.values(AppointmentStatus);
    const veterinarians = this.getMockVeterinarians();

    for (let i = 1; i <= count; i++) {
      const vet = veterinarians[i % veterinarians.length];
      const appointmentDate = new Date(
        Date.now() + (Math.random() - 0.5) * 365 * 24 * 60 * 60 * 1000
      );

      appointments.push({
        id: (i + 3).toString(),
        userId: '1',
        petId: ((i % 2) + 1).toString(),
        petName: i % 2 === 0 ? 'Max' : 'Luna',
        veterinarianId: vet.id,
        veterinarianName: vet.id === '1' ? 'Dr. García' : vet.id === '2' ? 'Dra. Martínez' : 'Dr. Emergency',
        clinicId: vet.clinicId,
        clinicName: vet.clinicName,
        appointmentDate: appointmentDate,
        duration: [30, 45, 60][i % 3],
        appointmentType: appointmentTypes[i % appointmentTypes.length],
        status: statuses[i % statuses.length],
        reason: `Razón de cita ${i}`,
        notes: i % 3 === 0 ? `Notas adicionales ${i}` : undefined,
        cost: appointmentDate < new Date() ? Math.floor(Math.random() * 300) + 100 : undefined,
        reminderSent: Math.random() > 0.5,
        followUpRequired: Math.random() > 0.7,
        followUpDate: Math.random() > 0.5 ? new Date(appointmentDate.getTime() + 30 * 24 * 60 * 60 * 1000) : undefined,
        createdAt: new Date(appointmentDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(appointmentDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });
    }

    return appointments;
  }
}
