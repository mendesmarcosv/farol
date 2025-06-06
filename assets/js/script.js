/**
 * Farol - Custom JavaScript
 * ========================
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100; // Account for transparent navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 15px rgba(84, 191, 68, 0.3)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.hero-content, .hero-image, .floating-card');
    animateElements.forEach(el => observer.observe(el));
    
    // Mobile menu auto-close
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 992) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    }
                }
            });
        });
    }
    
    // Floating dots random movement enhancement
    const floatingDots = document.querySelectorAll('.floating-dot');
    
    floatingDots.forEach((dot, index) => {
        // Add some randomness to the animation delay
        dot.style.animationDelay = `${index * 0.5}s`;
        
        // Random subtle movement on mouse move
        document.addEventListener('mousemove', function(e) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            const moveX = (mouseX - 0.5) * 20;
            const moveY = (mouseY - 0.5) * 20;
            
            dot.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
    
    // Loading animation for the hero section
    setTimeout(() => {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.classList.add('loaded');
        }
    }, 100);
    
    // Plant parallax effect - Controlado para seção de depoimentos
    const plantImage = document.querySelector('.plant-image');
    const testimonialsSection = document.querySelector('.testimonials-section');
    
    if (plantImage && testimonialsSection) {
        let ticking = false;
        
        function updatePlantParallax() {
            const plantRect = plantImage.getBoundingClientRect();
            const testimonialsRect = testimonialsSection.getBoundingClientRect();
            
            // Só aplica parallax se a planta estiver visível e dentro da seção
            if (plantRect.top < window.innerHeight && plantRect.bottom > 0 && 
                testimonialsRect.top < window.innerHeight && testimonialsRect.bottom > 0) {
                
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.1; // Movimento mais sutil e controlado
                
                // Limita o movimento para evitar que saia da seção
                const limitedRate = Math.max(-100, Math.min(100, rate));
                
                // Combina o parallax com a animação de flutuação
                plantImage.style.transform = `translateY(${limitedRate}px)`;
            }
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updatePlantParallax);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick);
    }
    
    console.log('🚢 Farol website loaded successfully!');
    
    removeSplineBranding();
    
    // GSAP Animations for Statistics Section
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        initStatisticsAnimations();
        initSolutionAnimations();
        initBlurFadeOut();
    }
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Resize handler
window.addEventListener('resize', debounce(function() {
    // Handle any resize-specific logic here
    console.log('Window resized');
}, 250));

// Remove Spline logo/branding
function removeSplineBranding() {
    const splineViewers = document.querySelectorAll('spline-viewer');
    
    splineViewers.forEach(viewer => {
        const observer = new MutationObserver(() => {
            // Remove elementos de branding
            const brandingElements = viewer.shadowRoot?.querySelectorAll('[style*="spline"], [class*="spline"], [id*="spline"]');
            brandingElements?.forEach(el => {
                if (el.textContent?.toLowerCase().includes('spline') || 
                    el.style.position === 'absolute' && el.style.bottom) {
                    el.style.display = 'none';
                }
            });
        });
        
        observer.observe(viewer, { childList: true, subtree: true });
        
        // Também tenta remover após carregamento
        viewer.addEventListener('load', () => {
            setTimeout(() => {
                const brandingElements = viewer.shadowRoot?.querySelectorAll('[style*="spline"], [class*="spline"]');
                brandingElements?.forEach(el => {
                    if (el.textContent?.toLowerCase().includes('spline')) {
                        el.style.display = 'none';
                    }
                });
            }, 1000);
        });
    });
}

// GSAP Statistics Section Animations
function initStatisticsAnimations() {
    console.log('🎯 Iniciando animações GSAP para seção de estatísticas...');
    
    // Verificar se GSAP está carregado
    if (typeof gsap === 'undefined') {
        console.error('❌ GSAP não está carregado!');
        return;
    }
    
    if (typeof ScrollTrigger === 'undefined') {
        console.error('❌ ScrollTrigger não está carregado!');
        return;
    }
    
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    console.log('✅ GSAP e ScrollTrigger registrados');
    
    const statisticsSection = document.querySelector('.statistics-section');
    const textLines = document.querySelectorAll('.text-line');
    const planetRock1 = document.querySelector('.planet-rock-1');
    const planetRock2 = document.querySelector('.planet-rock-2');
    const pinSpacer = document.querySelector('.pin-spacer');
    
    console.log('📊 Elementos encontrados:', {
        statisticsSection: !!statisticsSection,
        textLines: textLines.length,
        planetRock1: !!planetRock1,
        planetRock2: !!planetRock2,
        pinSpacer: !!pinSpacer
    });
    
    if (statisticsSection) console.log('📍 Statistics section encontrada:', statisticsSection);
    if (planetRock1) console.log('🪨 Planet Rock 1 encontrado:', planetRock1);
    if (planetRock2) console.log('🪨 Planet Rock 2 encontrado:', planetRock2);
    
    if (!statisticsSection || !textLines.length || !planetRock1 || !planetRock2 || !pinSpacer) {
        console.error('❌ Alguns elementos não foram encontrados para animação');
        return;
    }
    
    // Create timeline for the statistics section
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: statisticsSection,
            start: "top top",
            end: "bottom top",
            scrub: 2,
            markers: false, // Remover markers para produção
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                const progress = self.progress;
                console.log('📈 Progress:', progress.toFixed(2));
                updateTextLines(progress);
            },
            onStart: () => console.log('🚀 Animação iniciada'),
            onComplete: () => console.log('✅ Animação completa')
        }
    });
    
    // Planet Rock 1 - Move diagonally up (mais visível)
    tl.to(planetRock1, {
        x: -200, // Movimento aumentado
        y: -300, // Movimento aumentado
        rotation: -45, // Rotação aumentada
        scale: 0.8, // Scale mais visível
        ease: "power2.inOut", // Easing melhor
        duration: 1
    }, 0);
    
    // Planet Rock 2 - Move diagonally down (mais visível)
    tl.to(planetRock2, {
        x: 200, // Movimento aumentado
        y: 300, // Movimento aumentado
        rotation: 45, // Rotação aumentada
        scale: 1.2, // Scale mais visível
        ease: "power2.inOut", // Easing melhor
        duration: 1
    }, 0);
    
    // Function to update text lines based on scroll progress
    function updateTextLines(progress) {
        const totalTexts = textLines.length; // 2 frases
        
        if (totalTexts === 2) {
            textLines.forEach((line, index) => {
                if (index === 0) {
                    // Primeira frase: visível de 0 a 0.45, fade out de 0.45 a 0.55
                    if (progress <= 0.45) {
                        line.classList.add('active');
                    } else if (progress > 0.45 && progress < 0.55) {
                        // Transição suave
                        line.classList.remove('active');
                    } else {
                        line.classList.remove('active');
                    }
                } else if (index === 1) {
                    // Segunda frase: fade in de 0.45 a 0.55, visível de 0.55 a 1
                    if (progress < 0.45) {
                        line.classList.remove('active');
                    } else if (progress >= 0.45 && progress < 0.55) {
                        // Transição suave
                        line.classList.add('active');
                    } else {
                        line.classList.add('active');
                    }
                }
            });
        }
    }
    
    // Initial state
    updateTextLines(0);
    
    // Refresh ScrollTrigger após criação
    setTimeout(() => {
        ScrollTrigger.refresh();
        console.log('🔄 ScrollTrigger refreshed');
    }, 100);
    
    console.log('✅ Animações GSAP configuradas com sucesso');
}

// GSAP Solution Section Animations
function initSolutionAnimations() {
    console.log('🎯 Iniciando animações GSAP para seção solution...');
    
    // Verificar se GSAP está carregado
    if (typeof gsap === 'undefined') {
        console.error('❌ GSAP não está carregado!');
        return;
    }
    
    if (typeof ScrollTrigger === 'undefined') {
        console.error('❌ ScrollTrigger não está carregado!');
        return;
    }
    
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    console.log('✅ GSAP e ScrollTrigger registrados para solution');
    
    const solutionSection = document.querySelector('.solution-section');
    const textLinesWhite = document.querySelectorAll('.text-line-white');
    const pinSpacerWhite = document.querySelector('.pin-spacer-white');
    const farolIcon = document.querySelector('.farol-icon');
    
    console.log('📊 Elementos solution encontrados:', {
        solutionSection: !!solutionSection,
        textLinesWhite: textLinesWhite.length,
        pinSpacerWhite: !!pinSpacerWhite,
        farolIcon: !!farolIcon
    });
    
    if (!solutionSection || !textLinesWhite.length || !pinSpacerWhite) {
        console.error('❌ Alguns elementos da solution não foram encontrados');
        return;
    }
    
    // Create timeline for the solution section
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: solutionSection,
            start: "top top",
            end: "bottom top",
            scrub: 2,
            markers: false,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                const progress = self.progress;
                console.log('📈 Solution Progress:', progress.toFixed(2));
                updateTextLinesWhite(progress);
            },
            onStart: () => console.log('🚀 Animação solution iniciada'),
            onComplete: () => console.log('✅ Animação solution completa')
        }
    });
    
    // Animate Farol icon entrance
    if (farolIcon) {
        gsap.set(farolIcon, { opacity: 0, y: 30, scale: 0.8 });
        
        gsap.to(farolIcon, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: solutionSection,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    }
    
    // Function to update text lines based on scroll progress
    function updateTextLinesWhite(progress) {
        const totalTexts = textLinesWhite.length;
        
        if (totalTexts === 3) {
            textLinesWhite.forEach((line, index) => {
                if (index === 0) {
                    // Primeira frase: visível de 0 a 0.30
                    if (progress <= 0.30) {
                        line.classList.add('active');
                    } else {
                        line.classList.remove('active');
                    }
                } else if (index === 1) {
                    // Segunda frase: visível de 0.30 a 0.65
                    if (progress >= 0.30 && progress <= 0.65) {
                        line.classList.add('active');
                    } else {
                        line.classList.remove('active');
                    }
                } else if (index === 2) {
                    // Terceira frase: visível de 0.65 a 1
                    if (progress >= 0.65) {
                        line.classList.add('active');
                    } else {
                        line.classList.remove('active');
                    }
                }
            });
        } else if (totalTexts === 2) {
            // Fallback para 2 frases (código anterior)
            textLinesWhite.forEach((line, index) => {
                if (index === 0) {
                    if (progress <= 0.45) {
                        line.classList.add('active');
                    } else {
                        line.classList.remove('active');
                    }
                } else if (index === 1) {
                    if (progress >= 0.45) {
                        line.classList.add('active');
                    } else {
                        line.classList.remove('active');
                    }
                }
            });
        }
    }
    
    // Initial state
    updateTextLinesWhite(0);
    
    // Refresh ScrollTrigger após criação
    setTimeout(() => {
        ScrollTrigger.refresh();
        console.log('🔄 ScrollTrigger solution refreshed');
    }, 100);
    
    console.log('✅ Animações GSAP solution configuradas com sucesso');
}

// GSAP Blur Fade Out Animation
function initBlurFadeOut() {
    console.log('Animação de blur desativada.');
}

// Return cleanup function
function cleanupGSAP() {
    ctx.revert();
    console.log('🧹 GSAP context cleaned up');
} 