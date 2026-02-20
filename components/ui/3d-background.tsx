'use client';

import { useEffect, useRef, useState } from 'react';

export function ThreeDBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    class Particle {
      x: number;
      y: number;
      z: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 1000;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Mouse interaction
        const dx = mousePosition.x - this.x;
        const dy = mousePosition.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          this.x -= (dx / distance) * force * 2;
          this.y -= (dy / distance) * force * 2;
        }
      }

      draw() {
        const perspective = 1000 / (1000 + this.z);
        const projectedX = this.x * perspective;
        const projectedY = this.y * perspective;
        const projectedSize = this.size * perspective;

        ctx.globalAlpha = this.opacity * perspective;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(projectedX, projectedY, projectedSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Floating geometric shapes
    class FloatingShape {
      x: number;
      y: number;
      size: number;
      rotation: number;
      rotationSpeed: number;
      floatY: number;
      floatSpeed: number;
      type: 'triangle' | 'square' | 'hexagon';
      color: string;

      constructor(type: 'triangle' | 'square' | 'hexagon') {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 30 + 20;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.floatY = 0;
        this.floatSpeed = Math.random() * 0.02 + 0.01;
        this.type = type;
        
        const colors = ['#fbbf24', '#22c55e', '#16a34a', '#ca8a04', '#92400e'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.rotation += this.rotationSpeed;
        this.floatY += this.floatSpeed;
        
        // Mouse interaction
        const dx = mousePosition.x - this.x;
        const dy = mousePosition.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          this.x -= (dx / distance) * force * 3;
          this.y -= (dy / distance) * force * 3;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y + Math.sin(this.floatY) * 10);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = 0.1;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;

        ctx.beginPath();
        
        if (this.type === 'triangle') {
          ctx.moveTo(0, -this.size);
          ctx.lineTo(-this.size * 0.866, this.size * 0.5);
          ctx.lineTo(this.size * 0.866, this.size * 0.5);
          ctx.closePath();
        } else if (this.type === 'square') {
          ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
        } else if (this.type === 'hexagon') {
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = Math.cos(angle) * this.size;
            const y = Math.sin(angle) * this.size;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
        }
        
        ctx.stroke();
        ctx.restore();
      }
    }

    // Create particles and shapes
    const particles: Particle[] = [];
    const shapes: FloatingShape[] = [];

    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
    }

    for (let i = 0; i < 8; i++) {
      const types: ('triangle' | 'square' | 'hexagon')[] = ['triangle', 'square', 'hexagon'];
      shapes.push(new FloatingShape(types[i % 3]));
    }

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw shapes
      shapes.forEach(shape => {
        shape.update();
        shape.draw();
      });

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connections between nearby particles
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mousePosition]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #f0fdf4 50%, #dcfce7 100%)'
      }}
    />
  );
}
