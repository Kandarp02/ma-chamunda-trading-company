'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { companyInfo } from '@/lib/data';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { HoverCard3D, FloatingElement3D, ParallaxSection, InteractiveButton3D } from '@/components/ui/3d-effects';
import emailjs from '@emailjs/browser';

// EmailJS configuration
// Get these from https://www.emailjs.com/ after signing up (FREE - 200 emails/month)
const EMAILJS_SERVICE_ID = 'service_dszbohs'; // Replace with your Service ID
const EMAILJS_TEMPLATE_ID = 'template_urzhgnh'; // Replace with your Template ID
const EMAILJS_PUBLIC_KEY = 'gTtAiE-NOGY8DwQIL'; // Replace with your Public Key

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Prepare template parameters
    const templateParams = {
      name: formData.name,
      email: formData.email,
      title: formData.subject,
      message: formData.message,
    };

    try {
      console.log('Sending email with EmailJS...');
      console.log('Service ID:', EMAILJS_SERVICE_ID);
      console.log('Template ID:', EMAILJS_TEMPLATE_ID);
      console.log('Template Params:', templateParams);
      
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      
      console.log('Email sent successfully:', result);

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      console.error('Failed to send email:', err);
      console.error('Error text:', err?.text || 'No error text');
      console.error('Error status:', err?.status || 'No status');
      setError(`Failed to send message: ${err?.text || err?.message || 'Unknown error'}. Please try again or contact us directly.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParallaxSection className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-amber-50 to-green-50" id="contact">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-20 right-20 w-28 h-28 bg-gradient-to-br from-green-200/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-gradient-to-br from-amber-300/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-36 h-36 bg-gradient-to-br from-green-300/30 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <FloatingElement3D floatDistance={12} floatSpeed={3}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-800 mb-4 text-balance">
              Get in Touch
            </h2>
          </FloatingElement3D>
                    <p className="text-lg text-amber-700 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info & Maps */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Contact Info */}
            <HoverCard3D hoverColor="from-amber-400 to-green-400" glowColor="rgba(251, 191, 36, 0.3)">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">
                  Contact Information
                </h3>

                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex gap-4">
                    
                      <div className="flex-shrink-0">
                        <div className="p-3 bg-gradient-to-br from-amber-100 to-green-100 rounded-2xl shadow-lg">
                          <Mail className="w-6 h-6 text-amber-600" />
                        </div>
                      </div>
                
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                      <p className="text-gray-600">{companyInfo.email}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-4">
                
                      <div className="flex-shrink-0">
                        <div className="p-3 bg-gradient-to-br from-amber-100 to-green-100 rounded-2xl shadow-lg">
                          <Phone className="w-6 h-6 text-amber-600" />
                        </div>
                      </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                      <p className="text-gray-600">{companyInfo.phone}</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex gap-4">
                    
                      <div className="flex-shrink-0">
                        <div className="p-3 bg-gradient-to-br from-amber-100 to-green-100 rounded-2xl shadow-lg">
                          <MapPin className="w-6 h-6 text-amber-600" />
                        </div>
                      </div>
                   
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                      <p className="text-gray-600">{companyInfo.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </HoverCard3D>

            {/* Google Maps Section */}
            <HoverCard3D hoverColor="from-amber-400 to-green-400" glowColor="rgba(251, 191, 36, 0.3)">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-br from-amber-50 via-white to-green-50 border-b border-amber-200/50 p-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">Find Us Here</h3>
                   <p className="text-gray-600 text-center">
                    Chamunda Mata Traders, Dharangaon Road, Pimpri Khurd
                  </p>
                </div>
                <div className="relative w-full h-80">
                  <iframe
                    src="https://www.google.com/maps?q=Chamunda%20Mata%20Traders,%20Dharangaon%20Road,%20Pimpri%20Khurd,%20Maharashtra%20425104&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                  {/* Clickable Overlay */}
                  <div 
                    className="absolute inset-0 bg-transparent cursor-pointer hover:bg-amber-500/10 transition-colors"
                    onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=Chamunda%20Mata%20Traders,%20Dharangaon%20Road,%20Pimpri%20Khurd,%20Maharashtra%20425104', '_blank')}
                    title="Click to get directions on Google Maps"
                  />
                </div>
              </div>
            </HoverCard3D>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <HoverCard3D hoverColor="from-amber-400 to-green-400" glowColor="rgba(251, 191, 36, 0.4)">
              <div className="p-4 sm:p-6 md:p-8 lg:p-10 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl">
                
         <h3 className="text-2xl font-bold text-gray-900 mb-8">
                    Send us a Message
                  </h3>                   
                     <p className="text-gray-600">
                     We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                  </p>
            
                
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <FloatingElement3D floatDistance={15} floatSpeed={2}>
                      <div className="text-6xl mb-6">🎉</div>
                    </FloatingElement3D>
                    <h4 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-green-600 bg-clip-text text-transparent mb-3">
                      Thank you for your message!
                    </h4>
                    <p className="text-gray-700 text-lg">
                      We'll get back to you as soon as possible.
                    </p>
                    <InteractiveButton3D 
                      color="from-amber-500 to-green-500"
                      className="px-8 py-3 mt-6"
                      onClick={() => setSubmitted(false)}
                    >
                      Send Another Message
                    </InteractiveButton3D>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 md:space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Your Name
                          </label>
                          <Input
                            type="text"
                            name="name"
                            placeholder="Client Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500 transition-all"
                          />
                        </div>
                     
                      
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Email Address
                          </label>
                          <Input
                            type="email"
                            name="email"
                            placeholder="client@gmail.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500 transition-all"
                          />
                        </div>
                      
                    </div>
                    
                   
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Subject
                        </label>
                        <Input
                          type="text"
                          name="subject"
                          placeholder="How can we help you?"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500 transition-all"
                        />
                      </div>
                   
                    
                   
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Your Message
                        </label>
                        <Textarea
                          name="message"
                          placeholder="Tell us more about your requirements..."
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={6}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500 resize-none transition-all"
                        />
                      </div>
                    
                    {/* Error Message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-center"
                      >
                        {error}
                      </motion.div>
                    )}
                    
                    <div className="flex justify-center">
                      <InteractiveButton3D 
                        type="submit"
                        disabled={loading}
                        color="from-amber-500 to-green-500"
                        className="px-12 py-4 text-lg font-semibold text-white"
                      >
                        <span className="flex items-center gap-2">
                          {loading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              Send Message
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18v-8l-9-9z" />
                              </svg>
                            </>
                          )}
                        </span>
                      </InteractiveButton3D>
                    </div>
                  </form>
                )}
              </div>
            </HoverCard3D>
          </motion.div>
        </div>
      </div>
    </ParallaxSection>
  );
}
