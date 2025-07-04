import { AnimationController, Animation } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdvancedAnimationService {

  constructor(private animationCtrl: AnimationController) {}

  // Animación de entrada 3D para las cards
  createCardEntranceAnimation(elements: Element[]): Animation {
    return this.animationCtrl
      .create()
      .addElement(elements)
      .duration(800)
      .easing('cubic-bezier(0.25, 0.46, 0.45, 0.94)')
      .fromTo('transform', 'translateZ(-200px) rotateX(-90deg) scale(0.8)', 'translateZ(0) rotateX(0) scale(1)')
      .fromTo('opacity', '0', '1')
      .delay(100);
  }

  // Animación de hover 3D
  createCardHoverAnimation(element: Element): Animation {
    return this.animationCtrl
      .create()
      .addElement(element)
      .duration(300)
      .easing('ease-out')
      .fromTo('transform', 
        'translateZ(0) rotateX(0) rotateY(0) scale(1)', 
        'translateZ(20px) rotateX(-5deg) rotateY(5deg) scale(1.05)'
      )
      .fromTo('box-shadow', 
        '0 4px 8px rgba(0, 0, 0, 0.1)', 
        '0 20px 40px rgba(0, 0, 0, 0.2), 0 8px 15px rgba(0, 123, 255, 0.3)'
      );
  }

  // Animación de click con efecto ripple 3D
  createCardClickAnimation(element: Element): Animation {
    return this.animationCtrl
      .create()
      .addElement(element)
      .duration(200)
      .easing('ease-in-out')
      .fromTo('transform', 
        'translateZ(20px) rotateX(-5deg) rotateY(5deg) scale(1.05)', 
        'translateZ(30px) rotateX(-10deg) rotateY(10deg) scale(0.95)'
      );
  }

  // Animación de navegación con transición de página
  createPageTransition(leavingElement: Element, enteringElement: Element): Animation {
    const leavingAnimation = this.animationCtrl
      .create()
      .addElement(leavingElement)
      .duration(500)
      .easing('cubic-bezier(0.4, 0, 0.2, 1)')
      .fromTo('transform', 'translateX(0) scale(1)', 'translateX(-100%) scale(0.8)')
      .fromTo('opacity', '1', '0');

    const enteringAnimation = this.animationCtrl
      .create()
      .addElement(enteringElement)
      .duration(500)
      .easing('cubic-bezier(0.4, 0, 0.2, 1)')
      .fromTo('transform', 'translateX(100%) scale(0.8)', 'translateX(0) scale(1)')
      .fromTo('opacity', '0', '1');

    return this.animationCtrl
      .create()
      .addAnimation([leavingAnimation, enteringAnimation]);
  }

  // Animación de partículas flotantes
  createFloatingParticlesAnimation(elements: Element[]): Animation {
    const animations = elements.map((element, index) => {
      return this.animationCtrl
        .create()
        .addElement(element)
        .duration(3000 + (index * 500))
        .iterations(Infinity)
        .direction('alternate')
        .easing('ease-in-out')
        .keyframes([
          { offset: 0, transform: 'translateY(0px) rotate(0deg)', opacity: '0.6' },
          { offset: 0.5, transform: 'translateY(-20px) rotate(180deg)', opacity: '1' },
          { offset: 1, transform: 'translateY(0px) rotate(360deg)', opacity: '0.6' }
        ]);
    });

    return this.animationCtrl
      .create()
      .addAnimation(animations);
  }

  // Animación de texto con efecto typewriter
  createTypewriterAnimation(element: Element, text: string): Animation {
    const letters = text.split('');
    let currentText = '';
    
    return this.animationCtrl
      .create()
      .addElement(element)
      .duration(2000)
      .easing('ease-in-out')
      .beforeStyles({
        'overflow': 'hidden',
        'white-space': 'nowrap'
      })
      .keyframes(
        letters.map((letter, index) => {
          currentText += letter;
          return {
            offset: index / letters.length,
            transform: 'none'
          };
        })
      );
  }

  // Animación de loading con spinner 3D
  createSpinner3DAnimation(element: Element): Animation {
    return this.animationCtrl
      .create()
      .addElement(element)
      .duration(1000)
      .iterations(Infinity)
      .easing('linear')
      .keyframes([
        { offset: 0, transform: 'rotateY(0deg) rotateX(0deg)' },
        { offset: 0.25, transform: 'rotateY(90deg) rotateX(0deg)' },
        { offset: 0.5, transform: 'rotateY(180deg) rotateX(90deg)' },
        { offset: 0.75, transform: 'rotateY(270deg) rotateX(180deg)' },
        { offset: 1, transform: 'rotateY(360deg) rotateX(360deg)' }
      ]);
  }

  // Animación de parallax para el fondo
  createParallaxAnimation(elements: Element[], scrollY: number): Animation {
    const animations = elements.map((element, index) => {
      const speed = 0.5 + (index * 0.2);
      return this.animationCtrl
        .create()
        .addElement(element)
        .duration(0)
        .fromTo('transform', 
          `translateY(${scrollY * speed}px)`, 
          `translateY(${scrollY * speed}px)`
        );
    });

    return this.animationCtrl
      .create()
      .addAnimation(animations);
  }

  // Animación de glassmorphism con blur dinámico
  createGlassmorphismAnimation(element: Element): Animation {
    return this.animationCtrl
      .create()
      .addElement(element)
      .duration(1000)
      .easing('ease-in-out')
      .keyframes([
        { 
          offset: 0, 
          backdropFilter: 'blur(5px)', 
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        },
        { 
          offset: 0.5, 
          backdropFilter: 'blur(15px)', 
          background: 'rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.4)'
        },
        { 
          offset: 1, 
          backdropFilter: 'blur(10px)', 
          background: 'rgba(255, 255, 255, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }
      ]);
  }
}
