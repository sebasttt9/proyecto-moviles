import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-grooming',
  templateUrl: './grooming.page.html',
  styleUrls: ['./grooming.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class GroomingPage {}
