'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function Portfolio() {
  const { toast } = useToast();
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, vx: number, vy: number}>>(() => []);
  const particlesRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const timelineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const technicalSkillsRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Form validation states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Initialize particles
  useEffect(() => {
    const newParticles: Array<{id: number, x: number, y: number, size: number, vx: number, vy: number}> = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2
      });
    }
    setParticles(newParticles);

    // Animation loop
    const animate = () => {
      setParticles(prev => prev.map(p => {
        let newX = p.x + p.vx;
        let newY = p.y + p.vy;
        let newVx = p.vx;
        let newVy = p.vy;

        if (newX <= 0 || newX >= 100) newVx *= -1;
        if (newY <= 0 || newY >= 100) newVy *= -1;

        return {
          ...p,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy
        };
      }));
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Intersection Observer for timeline animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-timeline-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    timelineRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      timelineRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  // Intersection Observer for technical skills animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-skills-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    technicalSkillsRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      technicalSkillsRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', message: '' };

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
        isValid = false;
      }
    }

    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      toast({
        title: "Message sent!",
        description: "Your message has been sent successfully.",
      });
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes timelineIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-timeline-in {
          animation: timelineIn 0.6s ease forwards;
        }

                
        @keyframes skillsIn {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-skills-in {
          animation: skillsIn 0.8s ease forwards;
        }
      `}</style>
      
      <div className="min-h-screen bg-slate-900 text-slate-100 overflow-x-hidden relative">
        {/* Floating AI Particles */}
        <div className="fixed inset-0 pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute bg-sky-400/60 rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
              }}
            />
          ))}
        </div>

        {/* Main Container */}
        <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row items-center justify-between mb-16">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Ifrahuddin Azmi
              </h1>
              <h2 className="text-xl md:text-2xl font-medium text-slate-300 mb-6 typewriter">
                Embedded & Automation Test Eng.
                </h2>
              <p className="text-slate-400 mb-8 mt-4 leading-relaxed">
                    🧠 Embedded & Automation Test Engineer skilled in Python, BLE/Wi-Fi protocol testing, and cloud-integrated systems. Focused on building robust automation frameworks and delivering scalable solutions.
                </p>
              <div className="flex space-x-4">
                <Button asChild className="px-6 py-3 bg-sky-500 hover:bg-sky-600 rounded-full font-medium transition-all flex items-center">
                  <a href="mailto:ifrahazmi@live.com">
                    <i className="fas fa-envelope mr-2"></i> Contact
                  </a>
                </Button>
                <Button asChild variant="outline" className="px-6 py-3 border border-sky-500 text-sky-400 hover:bg-sky-900/30 rounded-full font-medium transition-all flex items-center">
                  <a href="https://www.linkedin.com/in/ifrahuddin-azmi-8869787a/" target="_blank">
                    <i className="fab fa-linkedin-in mr-2"></i> LinkedIn
                  </a>
                </Button>
                <Button asChild className="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-full font-medium transition-all flex items-center">
                  <a href="/Ifrah_Azmi_Resume_Updated.pdf" download>
                    <i className="fas fa-download mr-2"></i> Resume
                  </a>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-sky-500/30 relative glow-card">
                  <img 
                    src="https://media.licdn.com/dms/image/v2/C5603AQGXPgNuu9kgwQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1520493769061?e=1756944000&v=beta&t=v8CLUoueDd51MTxaVYOHUvMdlTbpf8pleYotA-VAPlc" 
                    alt="Self Portrait" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 shadow-lg">
                  <span className="text-sky-400 font-bold">@LifeSingnals India Pvt. Ltd.</span>
                </div>
              </div>
            </div>
          </header>

          {/* Stats Section */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <Card className="bg-slate-800/50 border-slate-700 glow-card animate-stagger-1">
              <CardContent className="p-4">
                <h3 className="text-slate-400 text-sm mb-1 ml-2">Total Years of Experience</h3>
                <p className="text-3xl font-bold text-sky-400 ml-2 mt-1">4+</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 glow-card animate-stagger-2">
              <CardContent className="p-4">
                <h3 className="text-slate-400 text-sm mb-1 ml-2">Python Projects</h3>
                <p className="text-3xl font-bold text-sky-400 ml-2 mt-1">10+</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 glow-card animate-stagger-3">
              <CardContent className="p-4">
                <h3 className="text-slate-400 text-sm mb-1 ml-2">AI/ML Experience</h3>
                <p className="text-3xl font-bold text-sky-400 ml-2 mt-1">2+</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 glow-card animate-stagger-4">
              <CardContent className="p-4">
                <h3 className="text-slate-400 text-sm mb-1 ml-2">Sys. Admin & WIFI/BLE Protocols</h3>
                <p className="text-3xl font-bold text-sky-400 ml-2 mt-1">3+</p>
              </CardContent>
            </Card>
          </section>

          {/* About Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent text-center">
              Tech-Driven Vision
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-slate-800/50 border-slate-700 glow-card animate-slide-left">
                <CardHeader>
                  <div className="text-sky-400 text-4xl mb-4">
                    <i className="fas fa-brain"></i>
                  </div>
                  <CardTitle className="text-xl text-white">AI Efficiency Focus</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400">
                    Leveraged AI-driven tools and workflows to automate repetitive tasks, optimize test cycles, and boost overall engineering productivity.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700 glow-card animate-slide-right">
                <CardHeader>
                  <div className="text-sky-400 text-4xl mb-4">
                    <i className="fab fa-python"></i>
                    <span className="text-2xl"> + </span>
                    <i className="fas fa-microchip" style={{ fontSize: '20px' }}></i>
                    <span className="text-2xl"></span>
                  </div>
                  <CardTitle className="text-xl text-white">Python & Embedded Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400">
                    Developed scalable automation frameworks in Python and conducted protocol-level validation for embedded systems across Wi-Fi and BLE technologies.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Timeline Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent text-center">
              Journey of Excellence
            </h2>
            <div className="relative">
              <div className="absolute left-8 md:left-1/2 h-full w-0.5 bg-slate-700"></div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Side Items */}
                <div className="md:mr-auto md:pr-16 md:text-right">
                  <div 
                    ref={el => { timelineRefs.current[0] = el; }}
                    className="relative pl-12 md:pl-0 md:pr-12 timeline-item timeline-right mb-8 opacity-0"
                  >
                    <Card className="bg-slate-800/50 border-slate-700 glow-card">
                      <CardHeader>
                        <div className="text-sky-400 text-xl mb-2">
                          <i className="fas fa-university"></i>
                        </div>
                        <CardTitle className="text-lg text-sky-400">Bachelor&apos;s in Computer Science</CardTitle>
                        <CardDescription className="text-sm text-slate-400">VTU | 2021</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300">
                          Built a solid foundation in core computing principles, with hands-on exposure to programming, systems design, and emerging technologies—fueling a deep passion for innovation and problem-solving.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div 
                    ref={el => { timelineRefs.current[1] = el; }}
                    className="relative pl-12 md:pl-0 md:pr-12 timeline-item timeline-right mb-8 opacity-0"
                  >
                    <Card className="bg-slate-800/50 border-slate-700 glow-card">
                      <CardHeader>
                        <CardTitle className="text-lg text-sky-400">Cloud & System Engineering</CardTitle>
                        <CardDescription className="text-sm text-slate-400">(Part-Time Remote Internship) | Quanterian LLC</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300">
                          *Focused on cloud system and instance management, real-time monitoring, and deploying scalable solutions using Kubernetes for efficient infrastructure orchestration. Want to highlight specific platforms like AWS or Azure, or include automation tools you used? I can finesse that into the line next!
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                {/* Right Side Items */}
                <div className="md:ml-auto md:pl-16">
                  <div 
                    ref={el => { timelineRefs.current[2] = el; }}
                    className="relative pl-12 timeline-item timeline-left mb-8 opacity-0"
                  >
                    <Card className="bg-slate-800/50 border-slate-700 glow-card">
                      <CardHeader>
                        <div className="text-sky-400 text-xl mb-2">
                          <i className="fas fa-briefcase"></i>
                        </div>
                        <CardTitle className="text-lg text-sky-400">QA/Calibration Engineer</CardTitle>
                        <CardDescription className="text-sm text-slate-400">Transcaal Engineer India Pvt. Ltd. | 2021-2022</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300">
                          Performed testing and calibration of medical devices aligned with NABL and NABH accreditation standards, ensuring accuracy, compliance, and reliability in clinical environments.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div 
                    ref={el => { timelineRefs.current[3] = el; }}
                    className="relative pl-12 timeline-item timeline-left mb-8 opacity-0"
                  >
                    <Card className="bg-slate-800/50 border-slate-700 glow-card">
                      <CardHeader>
                        <CardTitle className="text-lg text-sky-400">Automation Test Engineer</CardTitle>
                        <CardDescription className="text-sm text-slate-400">LifeSignals India Pvt. Ltd. | 2022-Present</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300">
                          Built and maintained Python-based automation for biosensor validation, Wi-Fi/BLE protocol testing, and Linux file system verification, with deep focus on embedded systems and wireless security. Also contributed to wireless packet analysis and test optimization using tools like Wireshark and Scapy-driven scripts.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Skills Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent text-center">
              Technical Arsenal
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

              {/* Python & Automation */}
              <Card className="bg-slate-800/50 border-slate-700 glow-card animate-scale">
                <CardHeader>
                  <div className="text-sky-400 text-2xl mb-3">
                    <i className="fab fa-python"></i>
                  </div>
                  <CardTitle className="font-bold text-white">Python & Automation</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400 text-sm">
                    Robust test scripting and automation using Python, Robot Framework, Selenium, and PyTest.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Wireless Protocols */}
              <Card className="bg-slate-800/50 border-slate-700 glow-card animate-scale">
                <CardHeader>
                  <div className="text-sky-400 text-2xl mb-3">
                    <i className="fas fa-wifi"></i> + <i className="fab fa-bluetooth"></i>
                  </div>
                  <CardTitle className="font-bold text-white">Wireless Protocols</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400 text-sm">
                    Experience with BLE, Wi-Fi, TCP/IP, LTE, and Zigbee protocol testing and analysis.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Networking Tools */}
              <Card className="bg-slate-800/50 border-slate-700 glow-card animate-scale">
                <CardHeader>
                  <div className="text-sky-400 text-2xl mb-3">
                    <i className="fas fa-network-wired"></i>
                  </div>
                  <CardTitle className="font-bold text-white">Network & Packet Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400 text-sm">
                    Skilled in Wireshark, Scapy, Requests, and raw socket-level debugging.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* System Administration */}
              <Card className="bg-slate-800/50 border-slate-700 glow-card animate-scale">
                <CardHeader>
                  <div className="text-sky-400 text-2xl mb-3">
                    <i className="fab fa-linux"></i> + <i className="fab fa-windows"></i>
                  </div>
                  <CardTitle className="font-bold text-white">System Administration</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400 text-sm">
                    Managing Linux (Ubuntu, Kali) and OpenWrt systems, including cron jobs and bash scripting.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* DevOps & CI/CD */}
              <Card className="bg-slate-800/50 border-slate-700 glow-card animate-scale">
                <CardHeader>
                  <div className="text-sky-400 text-2xl mb-3">
                    <i className="fab fa-docker"></i> + <i className="fas fa-code-branch"></i>
                  </div>
                  <CardTitle className="font-bold text-white">DevOps & CI/CD</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400 text-sm">
                    Hands-on with Git, Bitbucket, Jenkins, Docker, Kubernetes (basic), and TestRail integration.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Web & APIs */}
              <Card className="bg-slate-800/50 border-slate-700 glow-card animate-scale">
                <CardHeader>
                  <div className="text-sky-400 text-2xl mb-3">
                    <i className="fas fa-code"></i>
                  </div>
                  <CardTitle className="font-bold text-white">Web & API Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400 text-sm">
                    Developed web services and dashboards using Django, FastAPI, Streamlit, and Flask.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Database Skills */}
              <Card className="bg-slate-800/50 border-slate-700 glow-card animate-scale">
                <CardHeader>
                  <div className="text-sky-400 text-2xl mb-3">
                    <i className="fas fa-database"></i>
                  </div>
                  <CardTitle className="font-bold text-white">Databases</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400 text-sm">
                    Experience with MySQL and NoSQL systems for testing, storage, and analytics workflows.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Security Testing */}
              <Card className="bg-slate-800/50 border-slate-700 glow-card animate-scale">
                <CardHeader>
                  <div className="text-sky-400 text-2xl mb-3">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <CardTitle className="font-bold text-white">Security Testing</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400 text-sm">
                    Validating wireless security, BLE/Wi-Fi vulnerabilities, and embedded system hardening.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 glow-card animate-scale">
                <CardHeader>
                  <div className="text-sky-400 text-2xl mb-3">
                    <i className="fas fa-file-code"></i> + <i className="fas fa-terminal"></i>
                  </div>
                  <CardTitle className="font-bold text-white">Shell Scripting & CLI Tools</CardTitle>
                </CardHeader>
              <CardContent>
              <CardDescription className="text-slate-400 text-sm">
                Proficient in Bash and Shell scripting for task automation, file operations, and system-level control across Linux environments.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Contact Section */}
          <section>
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent text-center">
            Get In Touch
          </h2>

          <div className="bg-slate-800/50 p-8 rounded-xl glow-card w-full max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-slate-400 mb-2">
                  Your name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-700 border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-sky-500'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-slate-400 mb-2">
                  Your email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-700 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-sky-500'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="message" className="block text-slate-400 mb-2">
                  Your message:
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  //required
                  //className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-700 border ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-sky-500'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2`}
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center"
              >
                <i className="fas fa-paper-plane mr-2"></i> Send
              </button>

              <p className="text-slate-400 text-sm mt-4 text-center">
                Your message will be sent directly to me
              </p>
            </form>
          </div>
        </section>
        </div>

        {/* Footer */}
        <footer className="bg-slate-900/50 py-8 mt-16 border-t border-slate-800">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center space-x-6 mb-6">
              <a href="https://x.com/Ifrah_Azmi" className="text-slate-400 hover:text-sky-400 transition-all">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="https://www.linkedin.com/in/ifrahuddin-azmi-8869787a/" className="text-slate-400 hover:text-sky-400 transition-all">
                <i className="fab fa-linkedin-in text-xl"></i>
              </a>
              <a href="https://github.com/ifrahazmi" className="text-slate-400 hover:text-sky-400 transition-all">
                <i className="fab fa-github text-xl"></i>
              </a>
              <a href="https://ifrahazmi.wixsite.com/techpark" className="text-slate-400 hover:text-sky-400 transition-all">
                <i className="fa fa-globe text-xl"></i>
              </a>
              <a href="https://www.facebook.com/Ifrahaz/" className="text-slate-400 hover:text-sky-400 transition-all">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="https://www.instagram.com/ifrah_azmi/" className="text-slate-400 hover:text-sky-400 transition-all">
                <i className="fab fa-instagram text-xl"></i>
              </a>
            </div>
            <p className="text-slate-500 text-sm">
              2025 © Ifrahuddin Azmi. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}