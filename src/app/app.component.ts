import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { GlobalParticlesComponent } from './shared/components/global-particles.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, GlobalParticlesComponent],
})
export class AppComponent {
  constructor() {}
}
