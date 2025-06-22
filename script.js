// Global variables
let isMenuOpen = false
let activeSection = "home"

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation()
  initializeScrollEffects()
  initializeForms()
  initializeAnimations()
})

// Navigation Functions
function initializeNavigation() {
  // Add click listeners to navigation links
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href").substring(1)
      scrollToSection(targetId)

      // Close mobile menu if open
      if (isMenuOpen) {
        toggleMobileMenu()
      }
    })
  })

  // Update active navigation on scroll
  window.addEventListener("scroll", updateActiveNavigation)
}

function toggleMobileMenu() {
  const mobileNav = document.querySelector(".mobile-nav")
  const menuBtn = document.querySelector(".mobile-menu-btn i")

  isMenuOpen = !isMenuOpen

  if (isMenuOpen) {
    mobileNav.classList.add("active")
    menuBtn.className = "fas fa-times"
  } else {
    mobileNav.classList.remove("active")
    menuBtn.className = "fas fa-bars"
  }
}

function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    const headerHeight = document.querySelector(".header").offsetHeight
    const elementPosition = element.offsetTop - headerHeight

    window.scrollTo({
      top: elementPosition,
      behavior: "smooth",
    })
  }
}

function updateNavigationHighlight(activeId) {
  // Remove active class from all nav links
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.classList.remove("active")
  })

  // Add active class to current section links - более точный селектор
  const activeLinks = document.querySelectorAll(`.nav-link[href="#${activeId}"]`)
  activeLinks.forEach((link) => {
    link.classList.add("active")
  })
}

// Улучшить функцию определения активной секции
function updateActiveNavigation() {
  const sections = ["home", "about", "services", "doctors", "prices", "promotions", "reviews", "contacts"]
  const scrollPosition = window.scrollY + 150 // увеличиваем offset

  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i]
    const element = document.getElementById(section)
    if (element) {
      const offsetTop = element.offsetTop

      if (scrollPosition >= offsetTop) {
        if (activeSection !== section) {
          activeSection = section
          updateNavigationHighlight(section)
        }
        break
      }
    }
  }
}

// Services Section Functions
function showService(serviceId) {
  // Hide all service panels
  const panels = document.querySelectorAll(".service-panel")
  panels.forEach((panel) => {
    panel.classList.remove("active")
  })

  // Remove active class from all tabs
  const tabs = document.querySelectorAll(".service-tab")
  tabs.forEach((tab) => {
    tab.classList.remove("active")
  })

  // Show selected panel
  const selectedPanel = document.getElementById(serviceId)
  if (selectedPanel) {
    selectedPanel.classList.add("active")
  }

  // Add active class to selected tab
  const selectedTab = event.target
  selectedTab.classList.add("active")
}

// Form Handling Functions
function initializeForms() {
  // Set minimum date for appointment forms
  const dateInputs = document.querySelectorAll('input[type="date"]')
  const today = new Date().toISOString().split("T")[0]
  dateInputs.forEach((input) => {
    input.min = today
  })

  // Phone number formatting
  const phoneInputs = document.querySelectorAll('input[type="tel"]')
  phoneInputs.forEach((input) => {
    input.addEventListener("input", formatPhoneNumber)
  })
}

function formatPhoneNumber(e) {
  let value = e.target.value.replace(/\D/g, "")
  if (value.length >= 1) {
    value =
      "+7 (" +
      value.substring(1, 4) +
      ") " +
      value.substring(4, 7) +
      "-" +
      value.substring(7, 9) +
      "-" +
      value.substring(9, 11)
  }
  e.target.value = value
}

function handleAppointmentSubmit(event) {
  event.preventDefault()

  const form = event.target
  const formData = new FormData(form)

  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]')
  const originalText = submitBtn.textContent
  submitBtn.textContent = "Отправка..."
  submitBtn.disabled = true

  // Simulate form submission
  setTimeout(() => {
    alert("Спасибо за заявку! Мы свяжемся с вами в течение 15 минут.")
    form.reset()

    // Reset button
    submitBtn.textContent = originalText
    submitBtn.disabled = false
  }, 1500)
}

function handleContactSubmit(event) {
  event.preventDefault()

  const form = event.target
  const formData = new FormData(form)

  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]')
  const originalText = submitBtn.textContent
  submitBtn.textContent = "Отправка..."
  submitBtn.disabled = true

  // Simulate form submission
  setTimeout(() => {
    alert("Сообщение отправлено! Мы ответим вам в ближайшее время.")
    form.reset()

    // Reset button
    submitBtn.textContent = originalText
    submitBtn.disabled = false
  }, 1500)
}

