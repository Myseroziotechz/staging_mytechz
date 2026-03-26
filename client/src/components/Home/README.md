# Home Components Library

Professional, reusable React components for the MytechZ job portal homepage.

## 📦 Components

### 1. SectionTitle
Display section headings with optional subtitles.

**Props:**
- `title` (string, required) - Main section title
- `subtitle` (string, optional) - Subtitle text
- `align` (string, optional) - Text alignment: 'center' | 'left' (default: 'center')

**Usage:**
```jsx
import { SectionTitle } from './components/Home';

<SectionTitle 
  title="Why Choose MytechZ?" 
  subtitle="Your complete career companion"
  align="center"
/>
```

---

### 2. StatsCard
Display statistics with icon, number, and label.

**Props:**
- `icon` (string, required) - RemixIcon class name (e.g., 'ri-briefcase-line')
- `number` (string/number, required) - Statistic number
- `label` (string, required) - Description label
- `color` (string, optional) - Color variant: 'primary' | 'success' | 'warning' | 'info' (default: 'primary')

**Usage:**
```jsx
import { StatsCard } from './components/Home';

<StatsCard 
  icon="ri-briefcase-line"
  number="10,000+"
  label="Active Jobs"
  color="primary"
/>
```

---

### 3. SearchBar
Searchbar with autocomplete suggestions.

**Props:**
- `placeholder` (string, optional) - Input placeholder text
- `suggestions` (array, optional) - Array of suggestion objects
- `onSearch` (function, optional) - Callback when search value changes
- `onSuggestionClick` (function, optional) - Callback when suggestion is clicked

**Suggestion Object:**
```javascript
{
  title: "Government Jobs",
  description: "Browse all government job openings",
  type: "page", // or "job"
  url: "/jobs/government"
}
```

**Usage:**
```jsx
import { SearchBar } from './components/Home';

const suggestions = [
  { title: "Software Developer", type: "job", url: "/jobs/1" }
];

<SearchBar 
  placeholder="Search for jobs..."
  suggestions={suggestions}
  onSearch={(value) => console.log(value)}
  onSuggestionClick={(suggestion) => window.location.href = suggestion.url}
/>
```

---

### 4. FeatureCard
Display feature with icon, title, and description.

**Props:**
- `icon` (string/element, required) - RemixIcon class or React element
- `title` (string, required) - Feature title
- `description` (string, required) - Feature description
- `onClick` (function, optional) - Click handler
- `className` (string, optional) - Additional CSS classes

**Usage:**
```jsx
import { FeatureCard } from './components/Home';

<FeatureCard 
  icon="ri-shield-check-line"
  title="Verified Opportunities"
  description="Every job listing is verified to ensure authenticity"
  onClick={() => console.log('Clicked')}
/>
```

---

### 5. SkillCard
Display trending skills with demand indicator.

**Props:**
- `icon` (string/element, required) - Emoji or icon
- `title` (string, required) - Skill name
- `demand` (string, required) - Demand level: 'High Demand' | 'Growing' | 'Low'
- `jobCount` (string, required) - Number of jobs (e.g., '2,500+ Jobs')
- `onClick` (function, optional) - Click handler

**Usage:**
```jsx
import { SkillCard } from './components/Home';

<SkillCard 
  icon="💻"
  title="Full Stack Development"
  demand="High Demand"
  jobCount="2,500+ Jobs"
  onClick={() => console.log('Skill clicked')}
/>
```

---

### 6. TestimonialCard
Display user testimonials with stats.

**Props:**
- `name` (string, required) - User name
- `role` (string, required) - User role/position
- `company` (string, optional) - Company name
- `quote` (string, required) - Testimonial text
- `avatar` (element, optional) - Custom avatar element
- `stats` (array, optional) - Array of stat objects

**Stat Object:**
```javascript
{
  icon: "ri-briefcase-line",
  text: "Applied: 12 jobs"
}
```

**Usage:**
```jsx
import { TestimonialCard } from './components/Home';

const stats = [
  { icon: "ri-briefcase-line", text: "Applied: 12 jobs" },
  { icon: "ri-check-circle-line", text: "Hired in 14 days" }
];

<TestimonialCard 
  name="Priya Sharma"
  role="Software Engineer"
  company="TCS"
  quote="I found my dream job within 2 weeks!"
  stats={stats}
/>
```

---

### 7. ResourceCard
Display career resources with metadata.

**Props:**
- `icon` (string, required) - RemixIcon class name
- `title` (string, required) - Resource title
- `description` (string, required) - Resource description
- `meta` (array, optional) - Array of metadata objects
- `badge` (string, optional) - Badge text: 'Free' | 'Premium'
- `onClick` (function, optional) - Click handler

**Meta Object:**
```javascript
{
  icon: "ri-calendar-line",
  text: "Weekly Sessions"
}
```

