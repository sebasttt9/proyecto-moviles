import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { 
  User, 
  UserRole, 
  UserPreferences, 
  NotificationSettings,
  ApiResponse,
  Address 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.initializeUser();
  }

  private initializeUser(): void {
    const token = localStorage.getItem('userToken');
    const email = localStorage.getItem('userEmail');
    
    if (token && email) {
      this.loadUserProfile(email);
    }
  }

  // Authentication methods
  async login(email: string, password: string): Promise<ApiResponse<User>> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email && password) {
          const user = this.getMockUser(email);
          this.setCurrentUser(user);
          localStorage.setItem('userToken', 'fake-jwt-token');
          localStorage.setItem('userEmail', email);
          
          resolve({
            success: true,
            data: user,
            message: 'Login successful',
            timestamp: new Date()
          });
        } else {
          resolve({
            success: false,
            error: 'Invalid credentials',
            timestamp: new Date()
          });
        }
      }, 1000);
    });
  }

  async register(userData: Partial<User>): Promise<ApiResponse<User>> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: Date.now().toString(),
          email: userData.email!,
          name: userData.name!,
          lastName: userData.lastName!,
          phone: userData.phone,
          avatar: userData.avatar,
          dateOfBirth: userData.dateOfBirth,
          address: userData.address,
          preferences: this.getDefaultPreferences(),
          role: UserRole.USER,
          isActive: true,
          emailVerified: false,
          phoneVerified: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        this.setCurrentUser(newUser);
        localStorage.setItem('userToken', 'fake-jwt-token');
        localStorage.setItem('userEmail', newUser.email);

        resolve({
          success: true,
          data: newUser,
          message: 'Registration successful',
          timestamp: new Date()
        });
      }, 1500);
    });
  }

  async loginWithSocial(provider: 'google' | 'facebook'): Promise<ApiResponse<User>> {
    // Simulate social login
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = this.getMockUser(`user@${provider}.com`);
        this.setCurrentUser(user);
        localStorage.setItem('userToken', `fake-${provider}-token`);
        localStorage.setItem('userEmail', user.email);

        resolve({
          success: true,
          data: user,
          message: `${provider} login successful`,
          timestamp: new Date()
        });
      }, 1000);
    });
  }

  async logout(): Promise<void> {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    localStorage.removeItem('userToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userProfile');
  }

  // User profile methods
  async loadUserProfile(email: string): Promise<void> {
    const user = this.getMockUser(email);
    this.setCurrentUser(user);
  }

  async updateUserProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = this.currentUserSubject.value;
        if (currentUser) {
          const updatedUser: User = {
            ...currentUser,
            ...userData,
            updatedAt: new Date()
          };
          
          this.setCurrentUser(updatedUser);
          localStorage.setItem('userProfile', JSON.stringify(updatedUser));

          resolve({
            success: true,
            data: updatedUser,
            message: 'Profile updated successfully',
            timestamp: new Date()
          });
        } else {
          resolve({
            success: false,
            error: 'User not found',
            timestamp: new Date()
          });
        }
      }, 1000);
    });
  }

  async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<ApiResponse<UserPreferences>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = this.currentUserSubject.value;
        if (currentUser) {
          const updatedPreferences: UserPreferences = {
            ...currentUser.preferences,
            ...preferences
          };
          
          const updatedUser: User = {
            ...currentUser,
            preferences: updatedPreferences,
            updatedAt: new Date()
          };
          
          this.setCurrentUser(updatedUser);
          localStorage.setItem('userProfile', JSON.stringify(updatedUser));

          resolve({
            success: true,
            data: updatedPreferences,
            message: 'Preferences updated successfully',
            timestamp: new Date()
          });
        } else {
          resolve({
            success: false,
            error: 'User not found',
            timestamp: new Date()
          });
        }
      }, 500);
    });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<boolean>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate password validation
        if (currentPassword === 'wrongpassword') {
          resolve({
            success: false,
            error: 'Current password is incorrect',
            timestamp: new Date()
          });
        } else {
          resolve({
            success: true,
            data: true,
            message: 'Password changed successfully',
            timestamp: new Date()
          });
        }
      }, 1000);
    });
  }

  async deleteAccount(): Promise<ApiResponse<boolean>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.logout();
        resolve({
          success: true,
          data: true,
          message: 'Account deleted successfully',
          timestamp: new Date()
        });
      }, 1500);
    });
  }

  // Utility methods
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  hasRole(role: UserRole): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.role === role : false;
  }

  private setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  private getMockUser(email: string): User {
    return {
      id: '1',
      email: email,
      name: 'Juan',
      lastName: 'Pérez',
      phone: '+1234567890',
      avatar: '/assets/avatars/default-avatar.png',
      dateOfBirth: new Date('1990-01-01'),
      address: {
        street: '123 Main St',
        city: 'Ciudad',
        state: 'Estado',
        zipCode: '12345',
        country: 'País'
      },
      preferences: this.getDefaultPreferences(),
      role: UserRole.USER,
      isActive: true,
      emailVerified: true,
      phoneVerified: false,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date()
    };
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      notifications: {
        push: true,
        email: true,
        sms: false,
        appointmentReminders: true,
        vaccinationReminders: true,
        promotions: false
      },
      language: 'es',
      theme: 'light',
      fontSize: 'medium'
    };
  }

  // Mock data for development
  generateMockUsers(count: number = 10): User[] {
    const users: User[] = [];
    
    for (let i = 1; i <= count; i++) {
      users.push({
        id: i.toString(),
        email: `user${i}@example.com`,
        name: `Usuario${i}`,
        lastName: `Apellido${i}`,
        phone: `+123456789${i}`,
        avatar: `/assets/avatars/user${i}.png`,
        dateOfBirth: new Date(1980 + i, (i % 12), (i % 28) + 1),
        address: {
          street: `${i}00 Street ${i}`,
          city: 'Ciudad',
          state: 'Estado',
          zipCode: `1234${i}`,
          country: 'País'
        },
        preferences: this.getDefaultPreferences(),
        role: i === 1 ? UserRole.ADMIN : UserRole.USER,
        isActive: true,
        emailVerified: i % 2 === 0,
        phoneVerified: i % 3 === 0,
        createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)),
        updatedAt: new Date()
      });
    }
    
    return users;
  }
}
