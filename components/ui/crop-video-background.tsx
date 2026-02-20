'use client';

import { useEffect, useRef, useState } from 'react';

export function CropVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Log video events for debugging
      video.addEventListener('loadeddata', () => {
        console.log('Video loaded successfully');
        setIsPlaying(true);
      });
      video.addEventListener('error', (e) => {
        console.error('Video error:', e);
        setVideoError('Failed to load video');
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create floating crop elements
    class FloatingCrop {
      x: number;
      y: number;
      size: number;
      rotation: number;
      rotationSpeed: number;
      floatY: number;
      floatSpeed: number;
      type: 'wheat' | 'corn' | 'cotton' | 'tractor';
      opacity: number;

      constructor(type: 'wheat' | 'corn' | 'cotton' | 'tractor') {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 40 + 30;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
        this.floatY = Math.random() * Math.PI * 2;
        this.floatSpeed = Math.random() * 0.02 + 0.01;
        this.type = type;
        this.opacity = Math.random() * 0.3 + 0.1;
      }

      update() {
        this.rotation += this.rotationSpeed;
        this.floatY += this.floatSpeed;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y + Math.sin(this.floatY) * 15);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        
        // Draw different crop types
        ctx.strokeStyle = '#fbbf24';
        ctx.fillStyle = 'rgba(251, 191, 36, 0.1)';
        ctx.lineWidth = 2;

        if (this.type === 'wheat') {
          // Draw wheat stalk
          ctx.beginPath();
          ctx.moveTo(0, -this.size);
          ctx.quadraticCurveTo(-this.size * 0.3, -this.size * 0.5, 0, -this.size * 0.8);
          ctx.quadraticCurveTo(this.size * 0.3, -this.size * 0.5, 0, -this.size);
          ctx.stroke();
          
          // Wheat grains
          for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(
              (Math.random() - 0.5) * this.size * 0.6,
              -this.size + i * 8,
              3,
              0,
              Math.PI * 2,
              false
            );
            ctx.fill();
          }
        } else if (this.type === 'corn') {
          // Draw corn stalk
          ctx.beginPath();
          ctx.moveTo(0, -this.size);
          ctx.lineTo(-this.size * 0.1, -this.size * 0.3);
          ctx.lineTo(-this.size * 0.2, 0);
          ctx.lineTo(this.size * 0.2, this.size * 0.4);
          ctx.quadraticCurveTo(this.size * 0.1, this.size * 0.6, 0, this.size * 0.8);
          ctx.stroke();
          
          // Corn cob
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.ellipse(0, this.size * 0.2, this.size * 0.3, this.size * 0.6, 0, Math.PI * 2, 0);
          ctx.fill();
        } else if (this.type === 'cotton') {
          // Draw cotton plant
          ctx.beginPath();
          ctx.moveTo(0, -this.size);
          ctx.quadraticCurveTo(-this.size * 0.2, -this.size * 0.4, -this.size * 0.1, 0);
          ctx.quadraticCurveTo(this.size * 0.2, -this.size * 0.4, this.size * 0.1, this.size * 0.3);
          ctx.stroke();
          
          // Cotton bolls
          ctx.fillStyle = '#ffffff';
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(
              (Math.random() - 0.5) * this.size * 0.4,
              this.size * 0.1 + i * this.size * 0.15,
              8,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
        } else if (this.type === 'tractor') {
          // Draw simple tractor shape
          ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
          ctx.fillRect(-this.size * 0.4, -this.size * 0.2, this.size * 0.8, this.size * 0.3);
          ctx.fillRect(-this.size * 0.3, -this.size * 0.4, this.size * 0.6, this.size * 0.2);
          
          // Wheels
          ctx.fillStyle = '#1f2937';
          ctx.beginPath();
          ctx.arc(-this.size * 0.2, -this.size * 0.1, this.size * 0.15, 0, Math.PI * 2);
          ctx.arc(this.size * 0.3, -this.size * 0.1, this.size * 0.15, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      }
    }

    // Create floating crops
    const crops: FloatingCrop[] = [];
    const cropTypes: ('wheat' | 'corn' | 'cotton' | 'tractor')[] = ['wheat', 'corn', 'cotton', 'tractor'];

    for (let i = 0; i < 12; i++) {
      crops.push(new FloatingCrop(cropTypes[i % 4]));
    }

    // Animation loop
    const animate = () => {
      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(254, 253, 199, 0.8)');
      gradient.addColorStop(0.5, 'rgba(251, 191, 36, 0.4)');
      gradient.addColorStop(1, 'rgba(34, 197, 94, 0.2)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw crops
      crops.forEach(crop => {
        crop.update();
        crop.draw();
      });

      // Draw field lines
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.1)';
      ctx.lineWidth = 1;
      ctx.setLineDash([10, 5]);
      
      for (let i = 0; i < 5; i++) {
        const y = (canvas.height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="absolute inset-0 z-0">
      {/* Fallback Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-green-50 to-amber-200" />
      
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        onClick={handleVideoClick}
        src="/videos/wheat.mp4"
        style={{ opacity: videoError ? 0 : 1 }}
      />

      {/* Dark overlay for text visibility */}
      <div className="absolute inset-0 bg-black/30" />

      {/* 3D Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          mixBlendMode: 'overlay',
          opacity: 0.4
        }}
      />

   
    </div>
  );
}