// Animation Functions
function initializeScrollEffects() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-up")
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(
    ".feature-card, .doctor-card, .price-card, .promotion-card, .review-card",
  )
  animatedElements.forEach((el) => {
    observer.observe(el)
  })
}

function initializeAnimations() {
  // Add hover effects to cards
  const cards = document.querySelectorAll(
    ".card, .feature-card, .doctor-card, .price-card, .promotion-card, .review-card",
  )

  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
    })
  })

  // Add click animation to buttons
  const buttons = document.querySelectorAll(".btn")
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      this.style.transform = "scale(0.95)"
      setTimeout(() => {
        this.style.transform = "scale(1)"
      }, 150)
    })
  })
}

// Review Modal Functions
function openReviewModal() {
  const modal = document.getElementById("reviewModal")
  modal.classList.add("active")
  document.body.style.overflow = "hidden"

  // Initialize star rating
  initializeStarRating()

  // Track event
  trackEvent("Modal", "Open", "Review Modal")
}

function closeReviewModal() {
  const modal = document.getElementById("reviewModal")
  modal.classList.remove("active")
  document.body.style.overflow = ""

  // Reset form
  const form = document.querySelector(".review-form")
  form.reset()
  resetStarRating()
}

function initializeStarRating() {
  const stars = document.querySelectorAll(".star")
  const ratingInput = document.getElementById("reviewRating")

  // Set initial rating to 5 stars
  updateStarDisplay(5)
  ratingInput.value = 5

  stars.forEach((star, index) => {
    star.addEventListener("click", function () {
      const rating = Number.parseInt(this.dataset.rating)
      ratingInput.value = rating
      updateStarDisplay(rating)
    })

    star.addEventListener("mouseenter", function () {
      const rating = Number.parseInt(this.dataset.rating)
      updateStarDisplay(rating)
    })
  })

  // Reset on mouse leave
  const starRating = document.querySelector(".star-rating")
  starRating.addEventListener("mouseleave", () => {
    const currentRating = Number.parseInt(ratingInput.value)
    updateStarDisplay(currentRating)
  })
}

function updateStarDisplay(rating) {
  const stars = document.querySelectorAll(".star")
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add("active")
    } else {
      star.classList.remove("active")
    }
  })
}

function resetStarRating() {
  const stars = document.querySelectorAll(".star")
  stars.forEach((star) => {
    star.classList.remove("active")
  })
  // Set back to 5 stars default
  updateStarDisplay(5)
  document.getElementById("reviewRating").value = 5
}

function handleReviewSubmit(event) {
  event.preventDefault()

  const form = event.target
  const formData = {
    name: document.getElementById("reviewName").value,
    email: document.getElementById("reviewEmail").value,
    rating: document.getElementById("reviewRating").value,
    service: document.getElementById("reviewService").value,
    text: document.getElementById("reviewText").value,
  }

  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]')
  const originalText = submitBtn.textContent
  submitBtn.textContent = "Отправка..."
  submitBtn.disabled = true

  // Simulate form submission
  setTimeout(() => {
    // Create new review card and add to reviews section
    addReviewToPage(formData)

    alert("Спасибо за ваш отзыв! Он будет опубликован после модерации.")
    closeReviewModal()

    // Reset button
    submitBtn.textContent = originalText
    submitBtn.disabled = false

    // Track successful submission
    trackEvent("Form", "Submit", "Review Form")
  }, 1500)
}

function addReviewToPage(reviewData) {
  const reviewsGrid = document.querySelector(".reviews-grid")
  const newReviewCard = document.createElement("div")
  newReviewCard.className = "review-card"

  // Generate stars HTML
  let starsHtml = ""
  for (let i = 0; i < 5; i++) {
    if (i < Number.parseInt(reviewData.rating)) {
      starsHtml += '<i class="fas fa-star"></i>'
    } else {
      starsHtml += '<i class="far fa-star"></i>'
    }
  }

  // Get current date
  const currentDate = new Date().toLocaleDateString("ru-RU")

  newReviewCard.innerHTML = `
        <div class="review-header">
            <div class="stars">
                ${starsHtml}
            </div>
            <span class="review-date">${currentDate}</span>
        </div>
        <p>"${reviewData.text}"</p>
        <div class="review-author">${reviewData.name}</div>
        ${reviewData.service ? `<div class="review-service">Услуга: ${getServiceName(reviewData.service)}</div>` : ""}
    `

  // Add animation class
  newReviewCard.style.opacity = "0"
  newReviewCard.style.transform = "translateY(20px)"

  // Insert at the beginning of reviews grid
  reviewsGrid.insertBefore(newReviewCard, reviewsGrid.firstChild)

  // Animate in
  setTimeout(() => {
    newReviewCard.style.transition = "all 0.5s ease"
    newReviewCard.style.opacity = "1"
    newReviewCard.style.transform = "translateY(0)"
  }, 100)
}

