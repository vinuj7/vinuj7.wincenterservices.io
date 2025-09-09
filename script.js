// Attendre le chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Variables globales
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    const sections = document.querySelectorAll('.page-section');
    const header = document.querySelector('.header');
    
    // Gestion du menu mobile
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileMenu.classList.toggle('active');
        });
        
        // Fermer le menu mobile en cliquant ailleurs
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.remove('active');
            }
        });
        
        // Fermer le menu mobile lors du redimensionnement
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                mobileMenu.classList.remove('active');
            }
        });
    }
    
    // Navigation entre les sections
    function showSection(targetId) {
        // Cacher toutes les sections
        sections.forEach(section => {
            section.classList.remove('active');
            section.classList.add('hidden');
        });
        
        // Afficher la section cible
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            targetSection.classList.add('active');
            
            // Animer l'entrée de la section
            targetSection.style.opacity = '0';
            targetSection.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                targetSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                targetSection.style.opacity = '1';
                targetSection.style.transform = 'translateY(0)';
            }, 50);
        }
        
        // Mettre à jour les liens actifs
        updateActiveNavLinks(targetId);
        
        // Fermer le menu mobile
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
        }
        
        // Faire défiler vers le haut
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Mettre à jour les liens de navigation actifs
    function updateActiveNavLinks(activeId) {
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${activeId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Gestion des clics sur les liens de navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                const sectionId = href.substring(1);
                showSection(sectionId);
                
                // Mettre à jour l'URL sans recharger la page
                history.pushState(null, null, href);
            }
        });
    });
    
    // Gestion du bouton retour/avant du navigateur
    window.addEventListener('popstate', function() {
        const hash = window.location.hash;
        const sectionId = hash ? hash.substring(1) : 'accueil';
        showSection(sectionId);
    });
    
    // Initialisation de la section active au chargement
    const initialHash = window.location.hash;
    const initialSection = initialHash ? initialHash.substring(1) : 'accueil';
    showSection(initialSection);
    
    // Effet de scroll sur le header
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        // Changer l'apparence du header en fonction du scroll
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Gestion du FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-btn');
        const content = item.querySelector('.faq-content');
        
        if (btn && content) {
            btn.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Fermer tous les autres items FAQ
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Basculer l'item actuel
                if (isActive) {
                    item.classList.remove('active');
                } else {
                    item.classList.add('active');
                }
            });
        }
    });
    
    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = {
                nom: formData.get('nom'),
                prenom: formData.get('prenom'),
                email: formData.get('email'),
                message: formData.get('message')
            };
            
            // Validation simple
            let isValid = true;
            let errorMessage = '';
            
            if (!data.nom.trim()) {
                isValid = false;
                errorMessage += 'Le nom est requis.\n';
                highlightError(contactForm.querySelector('#nom'));
            } else {
                removeErrorHighlight(contactForm.querySelector('#nom'));
            }
            
            if (!data.prenom.trim()) {
                isValid = false;
                errorMessage += 'Le prénom est requis.\n';
                highlightError(contactForm.querySelector('#prenom'));
            } else {
                removeErrorHighlight(contactForm.querySelector('#prenom'));
            }
            
            if (!data.email.trim() || !isValidEmail(data.email)) {
                isValid = false;
                errorMessage += 'Un email valide est requis.\n';
                highlightError(contactForm.querySelector('#email'));
            } else {
                removeErrorHighlight(contactForm.querySelector('#email'));
            }
            
            if (!data.message.trim()) {
                isValid = false;
                errorMessage += 'Le message est requis.\n';
                highlightError(contactForm.querySelector('#message'));
            } else {
                removeErrorHighlight(contactForm.querySelector('#message'));
            }
            
            if (isValid) {
                // Simulation d'envoi du formulaire
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Envoi en cours...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    showNotification('Message envoyé avec succès ! Nous vous recontacterons bientôt.', 'success');
                    contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            } else {
                showNotification(errorMessage, 'error');
            }
        });
    }
    
    // Gestion du formulaire newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            if (emailInput && isValidEmail(emailInput.value)) {
                submitBtn.textContent = 'Inscription...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    showNotification('Inscription à la newsletter réussie !', 'success');
                    this.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            } else {
                showNotification('Veuillez entrer un email valide.', 'error');
            }
        });
    }
    
    // Fonctions utilitaires
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function highlightError(element) {
        if (element) {
            element.style.borderColor = '#ef4444';
            element.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        }
    }
    
    function removeErrorHighlight(element) {
        if (element) {
            element.style.borderColor = '#e2e8f0';
            element.style.boxShadow = 'none';
        }
    }
    
    // Système de notification
    function showNotification(message, type = 'info') {
        // Supprimer les notifications existantes
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());
        
        // Créer la nouvelle notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const colors = {
            success: { bg: '#10b981', border: '#059669' },
            error: { bg: '#ef4444', border: '#dc2626' },
            info: { bg: '#3b82f6', border: '#2563eb' }
        };
        
        const color = colors[type] || colors.info;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${color.bg};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            max-width: 350px;
            white-space: pre-line;
            border-left: 4px solid ${color.border};
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animation de sortie et suppression
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    
    // Animation au scroll pour les éléments
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Appliquer l'animation aux éléments
    const animatedElements = document.querySelectorAll(
        '.mission-card, .workflow-step, .expertise-card, .portfolio-card, .blog-card, .testimonial-card'
    );
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        fadeInObserver.observe(el);
    });
    
    // Effet de parallaxe léger sur l'image hero
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const speed = scrolled * 0.1;
            heroImage.style.transform = `translateY(${speed}px)`;
        });
    }
    
    // Animation des éléments flottants
    function animateFloatingElements() {
        const floatingElements = document.querySelectorAll('.float-element');
        
        floatingElements.forEach((element, index) => {
            const delay = index * 2000; // 2 secondes de décalage entre chaque élément
            const duration = 6000; // 6 secondes pour l'animation complète
            
            setInterval(() => {
                element.style.transform = `translateY(-20px)`;
                setTimeout(() => {
                    element.style.transform = `translateY(0px)`;
                }, duration / 2);
            }, duration + delay);
        });
    }
    
    // Démarrer les animations des éléments flottants
    animateFloatingElements();
    
    // Gestion des liens portfolio
    const portfolioBtns = document.querySelectorAll('.portfolio-btn');
    portfolioBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Projet en cours de développement. Plus de détails bientôt !', 'info');
        });
    });
    
    // Gestion des liens blog
    const blogLinks = document.querySelectorAll('.blog-link');
    blogLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Article complet disponible prochainement !', 'info');
        });
    });
    
    // Effet de typing pour le titre hero (optionnel)
    const heroTitle = document.querySelector('.hero-subtitle');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Démarrer l'effet de typing après un délai
        setTimeout(typeWriter, 1000);
    }
    
    // Smooth scroll pour les liens internes
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]:not(.nav-link):not(.mobile-link)');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection && targetSection.classList.contains('page-section')) {
                showSection(targetId);
            }
        });
    });
    
    // Gestion du redimensionnement de la fenêtre
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Recalculer les positions si nécessaire
            if (window.innerWidth > 768) {
                mobileMenu.classList.remove('active');
            }
        }, 250);
    });
    
    // Message de bienvenue
    setTimeout(() => {
        showNotification('Bienvenue chez WS - Solutions Digitales ! 🚀', 'success');
    }, 1500);
    
    // Log de débogage
    console.log('🚀 WS - Solutions Digitales website loaded successfully!');
    console.log('📱 Mobile menu:', mobileMenuBtn ? 'Ready' : 'Not found');
    console.log('📄 Sections found:', sections.length);
    console.log('🔗 Navigation links:', navLinks.length);
});