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
    path: 'camera',
    loadComponent: () => import('./camera/camera.page').then( m => m.CameraPage)
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
    loadComponent: () => import('./webcam/webcam.page').then( m => m.WebcamPage)
  },
  {
    path: 'veterinaria',
    loadComponent: () => import('./webcam/webcam.page').then( m => m.WebcamPage)
  },
];
