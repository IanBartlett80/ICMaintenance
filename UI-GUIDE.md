# IC Maintenance - User Interface Guide

## Application Flow

### Public Access (Not Authenticated)

#### 1. Landing Page (`/`)
**Purpose**: First impression and conversion point

**Sections**:
- **Hero Section**
  - Large headline: "Streamline Your Maintenance Management"
  - Subheadline: Value proposition
  - Two CTA buttons: "Get Started" (primary) and "Sign In"
  - Gradient background (blue to purple)

- **Services Grid** (4 cards)
  - 📋 Request Management
  - 💰 Quote Comparison  
  - 📊 Job Tracking
  - 📈 Reporting & Analytics

- **Why Choose Us** (4 benefits)
  - Simplified Process
  - Cost Savings
  - Quality Assurance
  - Real-time Updates

- **Organization Types** (3 columns)
  - 🏘️ Residential Organizations
  - 🏢 Property Management
  - ⚽ Sporting Organizations

- **FAQ Section** (6 questions)
  - What is IC Maintenance?
  - Who can use this platform?
  - How do I get started?
  - etc.

- **Footer**
  - Product, Company, Support links
  - Copyright information

**Navigation Actions**:
- Click "Get Started" → `/register`
- Click "Sign In" → `/login`
- Click "Register" link → `/register`

---

#### 2. Registration Page (`/register`)
**Purpose**: Organization onboarding with admin account creation

**Step 1 - Organization Information**:
- Organization Name (required)
- Organization Type dropdown (required)
  - Residential Complex
  - Property Management Company
  - Sporting Organization
  - Educational Institution
  - Healthcare Facility
  - Other
- Progress: 1/3

**Step 2 - Location Details**:
- Street Address (required)
- City (required)
- State/Province (required)
- ZIP/Postal Code (required)
- Country dropdown (required)
- Progress: 2/3

**Step 3 - Admin Account**:
- First Name (required)
- Last Name (required)
- Email Address (required, validated)
- Password (required, min 8 chars)
- Confirm Password (required, must match)
- Phone Number (optional)
- Progress: 3/3

**Success Screen**:
- ✅ Registration Successful
- Email sent to [email]
- Check your inbox message
- "Go to Login" button

**Features**:
- Progress bar showing current step
- Next/Back navigation
- Real-time validation
- Error messages per field
- Password strength requirements
- Mobile responsive

**Navigation Actions**:
- Click "Back" → Previous step or `/login`
- Click "Next" → Next step
- Click "Submit" → Complete registration → Success screen
- Click "Go to Login" → `/login`

---

#### 3. Login Page (`/login`)
**Purpose**: Authentication for existing users

**Form Fields**:
- Email Address (required)
- Password (required)
- "Remember me" checkbox

**Visual Design**:
- Gradient background (dark to darker neutral)
- White form card centered
- IC Maintenance logo/title
- Modern input fields with focus states

**Demo Credentials Display**:
```
Demo Account:
Email: customer@example.com
Password: customer123
```

**Links**:
- "Register your organization" → `/register`
- "Forgot password?" (not implemented)
- "Contact support" → Email link

**Navigation Actions**:
- Click "Sign In" → Authenticate → `/dashboard`
- Click "Register" → `/register`

---

### Authenticated Access (Logged In)

#### Navigation Bar (All Pages)
**Left**: IC Maintenance logo/brand
**Center**: 
- Dashboard
- My Jobs
- New Request
- Reports

**Right**:
- "Welcome, [FirstName]!"
- Logout button

---

#### 4. Dashboard (`/dashboard`)
**Purpose**: Overview of maintenance activities

**Header**:
- "Dashboard Overview" (h1)
- "Welcome back! Here's your maintenance summary." (subtitle)

**Statistics Cards** (3 cards with gradients):
1. **Total Jobs** - Purple gradient - Count
2. **Active Jobs** - Pink gradient - Count  
3. **Completed** - Blue gradient - Count

**Quick Actions** (2 large cards):
1. **Submit New Request**
   - Description: "Create a new maintenance request and attach photos"
   - Button: "New Request →"
   - Blue gradient background
   
2. **View Reports**
   - Description: "Access comprehensive maintenance reports and analytics"
   - Button: "View Reports →"
   - Orange gradient background

