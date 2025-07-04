import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  ngOnInit() {
    console.log('Login component initialized');
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      if (email === 'admin@example.com' && password === '123456') {
        this.router.navigateByUrl('/home', { replaceUrl: true });
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
}
