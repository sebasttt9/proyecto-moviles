import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      if (email === 'admin@example.com' && password === '123456') {
        this.router.navigateByUrl('/webcam', { replaceUrl: true });
      } else {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: 'Credenciales inválidas',
          buttons: ['OK']
        });
        await alert.present();
      }
    }
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }

  goToWebcam() {
    this.router.navigateByUrl('/webcam');
  }
}