function getServiceName(serviceValue) {
  const serviceNames = {
    consultation: "Консультация",
    therapy: "Терапия",
    surgery: "Хирургия",
    orthodontics: "Ортодонтия",
    implantation: "Имплантация",
    hygiene: "Гигиена",
    orthopedics: "Ортопедия",
  }
  return serviceNames[serviceValue] || serviceValue
}

// Close modal when clicking outside
document.addEventListener("click", (event) => {
  const modal = document.getElementById("reviewModal")
  if (event.target === modal) {
    closeReviewModal()
  }
})

// Close modal with Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const modal = document.getElementById("reviewModal")
    if (modal && modal.classList.contains("active")) {
      closeReviewModal()
    }
    if (isMenuOpen) {
      toggleMobileMenu()
    }
  }
})

// Utility Functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(updateActiveNavigation, 10)
window.addEventListener("scroll", optimizedScrollHandler)

// Handle window resize
window.addEventListener("resize", () => {
  if (window.innerWidth > 1024 && isMenuOpen) {
    toggleMobileMenu()
  }
})

// Smooth scroll polyfill for older browsers
if (!("scrollBehavior" in document.documentElement.style)) {
  const smoothScrollPolyfill = (target) => {
    const startPosition = window.pageYOffset
    const targetPosition = target.offsetTop - document.querySelector(".header").offsetHeight
    const distance = targetPosition - startPosition
    const duration = 1000
    let start = null

    function step(timestamp) {
      if (!start) start = timestamp
      const progress = timestamp - start
      const progressPercentage = Math.min(progress / duration, 1)

      // Easing function
      const ease =
        progressPercentage < 0.5
          ? 2 * progressPercentage * progressPercentage
          : 1 - Math.pow(-2 * progressPercentage + 2, 3) / 2

      window.scrollTo(0, startPosition + distance * ease)

      if (progress < duration) {
        window.requestAnimationFrame(step)
      }
    }

    window.requestAnimationFrame(step)
  }

  // Override scrollToSection for older browsers
  window.scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      smoothScrollPolyfill(element)
    }
  }
}

// Performance optimization: Lazy loading for images
function initializeLazyLoading() {
  const images = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}

// Initialize lazy loading if supported
if ("IntersectionObserver" in window) {
  initializeLazyLoading()
}

// Error handling for forms
function handleFormError(form, message) {
  const errorDiv = document.createElement("div")
  errorDiv.className = "form-error"
  errorDiv.style.cssText = "color: #ef4444; margin-top: 10px; font-size: 14px;"
  errorDiv.textContent = message

  // Remove existing error messages
  const existingError = form.querySelector(".form-error")
  if (existingError) {
    existingError.remove()
  }

  form.appendChild(errorDiv)

  // Remove error after 5 seconds
  setTimeout(() => {
    errorDiv.remove()
  }, 5000)
}

// Local storage for form data (optional)
function saveFormData(formId, data) {
  try {
    localStorage.setItem(formId, JSON.stringify(data))
  } catch (e) {
    console.warn("Could not save form data to localStorage")
  }
}

function loadFormData(formId) {
  try {
    const data = localStorage.getItem(formId)
    return data ? JSON.parse(data) : null
  } catch (e) {
    console.warn("Could not load form data from localStorage")
    return null
  }
}

// Analytics tracking (placeholder)
function trackEvent(category, action, label) {
  // Placeholder for analytics tracking
  console.log("Event tracked:", { category, action, label })

  // Example: Google Analytics
  // if (typeof gtag !== 'undefined') {
  //     gtag('event', action, {
  //         event_category: category,
  //         event_label: label
  //     });
  // }
}

// Track important user interactions
document.addEventListener("click", (e) => {
  if (e.target.matches(".btn-primary")) {
    trackEvent("Button", "Click", e.target.textContent.trim())
  }

  if (e.target.matches(".nav-link")) {
    trackEvent("Navigation", "Click", e.target.textContent.trim())
  }
})

// Console welcome message
console.log("%cDentaCare Website", "color: #2563eb; font-size: 24px; font-weight: bold;")
console.log("%cСайт стоматологической клиники готов к работе!", "color: #10b981; font-size: 16px;")

// Add CSS for review service display
const additionalCSS = `
.review-service {
    font-size: 0.875rem;
    color: #2563eb;
    margin-top: 8px;
    font-weight: 500;
}
`

// Inject additional CSS
const styleSheet = document.createElement("style")
styleSheet.textContent = additionalCSS
document.head.appendChild(styleSheet)
