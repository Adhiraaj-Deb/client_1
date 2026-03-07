# Right Strike Martial Arts Club - Website Documentation

## Overview

This is a professional marketing website for **Right Strike Martial Arts Club**, a Shito-Ryu Karate dojo located in Bangalore, Karnataka, India. The website showcases the club's programs, philosophy, and provides a contact form for trial class enquiries.

---

## File Structure

```
karate-dojo/
├── index.html          # Main HTML file (single-page application)
├── styles.css          # All CSS styles and responsive design
├── script.js           # JavaScript functionality
└── assets/
    ├── images/         # Hero background, instructor photo, training images
    └── loading-video.mp4  # Loading screen background video
```

---

## Color Scheme (Aka/Ao Karate Theme)

The website uses a karate-inspired color palette representing the two competitor colors in kumite:

### CSS Variables (`:root`)
| Variable | Color | Usage |
|----------|-------|-------|
| `--color-primary` | `#C41E3A` (Cardinal Red - Aka) | Primary accents, featured elements |
| `--color-primary-light` | `#E63950` | Lighter red variations |
| `--color-primary-dark` | `#9A1830` | Darker red for depth |
| `--color-accent` | `#1E5AAC` (Royal Blue - Ao) | Secondary accents, links, icons |
| `--color-accent-secondary` | `#1A4C8C` | Darker blue variations |
| `--color-accent-tertiary` | `#3A7BD5` | Hover states, highlights |

### Background Colors
- `--color-background`: `#0a0a0a` (Near black)
- `--color-background-light`: `#1a1a1a`
- `--color-background-dark`: `#050505`

---

## Key Features & Functionality

### 1. Loading Screen
**Location**: `index.html` lines 22-34, `styles.css` lines 80-210, `script.js` lines 1-49

- Video background with blurred overlay
- "Right Strike" text centered
- Timeline: 2.31s video playback → 90ms fade-out → content reveal
- Fallback: Black background if video fails to load

### 2. Navigation (Navbar)
**Location**: `index.html` lines 37-54, `styles.css` lines 350-442, `script.js` lines 51-135

- Fixed position, becomes solid on scroll (adds `.scrolled` class)
- Logo centered, navigation links on right
- **Mobile**: Hamburger menu with slide-in sidebar
- **Logo Link**: Clicks return to `#home` section

### 3. Mobile Menu (Sidebar)
**Location**: `styles.css` lines 1268-1347, `script.js` lines 78-99

**How it works**:
1. Toggle button adds/removes `.active` class on `.nav-menu`
2. `body.no-scroll` prevents background scrolling
3. CSS `transform: translateX(100%)` → `translateX(0)` for slide animation
4. Menu items fade in with staggered delays (0.1s - 0.4s)

**Important**: The scroll position is preserved using `position: fixed` on body with negative `top` offset. When menu closes, scroll position is restored.

### 4. Hero Section
**Location**: `index.html` lines 56-73, `styles.css` lines 444-533

- Full-screen background image with gradient overlay
- Centered content: Welcome text, title, subtitle, tagline
- CTA button links to contact section

### 5. About/Instructor Section
**Location**: `index.html` lines 75-128, `styles.css` lines 569-648

- Two-column layout: Instructor photo + Bio
- GSAP ScrollTrigger text reveal animation on `.js-fill` spans
- Credentials list with emoji icons

### 6. Bento Grid (Why Choose Us)
**Location**: `index.html` lines 131-244, `styles.css` lines 749-1034

**Layout**:
- 3-column grid on desktop
- 2-column on tablet (max-width: 1024px)
- 1-column on mobile (max-width: 768px)

**Card Types**:
- `.bento-large`: Spans 2 columns
- `.bento-medium`: Single column
- `.bento-full`: Spans all 3 columns (horizontal layout)

**Animations**:
- Fade-in on scroll via IntersectionObserver
- Hover effects with `translateY(-8px)` lift
- Floating animation on first featured card

### 7. Programs Section
**Location**: `index.html` lines 247-304, `styles.css` lines 650-748

- Three program cards: Foundation, Development, Mastery
- Cards have top gradient bar that scales in on hover
- Feature lists with checkmark bullets

### 8. AI Assistant Section (Demo)
**Location**: `index.html` lines 306-344

- Placeholder section for future AI chatbot feature
- 4 feature items with emoji icons

### 9. Contact Form
**Location**: `index.html` lines 346-421, `styles.css` lines 1077-1179, `script.js` lines 137-203

**Formspree Integration**:
- Action URL: `https://formspree.io/f/mzddzkqa`
- Method: POST
- AJAX submission with loading state

**Form Fields**:
1. Your Name (required)
2. Child's Name (optional)
3. Age (optional, 5-50)
4. Email Address (required)
5. Phone Number (required)
6. Message/Questions (optional)

**Submission Flow**:
1. Button changes to "Sending..."
2. `fetch()` POST to Formspree
3. Success: Green/blue message, form resets
4. Error: Red message shown
5. Messages auto-clear after 5 seconds

### 10. Footer
**Location**: `index.html` lines 423-452, `styles.css` lines 1182-1225

- Three-column layout: Branding, Quick Links, Contact Info
- Copyright notice at bottom

---

## JavaScript Functions

### Loading Screen (`initLoadingScreen`)
```javascript
// Timeline: fade-in → 2.31s video → fade-out → remove
setTimeout(() => { loadingScreen.classList.add('fade-out'); }, 2310);
setTimeout(() => { loadingScreen.style.display = 'none'; }, 2400);
```

### Navbar Scroll Effect
```javascript
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});
```

### Smooth Scroll
```javascript
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Skip if body is locked (mobile menu open)
        if (document.body.classList.contains('no-scroll')) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});
```

### Mobile Menu Toggle
```javascript
mobileMenuToggle.addEventListener('click', () => {
    // Capture scroll position before locking
    scrollPosition = window.scrollY;
    // Lock body with position: fixed
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    // ... on close: restore position and scroll
});
```

### GSAP Text Reveal
```javascript
gsap.to(target, {
    backgroundPosition: '0% 0',
    scrollTrigger: {
        trigger: target.closest('.js-fill'),
        start: 'top 75%',
        end: 'top 40%',
        scrub: 0.5
    }
});
```

---

## CSS Utility Classes

| Class | Purpose |
|-------|---------|
| `.container` | Max-width 1200px, centered |
| `.section-padding` | Vertical padding (6rem) |
| `.btn` | Base button styles |
| `.btn-primary` | Blue gradient button |
| `.btn-secondary` | Transparent with border |
| `.btn-outline` | Blue outline button |
| `.fade-in` | Fade-in animation class |
| `.no-scroll` | Prevents body scrolling |
| `.scrolled` | Applied to navbar on scroll |
| `.active` | Active state for menu/toggle |

---

## Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| `> 1024px` | Full desktop layout, 3-column grids |
| `768px - 1024px` | Tablet, 2-column bento grid |
| `< 768px` | Mobile, sidebar navigation, 1-column layouts |
| `< 480px` | Small mobile, reduced spacing |

---

## External Dependencies

1. **Google Fonts**: Inter, Outfit, Bebas Neue
2. **GSAP**: ScrollTrigger plugin for animations
3. **Formspree**: Form submission handling

### CDN Links
```html
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=block" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

---

## GitHub Repository

**URL**: https://github.com/Adhiraaj-Deb/right-strike-demo

---

## Contact Information (as configured)

- **Phone**: +91 90190 72938
- **Email**: rightstrikemartialartsclub@gmail.com
- **Location**: Bangalore, Karnataka
- **Contact Person**: Neeraj (Founder & Coach)
