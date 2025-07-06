import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'webcam',
    loadComponent: () => import('./webcam/webcam.page').then( m => m.WebcamPage)
  },

  {
    path: 'grooming',
    loadComponent: () => import('./grooming/grooming.page').then((m) => m.GroomingPage),
  },
  {
    path: 'estancias',
    loadComponent: () => import('./webcam/webcam.page').then( m => m.WebcamPage)
  },
  {
    path: 'reservar',
    loadComponent: () => import('./webcam/webcam.page').then( m => m.WebcamPage)
  },
  {
    path: 'adopcion',
    loadComponent: () => import('./adopcion/adopcion.page').then( m => m.AdopcionPage)
  },
  {
    path: 'veterinaria',
    loadComponent: () => import('./veterinaria/veterinaria.page').then( m => m.VeterinariaPage)
  },
  {
    path: 'appointment-history',
    loadComponent: () => import('./appointment-history/appointment-history.page').then( m => m.AppointmentHistoryPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'my-pets',
    loadComponent: () => import('./my-pets/my-pets.page').then( m => m.MyPetsPage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.page').then( m => m.SettingsPage)
  },
  {
    path: 'estancia',
    loadComponent: () => import('./estancia/estancia.page').then( m => m.EstanciaPage)
  },
];
