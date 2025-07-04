import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Particle {
  id: number;
  x: number;
  y: number;
  left: number;
  top: number;
  delay: number;
  type: string;
  size: number;
  opacity: number;
  speed: number;
}

@Injectable({
  providedIn: 'root'
})
export class ParticleService {
  private particlesSubject = new BehaviorSubject<Particle[]>([]);
  public particles$ = this.particlesSubject.asObservable();

  constructor() {
    this.generateParticles();
  }

  private generateParticles(): void {
    const particles: Particle[] = [];
    
    for (let i = 0; i < 60; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 8,
        type: i % 5 === 0 ? 'blue' : i % 5 === 1 ? 'purple' : i % 5 === 2 ? 'cyan' : i % 5 === 3 ? 'pink' : 'white',
        size: Math.random() * 4 + 3, // Between 3 and 7
        opacity: Math.random() * 0.5 + 0.3, // Between 0.3 and 0.8
        speed: Math.random() * 2 + 1 // Between 1 and 3
      });
    }
    
    this.particlesSubject.next(particles);
  }

  public regenerateParticles(): void {
    this.generateParticles();
  }

  public getParticles(): Particle[] {
    return this.particlesSubject.getValue();
  }
}
