import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { UtilityService } from '../services/utility.service';


@Component({
  selector: 'app-navigation-header',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start" *ngIf="showBackButton">
          <ion-button (click)="goBack()" fill="clear">
            <ion-icon name="arrow-back" color="light"></ion-icon>
            <span class="back-text">{{ showBackText ? 'Volver' : '' }}</span>
          </ion-button>
        </ion-buttons>
        
        <ion-title>
          <ng-container *ngIf="showLogo; else titleText">
            <img [src]="logoSrc" [alt]="title" class="header-logo" />
          </ng-container>
          <ng-template #titleText>
            {{ title }}
          </ng-template>
        </ion-title>
        
        <ion-buttons slot="end" *ngIf="showHomeButton">
          <ion-button (click)="goToHome()" fill="clear">
            <ion-icon name="home" color="light"></ion-icon>
            <span class="home-text">{{ showHomeText ? 'Inicio' : '' }}</span>
          </ion-button>
        </ion-buttons>
        
        <ion-buttons slot="end" *ngIf="endButtons">
          <ng-content select="[slot=end]"></ng-content>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
  `,
  styles: [`
    ion-header {
      ion-toolbar {
        --background: #007bff !important;
        --color: #ffffff !important;
        --min-height: 60px;
        
        ion-title {
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #ffffff !important;
          font-weight: 600;
          
          .header-logo {
            width: 70px;
            height: 54px;
            object-fit: contain;
          }
        }
      }
    }
    
    .back-text, .home-text {
      margin-left: 4px;
      font-size: 14px;
      font-weight: 500;
      color: #ffffff !important;
    }
    
    @media (max-width: 480px) {
      .back-text, .home-text {
        display: none;
      }
    }
    
    ion-button {
      --color: #ffffff !important;
      --border-radius: 8px;
      color: #ffffff !important;
      
      &:hover {
        --background: rgba(255, 255, 255, 0.1);
      }
      
      ion-icon {
        color: #ffffff !important;
      }
    }
  `]
})
export class NavigationHeaderComponent {
  @Input() title: string = '';
  @Input() showLogo: boolean = false;
  @Input() logoSrc: string = 'assets/icon/Group.png';
  @Input() showBackButton: boolean = true;
  @Input() showBackText: boolean = true;
  @Input() showHomeButton: boolean = true;
  @Input() showHomeText: boolean = true;
  @Input() endButtons: boolean = false;

  constructor(private utilityService: UtilityService) {}

  async goBack(): Promise<void> {
    await this.utilityService.goBack();
  }

  async goToHome(): Promise<void> {
    await this.utilityService.goToHome();
  }
}