**Recent Maintenance Requests Table**:
- Header: "Recent Maintenance Requests" with "View All →" link
- Columns:
  - Job # (clickable link)
  - Title
  - Category (badge)
  - Priority (color-coded)
  - Status (badge)
  - Created (date)
- Shows 5 most recent jobs
- Empty state: "No maintenance requests yet" with friendly icon

**Empty State**:
- 📋 icon
- "No maintenance requests yet."
- "Create your first request to get started!"

**Navigation Actions**:
- Click "New Request" → `/jobs/new`
- Click "View Reports" → `/reports`
- Click "View All" → `/jobs`
- Click job number → `/jobs/:id`

---

#### 5. Jobs List Page (`/jobs`)
**Purpose**: Manage and view all maintenance requests

**Header**:
- "Maintenance Requests" (h1)
- "Manage and track all your maintenance jobs" (subtitle)
- "+ New Request" button (top right)

**Filter Bar**:
- **Status Filters** (pill buttons with counts):
  - All Requests (count badge)
  - New (count badge)
  - In Progress (count badge)
  - Completed (count badge)
- Active filter highlighted in blue

**Search Box**:
- "Search by job number, title, or category..."
- Real-time filtering
- Focus state with blue border

**Jobs Table**:
- **Columns**:
  - Job Number (clickable, bold, blue)
  - Title (with truncated description below)
  - Category (blue badge)
  - Priority (color-coded text)
  - Status (colored badge)
  - Quotes (green badge if >0, gray text if 0)
  - Created (date)
  - Actions ("View" button)

- **Features**:
  - Hover effect on rows
  - Responsive horizontal scroll
  - Sortable columns (future)

**Empty States**:
1. **No Jobs**:
   - 📋 icon
   - "No maintenance requests found"
   - "Create your first maintenance request to get started"
   - "Create First Request" button

2. **No Search Results**:
   - 📋 icon
   - "No maintenance requests found"
   - "Try adjusting your search criteria"

**Summary Footer**:
- "Showing X of Y maintenance requests"
- "Clear Search" button (if search active)

**Navigation Actions**:
- Click "+ New Request" → `/jobs/new`
- Click filter → Update list
- Type in search → Filter list
- Click job number → `/jobs/:id`
- Click "View" → `/jobs/:id`
- Click "Clear Search" → Reset search

---

#### 6. New Job Request Page (`/jobs/new`)
**Purpose**: Submit new maintenance request

**Header**:
- "← Back" link
- "New Maintenance Request" (h1)
- "Submit a new maintenance request with detailed information" (subtitle)

**Request Details Card**:
- **Title*** (text input)
  - Placeholder: "e.g., Leaking faucet in unit 201"
  - Min 5 characters
  - Error message if invalid

- **Description*** (textarea, 5 rows)
  - Placeholder: "Provide detailed information about the maintenance issue..."
  - Min 20 characters
  - Resizable vertically
  - Error message if invalid

- **Category*** (dropdown)
  - Options loaded from database
  - "Select a category" default option
  - Error message if not selected

- **Priority*** (dropdown)
  - Options: Critical, High, Normal, Low
  - Defaults to "Normal"
  - Error message if not selected

- **Location*** (text input)
  - Placeholder: "e.g., Building A, Unit 201, Kitchen"
  - Error message if invalid

**Attachments Card**:
- **Title**: "Attachments"
- **Description**: "Upload photos or documents related to this request (JPG, PNG, GIF, PDF - max 5MB each)"

- **File Input**:
  - 📎 "Choose Files" button
  - Dashed border, gray background
  - Hover effect
  - Multiple file selection
  - File type validation
  - File size validation (5MB max)

- **Selected Files List**:
  - Shows each file with:
    - Icon (🖼️ for images, 📄 for PDFs)
    - File name (truncated if long)
    - File size (formatted: 1.2 MB)
    - "Remove" button (red)
  - Count: "Selected Files (X)"

- **Error Messages**:
  - "Only JPG, PNG, GIF, and PDF files are allowed"
  - "Each file must be less than 5MB"

**Form Actions**:
- "Cancel" button (gray) → Go back
- "Submit Request" button (blue) → Create job
- "Submitting..." (disabled during upload)