**Usage:**
```jsx
import { ResourceCard } from './components/Home';

const meta = [
  { icon: "ri-calendar-line", text: "Weekly Sessions" }
];

<ResourceCard 
  icon="ri-live-line"
  title="Live Webinars"
  description="Join expert-led sessions"
  meta={meta}
  badge="Free"
  onClick={() => window.location.href = '/webinars'}
/>
```

---

### 8. CTAButton
Call-to-action button with variants.

**Props:**
- `children` (string/element, required) - Button text
- `icon` (string, optional) - RemixIcon class name
- `onClick` (function, optional) - Click handler
- `variant` (string, optional) - Style variant: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' (default: 'primary')
- `size` (string, optional) - Button size: 'small' | 'medium' | 'large' (default: 'medium')
- `fullWidth` (boolean, optional) - Full width button (default: false)
- `className` (string, optional) - Additional CSS classes

**Usage:**
```jsx
import { CTAButton } from './components/Home';

<CTAButton 
  icon="ri-rocket-line"
  variant="primary"
  size="large"
  onClick={() => console.log('Clicked')}
>
  Get Started
</CTAButton>
```

---

## 🎨 Design System

### Colors
- **Primary**: #6366f1 (Indigo)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Orange)
- **Info**: #3b82f6 (Blue)

### Typography
- **Section Titles**: 2.5rem, font-weight 800
- **Card Titles**: 1.1rem - 1.3rem, font-weight 700
- **Body Text**: 0.95rem - 1rem, line-height 1.6

### Spacing
- **Card Padding**: 2rem - 2.5rem
- **Grid Gap**: 1.5rem - 2rem
- **Icon Size**: 60px - 70px

### Animations
- **Hover Transform**: translateY(-4px to -8px)
- **Transition**: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- **Shadow**: 0 12px 32px rgba(99, 102, 241, 0.15)

---

## 🌙 Dark Mode Support

All components have full dark mode support using CSS variables:
- `var(--bg-page)` - Page background
- `var(--bg-surface)` - Card background
- `var(--bg-elevated)` - Elevated elements
- `var(--text-main)` - Main text color
- `var(--text-muted)` - Muted text color
- `var(--border-subtle)` - Border color

---

## 📱 Responsive Design

All components are fully responsive with breakpoints:
- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px
- **Small Mobile**: < 480px

---

## 🚀 Quick Start

1. Import components:
```jsx
import { 
  SectionTitle, 
  StatsCard, 
  SearchBar,
  FeatureCard,
  SkillCard,
  TestimonialCard,
  ResourceCard,
  CTAButton
} from './components/Home';
```

2. Use in your JSX:
```jsx
<SectionTitle title="Welcome" subtitle="Get started today" />
<StatsCard icon="ri-briefcase-line" number="10K+" label="Jobs" />
<CTAButton variant="primary" size="large">Apply Now</CTAButton>
```

---

## 📝 Best Practices

1. **Consistent Spacing**: Use the same gap values across grids
2. **Icon Library**: Use RemixIcon for consistency
3. **Color Variants**: Stick to the defined color palette
4. **Accessibility**: Ensure proper contrast ratios
5. **Performance**: Use React.memo for frequently re-rendered components
6. **Dark Mode**: Test all components in both light and dark modes

---

## 🔧 Customization

Each component accepts a `className` prop for additional styling:

```jsx
<FeatureCard 
  className="custom-feature-card"
  icon="ri-star-line"
  title="Custom Feature"
  description="With custom styling"
/>
```

Then add custom CSS:
```css
.custom-feature-card {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
}
```

---

## 📦 Component Dependencies

- React 18+
- RemixIcon (for icons)
- CSS Variables (for theming)

---

## 🎯 Component Status

| Component | Status | Dark Mode | Responsive | Tested |
|-----------|--------|-----------|------------|--------|
| SectionTitle | ✅ Ready | ✅ Yes | ✅ Yes | ✅ Yes |
| StatsCard | ✅ Ready | ✅ Yes | ✅ Yes | ✅ Yes |
| SearchBar | ✅ Ready | ✅ Yes | ✅ Yes | ✅ Yes |
| FeatureCard | ✅ Ready | ✅ Yes | ✅ Yes | ✅ Yes |
| SkillCard | ✅ Ready | ✅ Yes | ✅ Yes | ✅ Yes |
| TestimonialCard | ✅ Ready | ✅ Yes | ✅ Yes | ✅ Yes |
| ResourceCard | ✅ Ready | ✅ Yes | ✅ Yes | ✅ Yes |
| CTAButton | ✅ Ready | ✅ Yes | ✅ Yes | ✅ Yes |

---

**Created**: March 24, 2026  
**Version**: 1.0.0  
**License**: MIT
