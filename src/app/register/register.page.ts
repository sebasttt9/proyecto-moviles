import { Component, OnInit, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { NavigationHeaderComponent } from '../components/navigation-header.component';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, RouterModule, NavigationHeaderComponent]
})
export class RegisterPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  private ngZone = inject(NgZone);
  private utilityService = inject(UtilityService);

  registerForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: this.passwordMatchValidator
  });

  constructor() { }

  ngOnInit() {
  }

  // Validador personalizado para confirmar contraseñas
  passwordMatchValidator(control: AbstractControl): {[key: string]: any} | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      const { nombre, apellido, email, password } = this.registerForm.value;
      
      // Aquí puedes agregar la lógica para registrar al usuario
      const alert = await this.alertCtrl.create({
        header: 'Éxito',
        message: `Cuenta creada exitosamente para ${nombre} ${apellido}`,
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.router.navigateByUrl('/login');
            }
          }
        ]
      });
      await alert.present();
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Por favor, completa todos los campos correctamente',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  goToLogin() {
    console.log('Navegando al login...');
    this.ngZone.run(() => {
      this.router.navigateByUrl('/login', { replaceUrl: true }).then(() => {
        console.log('Navegación completada exitosamente');
      }).catch((error) => {
        console.error('Error en navegación:', error);
        // Fallback usando window.location
        window.location.href = '/login';
      });
    });
  }
}
