document.addEventListener('DOMContentLoaded', function() {
  try {
    // Mobile Navigation Toggle with error handling
    const initMobileMenu = () => {
      try {
        const hamburger = document.querySelector('.hamburger');
        const navList = document.querySelector('.nav-list');
        
        if (!hamburger || !navList) {
          console.warn('Mobile menu elements not found');
          return;
        }

        hamburger.addEventListener('click', function() {
          this.classList.toggle('active');
          navList.classList.toggle('active');
          document.body.classList.toggle('no-scroll');
        });

        const navLinks = document.querySelectorAll('.nav-list a');
        navLinks.forEach(link => {
          link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navList.classList.remove('active');
            document.body.classList.remove('no-scroll');
          });
        });
      } catch (error) {
        console.error('Mobile menu initialization error:', error);
      }
    };

    // Smooth scrolling with offset for fixed header
    const initSmoothScrolling = () => {
      try {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
              const header = document.querySelector('.header');
              const headerHeight = header ? header.offsetHeight : 0;
              const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
              
              window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
              });
            }
          });
        });
      } catch (error) {
        console.error('Smooth scrolling initialization error:', error);
      }
    };

    // Sticky header with throttle
    const initStickyHeader = () => {
      try {
        const header = document.querySelector('.header');
        if (!header) return;

        let lastScroll = 0;
        const throttle = (func, limit) => {
          let lastFunc;
          let lastRan;
          return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
              func.apply(context, args);
              lastRan = Date.now();
            } else {
              clearTimeout(lastFunc);
              lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                  func.apply(context, args);
                  lastRan = Date.now();
                }
              }, limit - (Date.now() - lastRan));
            }
          };
        };

        const handleScroll = throttle(function() {
          const currentScroll = window.pageYOffset;
          if (currentScroll > 100) {
            if (currentScroll > lastScroll) {
              header.classList.remove('scrolled');
            } else {
              header.classList.add('scrolled');
            }
          } else {
            header.classList.remove('scrolled');
          }
          lastScroll = currentScroll;
        }, 100);

        window.addEventListener('scroll', handleScroll);
      } catch (error) {
        console.error('Sticky header initialization error:', error);
      }
    };

    // Portfolio filtering with debounce
    const initPortfolioFilter = () => {
      try {
        const filterButtons = document.querySelectorAll('.portfolio-filter button');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        if (filterButtons.length === 0 || portfolioItems.length === 0) {
          console.warn('Portfolio filter elements not found');
          return;
        }

        const debounce = (func, delay) => {
          let timeout;
          return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
          };
        };

        filterButtons.forEach(button => {
          button.addEventListener('click', debounce(function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
              if (filterValue === '*' || item.classList.contains(filterValue.substring(1))) {
                item.style.display = 'block';
                setTimeout(() => {
                  item.style.opacity = '1';
                  item.style.transform = 'translateY(0)';
                }, 50);
              } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                  item.style.display = 'none';
                }, 300);
              }
            });
          }, 150));
        });
      } catch (error) {
        console.error('Portfolio filter initialization error:', error);
      }
    };

    // Testimonial slider with pause on hover
    const initTestimonialSlider = () => {
      try {
        const testimonials = document.querySelectorAll('.testimonial-item');
        if (testimonials.length === 0) return;

        let currentTestimonial = 0;
        let sliderInterval;
        
        const showTestimonial = (index) => {
          testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
            testimonial.style.opacity = i === index ? '1' : '0';
          });
        };

        const startSlider = () => {
          sliderInterval = setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
          }, 5000);
        };

        const sliderContainer = document.querySelector('.testimonials-slider');
        if (sliderContainer) {
          sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(sliderInterval);
          });
          
          sliderContainer.addEventListener('mouseleave', startSlider);
        }

        showTestimonial(0);
        startSlider();
      } catch (error) {
        console.error('Testimonial slider initialization error:', error);
      }
    };

    // Animate skill bars on scroll
    const initSkillBars = () => {
      try {
        const skillBars = document.querySelectorAll('.skill-level');
        if (skillBars.length === 0) return;

        const skillsSection = document.querySelector('.skills');
        if (!skillsSection) return;

        const animateSkillBars = () => {
          skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width') || bar.style.width;
            bar.style.width = '0';
            bar.setAttribute('data-width', width);
            
            setTimeout(() => {
              bar.style.width = width;
              bar.style.transition = 'width 1.5s var(--ease-out)';
            }, 100);
          });
        };

        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              animateSkillBars();
              observer.unobserve(entry.target);
            }
          });
        }, { 
          threshold: 0.5,
          rootMargin: '0px 0px -100px 0px'
        });
        
        observer.observe(skillsSection);
      } catch (error) {
        console.error('Skill bars initialization error:', error);
      }
    };

    // Form submission with validation
    const initForms = () => {
      try {
        // Contact form
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
          contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            
            try {
              submitButton.disabled = true;
              submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
              
              const formData = new FormData(this);
              const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
              });
              
              if (!response.ok) throw new Error('Network response was not ok');
              
              const successMessage = document.createElement('div');
              successMessage.className = 'form-success';
              successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully!';
              this.appendChild(successMessage);
              
              this.reset();
              setTimeout(() => successMessage.remove(), 5000);
            } catch (error) {
              const errorMessage = document.createElement('div');
              errorMessage.className = 'form-error';
              errorMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> There was a problem sending your message. Please try again.';
              contactForm.appendChild(errorMessage);
              setTimeout(() => errorMessage.remove(), 5000);
            } finally {
              submitButton.disabled = false;
              submitButton.innerHTML = originalButtonText;
            }
          });
        }

        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
          newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            if (!emailInput.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
              const errorElement = this.querySelector('.email-error') || document.createElement('div');
              errorElement.className = 'email-error';
              errorElement.textContent = 'Please enter a valid email address';
              errorElement.style.color = 'var(--error)';
              errorElement.style.marginTop = '0.5rem';
              if (!this.querySelector('.email-error')) {
                this.appendChild(errorElement);
              }
              return;
            }

            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            setTimeout(() => {
              const successMessage = document.createElement('p');
              successMessage.className = 'newsletter-success';
              successMessage.textContent = 'Thanks for subscribing!';
              this.appendChild(successMessage);
              
              this.reset();
              submitButton.disabled = false;
              submitButton.innerHTML = originalButtonText;
              
              setTimeout(() => successMessage.remove(), 5000);
            }, 1500);
          });
        }
      } catch (error) {
        console.error('Form initialization error:', error);
      }
    };

    // Scroll animations with IntersectionObserver
    const initScrollAnimations = () => {
      try {
        const animateElements = document.querySelectorAll('.animate-on-scroll');
        if (animateElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animated');
              observer.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: '0px 0px -100px 0px'
        });

        animateElements.forEach(element => {
          observer.observe(element);
        });
      } catch (error) {
        console.error('Scroll animations initialization error:', error);
      }
    };

    // Back to top button
    const initBackToTop = () => {
      try {
        const backToTopButton = document.createElement('button');
        backToTopButton.className = 'back-to-top';
        backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTopButton.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTopButton);
        
        backToTopButton.addEventListener('click', () => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        });
        
        window.addEventListener('scroll', () => {
          backToTopButton.classList.toggle('show', window.pageYOffset > 300);
        });
      } catch (error) {
        console.error('Back to top button initialization error:', error);
      }
    };

    // Portfolio item hover effects
    const initPortfolioHover = () => {
      try {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        if (portfolioItems.length === 0) return;

        portfolioItems.forEach(item => {
          const overlay = item.querySelector('.portfolio-overlay');
          if (!overlay) return;

          // Initialize state
          overlay.style.opacity = '0';
          overlay.style.transform = 'translateY(20px)';
          overlay.style.visibility = 'hidden';

          item.addEventListener('mouseenter', () => {
            overlay.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            overlay.style.opacity = '1';
            overlay.style.transform = 'translateY(0)';
            overlay.style.visibility = 'visible';
          });
          
          item.addEventListener('mouseleave', () => {
            overlay.style.transition = 'opacity 0.3s ease, transform 0.3s ease, visibility 0.3s 0.3s';
            overlay.style.opacity = '0';
            overlay.style.transform = 'translateY(20px)';
            overlay.style.visibility = 'hidden';
          });
        });
      } catch (error) {
        console.error('Portfolio hover effects initialization error:', error);
      }
    };

    // Update copyright year
    const updateCopyrightYear = () => {
      try {
        const footerText = document.querySelector('.footer-bottom p');
        if (footerText) {
          footerText.innerHTML = `&copy; ${new Date().getFullYear()} Douglas Oroko. All Rights Reserved.`;
        }
      } catch (error) {
        console.error('Copyright year update error:', error);
      }
    };

    // Initialize all components
    initMobileMenu();
    initSmoothScrolling();
    initStickyHeader();
    initPortfolioFilter();
    initTestimonialSlider();
    initSkillBars();
    initForms();
    initScrollAnimations();
    initBackToTop();
    initPortfolioHover();
    updateCopyrightYear();

  } catch (error) {
    console.error('Main initialization error:', error);
  }
});