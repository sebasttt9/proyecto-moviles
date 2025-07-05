import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  
  private currentLoading: any = null;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  // Navigation methods
  async navigateTo(path: string): Promise<void> {
    try {
      await this.router.navigateByUrl(path, { replaceUrl: true });
    } catch (error) {
      this.handleError(error, 'Navigation failed');
    }
  }

  async goToHome(): Promise<void> {
    try {
      await this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (error) {
      this.handleError(error, 'Navigation to home failed');
    }
  }

  async goBack(): Promise<void> {
    try {
      // Try to go back in history, but if no previous page, go to home
      if (window.history.length > 1) {
        window.history.back();
      } else {
        await this.goToHome();
      }
    } catch (error) {
      await this.goToHome();
    }
  }

  // Loading methods
  async showLoading(message: string = 'Cargando...'): Promise<void> {
    try {
      if (this.currentLoading) {
        await this.currentLoading.dismiss();
      }
      
      this.currentLoading = await this.loadingController.create({
        message,
        spinner: 'circular',
        cssClass: 'custom-loading'
      });
      
      this.loadingSubject.next(true);
      await this.currentLoading.present();
    } catch (error) {
      this.handleError(error, 'Show loading failed');
    }
  }

  async hideLoading(): Promise<void> {
    try {
      if (this.currentLoading) {
        await this.currentLoading.dismiss();
        this.currentLoading = null;
      }
      this.loadingSubject.next(false);
    } catch (error) {
      this.handleError(error, 'Hide loading failed');
    }
  }

  // Alert methods
  async showAlert(header: string, message: string, buttons: string[] = ['OK']): Promise<void> {
    try {
      const alert = await this.alertController.create({
        header,
        message,
        buttons,
        cssClass: 'custom-alert'
      });
      await alert.present();
    } catch (error) {
      this.handleError(error, 'Show alert failed');
    }
  }

  async showConfirm(header: string, message: string): Promise<boolean> {
    try {
      const alert = await this.alertController.create({
        header,
        message,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary'
          },
          {
            text: 'Confirmar',
            cssClass: 'primary'
          }
        ],
        cssClass: 'custom-alert'
      });
      
      await alert.present();
      const { role } = await alert.onDidDismiss();
      return role !== 'cancel';
    } catch (error) {
      this.handleError(error, 'Show confirm failed');
      return false;
    }
  }

  // Toast methods
  async showSuccessToast(message: string): Promise<void> {
    await this.showToast(message, 'success');
  }

  async showErrorToast(message: string): Promise<void> {
    await this.showToast(message, 'danger');
  }

  async showToast(message: string, color: string = 'primary'): Promise<void> {
    try {
      const toast = await this.toastController.create({
        message,
        duration: 3000,
        color,
        position: 'top',
        cssClass: 'custom-toast'
      });
      await toast.present();
    } catch (error) {
      this.handleError(error, 'Show toast failed');
    }
  }

  // Storage methods
  setItem(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      this.handleError(error, 'Local storage set failed');
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      this.handleError(error, 'Local storage get failed');
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      this.handleError(error, 'Local storage remove failed');
    }
  }

  // Error handling
  handleError(error: any, context: string = 'Unknown'): void {
    console.error(`[${context}] Error:`, error);
    
    // Show user-friendly error message
    const message = error?.message || 'Ha ocurrido un error inesperado';
    this.showErrorToast(message).catch(console.error);
  }

  // Cleanup method
  cleanup(): void {
    try {
      if (this.currentLoading) {
        this.currentLoading.dismiss();
        this.currentLoading = null;
      }
      this.loadingSubject.next(false);
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}