**Error Display**:
- Red banner at bottom if submission fails
- Error message from API

**Navigation Actions**:
- Click "← Back" → Previous page
- Click "Cancel" → Previous page
- Click "Submit Request" → Create job → `/jobs/:id` with success message

---

#### 7. Job Detail Page (`/jobs/:id`) - [PENDING]
**Purpose**: View complete job information and take actions

**Planned Sections**:
- Job header with status and actions
- Job details and description
- Attached files gallery
- Quotes received list
- Activity timeline
- Comments section

---

#### 8. Quotes Page (`/quotes`) - [PENDING]
**Purpose**: View and manage quotes from trades

**Planned Features**:
- List of all quotes
- Filter by status (Pending, Approved, Rejected)
- Compare multiple quotes
- Approve/reject actions

---

#### 9. Quote Detail Page (`/quotes/:id`) - [PENDING]
**Purpose**: Review quote details and take action

**Planned Sections**:
- Quote summary
- Line items breakdown
- Trade specialist information
- Approval/rejection form

---

#### 10. Reports Page (`/reports`) - [PENDING]
**Purpose**: Analytics and insights

**Planned Features**:
- Key metrics dashboard
- Charts and visualizations
- Date range filters
- Export to PDF/Excel
- Custom report builder

---

## Color System

### Primary Colors
- **Primary Blue**: `#0066CC` - Main brand color
- **Primary Light**: `#0080FF` - Hover states
- **Primary Dark**: `#0052A3` - Active states

### Neutral Grays
- `--neutral-50`: #f9fafb (backgrounds)
- `--neutral-100`: #f3f4f6 (light backgrounds)
- `--neutral-200`: #e5e7eb (borders)
- `--neutral-300`: #d1d5db (disabled)
- `--neutral-400`: #9ca3af (placeholder)
- `--neutral-500`: #6b7280 (secondary text)
- `--neutral-600`: #4b5563 (body text)
- `--neutral-700`: #374151 (headings)
- `--neutral-800`: #1f2937 (dark elements)
- `--neutral-900`: #111827 (black text)

### Semantic Colors
- **Success**: #10B981 (green) - Completed, Low priority
- **Warning**: #F59E0B (yellow/orange) - Medium priority, pending
- **Error**: #DC2626 (red) - Critical, errors
- **Info**: #3B82F6 (blue) - Information

### Gradient Combinations
- Purple: `#667eea → #764ba2`
- Pink: `#f093fb → #f5576c`
- Blue: `#4facfe → #00f2fe`
- Primary: `#0066CC → #0052A3`
- Orange: `#FF6B35 → #F59E0B`
- Dark: `#1f2937 → #111827`

---

## Typography

### Font Sizes
- **3xl**: 30px - Page titles (h1)
- **2xl**: 24px - Section headers (h2)
- **xl**: 20px - Card titles (h3)
- **lg**: 18px - Large text
- **base**: 16px - Body text
- **sm**: 14px - Secondary text
- **xs**: 13px - Labels, captions
- **xxs**: 12px - Badges, footnotes

### Font Weights
- **Bold** (700): Headings, important numbers
- **Semibold** (600): Table headers, button text
- **Medium** (500): Navigation, labels
- **Regular** (400): Body text

---

## Component Specifications

### Buttons
- **Primary**: Blue background, white text, hover darker
- **Secondary**: Gray background, dark text, hover lighter
- **Padding**: 12px 24px
- **Border Radius**: 8px
- **Font Weight**: 600
- **Disabled**: Opacity 0.6, no pointer

### Cards
- **Background**: White
- **Padding**: 24px
- **Border Radius**: 12px
- **Shadow**: 0 1px 3px rgba(0,0,0,0.1)
- **Hover**: Subtle lift effect (optional)

### Badges
- **Padding**: 4px 12px
- **Border Radius**: 12px (pill shape)
- **Font Size**: 12px
- **Font Weight**: 600
- **Colors**: Match status/category

### Forms
- **Input Height**: 44px minimum
- **Padding**: 12px 16px
- **Border**: 2px solid gray-200
- **Border Radius**: 8px
- **Focus**: Blue border
- **Error**: Red border
- **Disabled**: Gray background

