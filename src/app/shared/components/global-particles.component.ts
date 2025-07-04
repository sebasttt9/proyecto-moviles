import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticleService, Particle } from '../services/particle.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-global-particles',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="global-particles-container">
      <div class="morphing-particle"
           *ngFor="let particle of particles; trackBy: trackByFn"
           [style.left.%]="particle.left"
           [style.top.%]="particle.top"
           [style.width.px]="particle.size"
           [style.height.px]="particle.size"
           [style.opacity]="particle.opacity"
           [style.animation-delay.s]="particle.delay"
           [style.animation-duration.s]="particle.speed + 6"
           [ngClass]="'particle-' + particle.type">
      </div>
    </div>
  `,
  styles: [`
    .global-particles-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999999;
      overflow: hidden;
    }

    .morphing-particle {
      position: absolute;
      border-radius: 50%;
      animation: global-morphing-float ease-in-out infinite;
      filter: blur(0.5px);
      will-change: transform, opacity;
    }

    // Enhanced particle types with improved visibility
    .particle-blue {
      background: radial-gradient(circle, rgba(102, 126, 234, 0.9), rgba(102, 126, 234, 0.3)) !important;
      box-shadow: 0 0 15px rgba(102, 126, 234, 0.6), 0 0 30px rgba(102, 126, 234, 0.3);
    }

    .particle-purple {
      background: radial-gradient(circle, rgba(118, 75, 162, 0.9), rgba(118, 75, 162, 0.3)) !important;
      box-shadow: 0 0 15px rgba(118, 75, 162, 0.6), 0 0 30px rgba(118, 75, 162, 0.3);
    }

    .particle-cyan {
      background: radial-gradient(circle, rgba(78, 205, 196, 0.9), rgba(78, 205, 196, 0.3)) !important;
      box-shadow: 0 0 15px rgba(78, 205, 196, 0.6), 0 0 30px rgba(78, 205, 196, 0.3);
    }

    .particle-pink {
      background: radial-gradient(circle, rgba(255, 107, 107, 0.9), rgba(255, 107, 107, 0.3)) !important;
      box-shadow: 0 0 15px rgba(255, 107, 107, 0.6), 0 0 30px rgba(255, 107, 107, 0.3);
    }

    .particle-white {
      background: radial-gradient(circle, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.3)) !important;
      box-shadow: 0 0 12px rgba(255, 255, 255, 0.5), 0 0 24px rgba(255, 255, 255, 0.3);
    }

    @keyframes global-morphing-float {
      0%, 100% {
        transform: translateY(0px) translateX(0px) rotate(0deg) scale(1);
        opacity: 0.4;
      }
      25% {
        transform: translateY(-50px) translateX(30px) rotate(90deg) scale(1.3);
        opacity: 0.9;
      }
      50% {
        transform: translateY(-25px) translateX(-40px) rotate(180deg) scale(0.7);
        opacity: 1;
      }
      75% {
        transform: translateY(-60px) translateX(20px) rotate(270deg) scale(1.1);
        opacity: 0.6;
      }
    }
  `]
})
export class GlobalParticlesComponent implements OnInit, OnDestroy {
  particles: Particle[] = [];
  private subscription: Subscription = new Subscription();
  private particleService = inject(ParticleService);

  constructor() {}

  ngOnInit() {
    this.subscription.add(
      this.particleService.particles$.subscribe(particles => {
        this.particles = particles;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  trackByFn(index: number, particle: Particle): number {
    return particle.id;
  }
}