### Tables
- **Header Background**: Gray-50
- **Row Padding**: 12px
- **Border**: 1px solid gray-200 (bottom only)
- **Hover**: Gray-50 background
- **Text Alignment**: Left for text, center for icons/badges

### Stat Cards
- **Gradient Background**: Yes
- **Text Color**: White
- **Number Size**: 32px
- **Label Size**: 16px
- **Padding**: 24px
- **Border Radius**: 12px

---

## Responsive Breakpoints

### Desktop (1024px+)
- 3-column grids
- Side-by-side forms
- Full navigation bar
- Large cards

### Tablet (768px - 1023px)
- 2-column grids
- Stacked forms
- Collapsed navigation (future)
- Medium cards

### Mobile (< 768px)
- 1-column grids
- Fully stacked forms
- Hamburger menu (future)
- Full-width cards

---

## Accessibility Features

### Keyboard Navigation
- Tab through all interactive elements
- Enter to submit forms
- Escape to close modals
- Arrow keys in dropdowns

### Screen Readers
- Semantic HTML (headings, lists, tables)
- ARIA labels where needed
- Alt text for icons
- Form labels properly associated

### Visual
- High contrast colors (WCAG AA)
- Focus indicators visible
- Error messages clear
- Icons with text labels

---

## Loading States

### Page Load
- Fade-in animation (0.3s)
- Skeleton loaders (future)
- "Loading..." text

### API Calls
- Button shows "Loading..."
- Button disabled
- Optional spinner icon

### Empty States
- Friendly icon (emoji)
- Clear message
- Call-to-action button

---

## Error Handling

### Form Validation
- Real-time on blur
- Red border on input
- Error message below field
- Prevent submission

### API Errors
- Red banner at top
- Error message from server
- "Try again" option
- Contact support link

### Network Errors
- "Unable to connect" message
- Retry button
- Check connection prompt

---

## Success Feedback

### Form Submission
- Green checkmark icon
- Success message
- Redirect to relevant page
- Optional confetti (future)

### Inline Actions
- Toast notification (future)
- Green badge update
- Smooth transitions

---

## Animation Timing

### Transitions
- **Fast**: 0.15s - Hovers, focus states
- **Normal**: 0.3s - Color changes, transforms
- **Slow**: 0.5s - Page loads, large movements

### Easing
- **Ease-out**: Most transitions
- **Ease-in-out**: Complex animations
- **Linear**: Progress bars

---

## File Upload Guidelines

### Accepted Types
- **Images**: JPG, JPEG, PNG, GIF
- **Documents**: PDF

### Size Limits
- **Per File**: 5MB
- **Total**: No limit (but consider UX)

### Validation
- Check file type
- Check file size
- Show clear errors
- Allow removal before upload

### Display
- Show file name
- Show file size
- Show icon based on type
- Show progress (future)

---

## Best Practices

### Performance
- Lazy load images
- Debounce search inputs
- Minimize re-renders
- Cache API responses

### Security
- Validate on client and server
- Sanitize inputs
- Use HTTPS in production
- Secure token storage

### UX
- Clear CTAs
- Helpful error messages
- Consistent patterns
- Progressive disclosure

### Code Quality
- Component reusability
- Centralized API calls
- Consistent naming
- Proper error handling

---

## Future Enhancements

### Phase 2
- Real-time notifications
- WebSocket integration
- Advanced filtering
- Bulk actions

### Phase 3
- Mobile app
- Offline support
- Push notifications
- Chat functionality

### Phase 4
- Advanced analytics
- Predictive maintenance
- AI-powered insights
- Integration marketplace

---

## Testing Checklist

### Manual Testing
- ✅ Landing page loads
- ✅ Registration flow works
- ✅ Login authenticates
- ✅ Dashboard shows stats
- ✅ Jobs list filters/searches
- ✅ New job form validates
- ✅ Files upload correctly
- ✅ Logout clears session
- ✅ Routes protect properly
- ✅ Mobile responsive

### Browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Device Testing
- Desktop (1920x1080)
- Laptop (1366x768)
- Tablet (768x1024)
- Mobile (375x667)

---

This guide serves as the reference for the IC Maintenance customer portal UI/UX. All new features should follow these patterns for consistency.
