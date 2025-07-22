# ClassSnap Attendance Hub
## Complete System Documentation

---

**Project:** ClassSnap Attendance Hub  
**Version:** 1.0  
**Date:** January 2025  
**Author:** Development Team  

---

## Table of Contents

**Chapter 1: Introduction and Overview** ......................................................... 3  
**Chapter 2: Getting Started** ........................................................................ 7  
**Chapter 3: User Guide - Core Features** ....................................................... 10  
**Chapter 4: Advanced Features** ................................................................... 17  
**Chapter 5: Technical Documentation** .......................................................... 23  

---

# Chapter 1: Introduction and Overview

## 1.1 Project Overview

ClassSnap Attendance Hub is a comprehensive class attendance management system designed specifically for educational institutions. The system provides a modern, efficient solution for tracking student attendance using QR code technology, real-time notifications, and comprehensive analytics.

### Purpose
The primary purpose of ClassSnap Attendance Hub is to streamline the attendance tracking process in educational environments, eliminating traditional paper-based systems and reducing administrative overhead while providing accurate, real-time attendance data.

### Target Users
- **Instructors:** Primary users who create classes, manage students, and track attendance
- **Students:** Secondary users who mark their attendance via QR codes
- **Administrators:** System administrators who oversee the overall platform

### Key Benefits
- **Efficiency:** Rapid attendance marking through QR code scanning
- **Accuracy:** Real-time digital tracking eliminates human error
- **Analytics:** Comprehensive reporting and trend analysis
- **Communication:** Automated notifications for students and instructors
- **Accessibility:** Web-based platform accessible from any device

## 1.2 System Features

### Core Functionality
- **User Authentication & Profile Management**
  - Secure login/logout system
  - User profile customization
  - Password management
  - Security settings

- **Class Creation & Management**
  - Easy class setup wizard
  - Class information management
  - Room assignment and scheduling
  - Class archiving and deletion

- **Student Enrollment System**
  - Individual student registration
  - Bulk student import via CSV
  - Student profile management
  - Enrollment status tracking

- **QR Code-Based Attendance Tracking**
  - Dynamic QR code generation
  - Real-time attendance marking
  - Mobile-friendly scanning interface
  - Attendance verification system

### Advanced Features
- **Real-time Notifications**
  - In-app notification system
  - Email notifications via Resend
  - Class reminders
  - Attendance alerts

- **Analytics & Reporting Dashboard**
  - Visual attendance charts
  - Trend analysis
  - Performance metrics
  - Exportable reports

- **Schedule Management**
  - Recurring class schedules
  - Calendar integration
  - Schedule conflict detection
  - Holiday and exception handling

- **Settings & Preferences**
  - Notification preferences
  - Profile customization
  - Data export options
  - Security settings

## 1.3 Technology Stack

### Frontend Technologies
- **React 18:** Modern JavaScript library for building user interfaces
- **TypeScript:** Type-safe JavaScript for better development experience
- **Tailwind CSS:** Utility-first CSS framework for rapid UI development
- **Vite:** Fast build tool and development server

### Backend Technologies
- **Supabase:** Complete backend-as-a-service platform
- **PostgreSQL:** Robust relational database management system
- **Edge Functions:** Serverless functions for business logic
- **Row Level Security (RLS):** Database-level security policies

### UI Components & Libraries
- **Shadcn/ui:** High-quality, accessible React components
- **Radix UI:** Low-level UI primitives for design systems
- **Lucide React:** Beautiful, customizable icons
- **React Query:** Powerful data synchronization for React

### Additional Services
- **Resend:** Modern email delivery service for notifications
- **QR Code Generation:** Dynamic QR code creation for attendance
- **Real-time Subscriptions:** Live data updates using Supabase Realtime

## 1.4 System Requirements

### Minimum Requirements
- **Operating System:** Windows 10, macOS 10.14, or Linux Ubuntu 18.04
- **Browser:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Internet Connection:** Broadband connection (5 Mbps minimum)
- **Screen Resolution:** 1024x768 minimum (responsive design supports all sizes)

### Recommended Requirements
- **Browser:** Latest version of Chrome, Firefox, or Safari
- **Internet Connection:** High-speed broadband (25 Mbps or higher)
- **Screen Resolution:** 1920x1080 or higher
- **Device:** Desktop computer or tablet for optimal experience

---

# Chapter 2: Getting Started

## 2.1 Accessing the System

### Initial Access
1. **Navigate to the Application**
   - Open your web browser
   - Enter the ClassSnap URL provided by your administrator
   - Ensure you have a stable internet connection

2. **System Compatibility Check**
   - Verify your browser is supported
   - Enable JavaScript if disabled
   - Clear browser cache if experiencing issues

## 2.2 Account Creation and Setup

### Registration Process
1. **Account Registration**
   - Click the "Sign Up" button on the homepage
   - Enter a valid email address
   - Create a strong password (minimum 8 characters)
   - Confirm your password
   - Click "Create Account"

2. **Email Verification (if enabled)**
   - Check your email inbox for verification message
   - Click the verification link
   - Return to the login page

3. **Initial Login**
   - Enter your registered email and password
   - Click "Sign In"
   - You will be redirected to the dashboard

### Profile Setup
1. **Complete Your Profile**
   - Navigate to Settings > Profile
   - Enter your full name
   - Add your department/institution
   - Provide a contact phone number
   - Save your changes

2. **Configure Preferences**
   - Set notification preferences
   - Choose your preferred time zone
   - Configure email notification settings
   - Set security preferences

## 2.3 Dashboard Overview

### Dashboard Components
1. **Header Section**
   - Personal greeting with current date/time
   - Quick statistics overview
   - Notification bell icon
   - User menu dropdown

2. **Statistics Cards**
   - Total Classes: Number of active classes
   - Total Students: Across all classes
   - Attendance Rate: Overall percentage
   - Recent Activity: Latest attendance records

3. **Quick Actions**
   - Create New Class button
   - View Reports link
   - Access Settings
   - Help and Documentation

4. **Recent Classes**
   - List of recently accessed classes
   - Quick attendance marking
   - Class management shortcuts
   - Schedule overview

### Navigation Menu
- **Dashboard:** Main overview page
- **Classes:** Class management section
- **Reports:** Analytics and reporting
- **Settings:** User preferences and configuration
- **Notifications:** Message center

## 2.4 Getting Help

### Support Resources
1. **In-App Help**
   - Tooltips and help text throughout the interface
   - Contextual help buttons
   - FAQ section in settings

2. **Documentation**
   - Complete user manual (this document)
   - Quick start guides
   - Video tutorials (if available)

3. **Technical Support**
   - Contact information for technical issues
   - Bug reporting procedures
   - Feature request submission

---

# Chapter 3: User Guide - Core Features

## 3.1 Class Management

### Creating a New Class
1. **Access Class Creation**
   - Click "Create Class" from the dashboard
   - Or navigate to Classes > New Class

2. **Class Details Tab**
   - **Class Name:** Enter a descriptive name
   - **Description:** Add detailed information about the class
   - **Room Number:** Specify the classroom location
   - **Subject Area:** Select or enter the subject

3. **Schedule Configuration**
   - **Start Date:** When the class begins
   - **End Date:** When the class concludes
   - **Meeting Days:** Select days of the week
   - **Start Time:** Class start time
   - **End Time:** Class end time
   - **Time Zone:** Confirm correct time zone

4. **Student Enrollment**
   - **Manual Entry:** Add students individually
     - Student Name
     - Student ID
     - Email Address
   - **Bulk Import:** Upload CSV file with student data
     - Download template CSV
     - Fill in student information
     - Upload completed file
     - Verify imported data

### Managing Existing Classes
1. **Class List View**
   - View all created classes
   - Search and filter options
   - Sort by name, date, or status
   - Quick action buttons

2. **Class Details Page**
   - **Overview Tab:** Basic class information
   - **Students Tab:** Enrolled student list
   - **Attendance Tab:** Attendance tracking
   - **Schedule Tab:** Class timing details
   - **Settings Tab:** Class configuration

3. **Editing Class Information**
   - Click "Edit" on any class detail
   - Modify information as needed
   - Save changes
   - Confirm updates

### Class Settings and Configuration
1. **General Settings**
   - Update class name and description
   - Modify room assignment
   - Change instructor information

2. **Attendance Policies**
   - Set attendance requirements
   - Configure late arrival policies
   - Define absence notification rules

3. **QR Code Settings**
   - Generate new QR codes
   - Set QR code expiration time
   - Configure scanning restrictions

## 3.2 Student Management

### Adding Students
1. **Individual Student Entry**
   - Navigate to Class > Students tab
   - Click "Add Student"
   - Enter student details:
     - Full Name
     - Student ID
     - Email Address
   - Save student information

2. **Bulk Student Import**
   - Download CSV template
   - Fill template with student data
   - Upload completed CSV file
   - Review and confirm import
   - Handle any duplicate entries

### Managing Student Information
1. **Student List Management**
   - View all enrolled students
   - Search by name or student ID
   - Filter by enrollment status
   - Sort alphabetically or by ID

2. **Editing Student Details**
   - Click on student name
   - Modify information as needed
   - Update contact details
   - Save changes

3. **Student Removal**
   - Select student to remove
   - Click "Remove Student"
   - Confirm removal action
   - Student data is archived, not deleted

### Student Communication
1. **Individual Notifications**
   - Send custom messages to students
   - Attendance reminders
   - Important announcements

2. **Bulk Communications**
   - Send messages to entire class
   - Attendance alerts
   - Schedule changes

## 3.3 Attendance Tracking

### QR Code System
1. **Generating QR Codes**
   - Navigate to Class > QR Code tab
   - Click "Generate QR Code"
   - QR code appears on screen
   - Code is automatically time-stamped

2. **Displaying QR Codes**
   - Show QR code on projector or screen
   - Ensure code is clearly visible
   - Monitor scanning activity
   - Refresh code if needed

3. **Student Scanning Process**
   - Students use mobile device camera
   - Scan the displayed QR code
   - Automatic attendance marking
   - Confirmation message appears

### Manual Attendance Entry
1. **Accessing Manual Entry**
   - Go to Class > Attendance tab
   - Click "Mark Attendance"
   - Select the date for attendance

2. **Marking Attendance**
   - Student list appears with checkboxes
   - Check present students
   - Leave unchecked for absent students
   - Add notes for late arrivals
   - Save attendance record

3. **Editing Attendance Records**
   - Select date to modify
   - Change attendance status
   - Add explanatory notes
   - Save modifications

### Attendance Monitoring
1. **Real-time Tracking**
   - Live view of students marking attendance
   - Running count of present/absent
   - Time stamps for each entry
   - Instant notifications for late arrivals

2. **Attendance History**
   - View attendance for specific dates
   - Search by student name
   - Filter by attendance status
   - Export attendance data

## 3.4 QR Code Features

### QR Code Generation
1. **Dynamic Code Creation**
   - Unique codes for each class session
   - Time-based expiration
   - Security features to prevent fraud
   - Automatic refresh capability

2. **Code Customization**
   - Set valid scanning window
   - Configure location restrictions
   - Add security parameters
   - Customize appearance

### Student Scanning Experience
1. **Scanning Process**
   - Open camera app or QR scanner
   - Point camera at displayed code
   - Automatic recognition and processing
   - Immediate confirmation message

2. **Verification System**
   - Student identity confirmation
   - Duplicate scan prevention
   - Location verification (if enabled)
   - Time stamp recording

### Troubleshooting QR Codes
1. **Common Issues**
   - Poor lighting conditions
   - Camera focus problems
   - Expired QR codes
   - Network connectivity issues

2. **Solutions**
   - Ensure adequate lighting
   - Clean camera lens
   - Generate fresh QR code
   - Check internet connection

---

# Chapter 4: Advanced Features

## 4.1 Scheduling System

### Class Schedule Setup
1. **Recurring Schedules**
   - Set up weekly recurring patterns
   - Configure multiple meeting times per week
   - Handle irregular schedules
   - Account for holidays and breaks

2. **Schedule Components**
   - **Day Selection:** Choose meeting days
   - **Time Slots:** Set start and end times
   - **Duration:** Automatic calculation
   - **Recurrence Pattern:** Weekly, bi-weekly, etc.

3. **Advanced Scheduling Options**
   - Exception dates (holidays, breaks)
   - Make-up class scheduling
   - Schedule conflict detection
   - Automatic schedule adjustments

### Schedule Management
1. **Viewing Schedules**
   - Calendar view for all classes
   - List view with time details
   - Filter by date range
   - Search specific classes

2. **Modifying Schedules**
   - Edit individual class times
   - Update recurring patterns
   - Handle schedule conflicts
   - Notify affected students

3. **Schedule Integration**
   - Export to calendar applications
   - Import external schedules
   - Sync with institutional calendars
   - Share schedules with students

## 4.2 Notification System

### In-App Notifications
1. **Notification Types**
   - **Class Reminders:** 30 minutes before class
   - **Attendance Alerts:** Low attendance warnings
   - **System Updates:** Important announcements
   - **Schedule Changes:** Class time modifications

2. **Notification Management**
   - Mark notifications as read/unread
   - Delete individual notifications
   - Mark all as read function
   - Notification history

3. **Notification Center**
   - Access via bell icon
   - Chronological listing
   - Quick action buttons
   - Link to related content

### Email Notifications
1. **Email Types**
   - Class reminder emails
   - Weekly attendance reports
   - Student absence alerts
   - System maintenance notices

2. **Email Configuration**
   - Enable/disable email notifications
   - Set notification frequency
   - Choose notification types
   - Update email preferences

3. **Email Templates**
   - Professional formatting
   - Personalized content
   - Institutional branding
   - Mobile-friendly design

### Notification Preferences
1. **User Settings**
   - Choose notification methods
   - Set quiet hours
   - Configure urgency levels
   - Manage notification frequency

2. **Class-Specific Settings**
   - Override global settings per class
   - Student-specific notifications
   - Attendance threshold alerts
   - Custom reminder timing

## 4.3 Reporting and Analytics

### Attendance Reports
1. **Individual Student Reports**
   - Personal attendance history
   - Attendance percentage calculation
   - Trend analysis over time
   - Detailed absence records

2. **Class-Wide Reports**
   - Overall class attendance rates
   - Daily attendance summaries
   - Weekly/monthly overviews
   - Comparative analysis between classes

3. **Custom Report Generation**
   - Select date ranges
   - Choose specific students
   - Filter by attendance status
   - Include/exclude specific data points

### Visual Analytics
1. **Charts and Graphs**
   - Line charts for attendance trends
   - Bar charts for comparative data
   - Pie charts for status distribution
   - Heat maps for pattern recognition

2. **Dashboard Analytics**
   - Real-time attendance metrics
   - Key performance indicators
   - Quick statistical summaries
   - Visual trend indicators

### Data Export Options
1. **Export Formats**
   - PDF reports for printing
   - Excel spreadsheets for analysis
   - CSV files for data processing
   - JSON format for integration

2. **Export Configuration**
   - Select data fields to include
   - Choose date ranges
   - Apply filters before export
   - Schedule automatic exports

## 4.4 Settings and Configuration

### Profile Management
1. **Personal Information**
   - Update name and contact details
   - Change email address
   - Modify phone number
   - Update department information

2. **Security Settings**
   - Change password
   - Enable two-factor authentication
   - Review login history
   - Manage active sessions

3. **Privacy Controls**
   - Data sharing preferences
   - Communication settings
   - Visibility options
   - Account deactivation

### System Preferences
1. **Interface Customization**
   - Theme selection (light/dark)
   - Language preferences
   - Time zone settings
   - Date format options

2. **Notification Preferences**
   - Email notification settings
   - In-app notification configuration
   - Reminder timing
   - Alert thresholds

### Data Management
1. **Data Export**
   - Export all personal data
   - Download attendance records
   - Archive class information
   - Backup user settings

2. **Data Import**
   - Import student lists
   - Restore backed up data
   - Merge duplicate records
   - Validate imported information

3. **Data Retention**
   - Automatic data archiving
   - Manual data deletion
   - Compliance with regulations
   - Data recovery options

---

# Chapter 5: Technical Documentation

## 5.1 System Architecture

### Frontend Architecture
The ClassSnap Attendance Hub utilizes a modern React-based frontend architecture designed for performance, maintainability, and user experience.

#### Component Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   ├── class/          # Class-specific components
│   ├── settings/       # Settings-related components
│   └── qr-code/        # QR code functionality
├── pages/              # Main page components
├── hooks/              # Custom React hooks
├── contexts/           # React context providers
├── lib/                # Utility functions
└── integrations/       # External service integrations
```

#### State Management
- **React Query:** Server state management and caching
- **React Context:** Global application state
- **Local State:** Component-specific state management
- **Form Management:** React Hook Form with Zod validation

#### Routing Architecture
- **React Router:** Client-side routing
- **Protected Routes:** Authentication-based route protection
- **Dynamic Routes:** Parameter-based navigation
- **Route Guards:** Authorization checks

### Backend Architecture
The backend leverages Supabase as a complete Backend-as-a-Service solution, providing database, authentication, real-time features, and serverless functions.

#### Database Design
```sql
-- Core Tables Structure
profiles (
    id uuid PRIMARY KEY,
    email text NOT NULL,
    full_name text,
    department text,
    phone text,
    created_at timestamp,
    updated_at timestamp
)

classes (
    id uuid PRIMARY KEY,
    instructor_id uuid REFERENCES profiles(id),
    name text NOT NULL,
    description text,
    room text,
    created_at timestamp,
    updated_at timestamp
)

students (
    id uuid PRIMARY KEY,
    class_id uuid REFERENCES classes(id),
    name text NOT NULL,
    email text NOT NULL,
    student_id text NOT NULL,
    created_at timestamp,
    updated_at timestamp
)

attendance_records (
    id uuid PRIMARY KEY,
    student_id uuid REFERENCES students(id),
    class_id uuid REFERENCES classes(id),
    date date NOT NULL,
    status text DEFAULT 'present',
    marked_at timestamp DEFAULT now(),
    marked_by uuid REFERENCES profiles(id)
)

class_schedules (
    id uuid PRIMARY KEY,
    class_id uuid REFERENCES classes(id),
    day_of_week integer NOT NULL,
    start_time time NOT NULL,
    end_time time NOT NULL,
    start_date date,
    end_date date,
    created_at timestamp,
    updated_at timestamp
)

notifications (
    id uuid PRIMARY KEY,
    user_id uuid NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type text NOT NULL,
    class_id uuid REFERENCES classes(id),
    student_id uuid REFERENCES students(id),
    is_read boolean DEFAULT false,
    metadata jsonb,
    created_at timestamp,
    updated_at timestamp
)

student_notifications (
    id uuid PRIMARY KEY,
    student_id uuid REFERENCES students(id),
    class_id uuid REFERENCES classes(id),
    title text NOT NULL,
    message text NOT NULL,
    type text NOT NULL,
    email_sent boolean DEFAULT false,
    email_sent_at timestamp,
    metadata jsonb DEFAULT '{}',
    created_at timestamp,
    updated_at timestamp
)
```

### Security Implementation

#### Row Level Security (RLS) Policies
```sql
-- Example RLS Policies

-- Instructors can only access their own classes
CREATE POLICY "Instructors can manage their own classes" 
ON classes FOR ALL 
USING (instructor_id = auth.uid());

-- Students can view basic class info for attendance
CREATE POLICY "Public can view basic class info for attendance" 
ON classes FOR SELECT 
USING (true);

-- Instructors can manage students in their classes
CREATE POLICY "Instructors can manage students in their classes" 
ON students FOR ALL 
USING (class_id IN (
    SELECT id FROM classes WHERE instructor_id = auth.uid()
));

-- Users can only view their own notifications
CREATE POLICY "Users can view their own notifications" 
ON notifications FOR SELECT 
USING (auth.uid() = user_id);
```

#### Authentication Security
- **Supabase Auth:** JWT-based authentication
- **Session Management:** Secure session handling
- **Password Security:** bcrypt hashing
- **Email Verification:** Optional email confirmation
- **Rate Limiting:** Protection against brute force attacks

## 5.2 API Documentation

### Edge Functions
The system utilizes Supabase Edge Functions for serverless backend processing.

#### send-class-notifications Function
```typescript
// Function: send-class-notifications
// Purpose: Handle email notifications for students and instructors
// Trigger: Manual or scheduled execution

Input Parameters:
- type: 'reminder' | 'attendance_alert' | 'announcement'
- class_id: string (optional)
- message: string (optional)

Response Format:
{
  success: boolean,
  message: string,
  data: {
    notifications_sent: number,
    emails_sent: number,
    errors: array
  }
}
```

#### process-class-reminders Function
```typescript
// Function: process-class-reminders
// Purpose: Generate automatic class reminder notifications
// Trigger: Scheduled execution (cron job)

Input Parameters: None

Response Format:
{
  success: boolean,
  reminders_created: number,
  classes_processed: number
}
```

### Database Functions
```sql
-- Function: create_class_reminder_notifications()
-- Purpose: Create reminder notifications for upcoming classes
-- Returns: void
-- Security: SECURITY DEFINER

-- Function: create_attendance_notification()
-- Purpose: Trigger function for attendance-related notifications
-- Returns: trigger
-- Security: SECURITY DEFINER

-- Function: update_updated_at_column()
-- Purpose: Automatically update the updated_at timestamp
-- Returns: trigger
-- Security: Standard
```

## 5.3 Integration Guide

### Email Service Integration (Resend)
```typescript
// Email Configuration
const resend = new Resend(process.env.RESEND_API_KEY);

// Send Email Function
async function sendNotificationEmail(
  to: string,
  subject: string,
  htmlContent: string
) {
  try {
    const result = await resend.emails.send({
      from: 'ClassSnap <notifications@classsnap.com>',
      to: [to],
      subject: subject,
      html: htmlContent
    });
    return { success: true, messageId: result.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### Real-time Subscriptions
```typescript
// Real-time Notification Subscription
useEffect(() => {
  const channel = supabase
    .channel('notifications-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      },
      (payload) => {
        // Handle new notification
        const newNotification = payload.new;
        showToast(newNotification.title, newNotification.message);
        refreshNotifications();
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [user]);
```

## 5.4 Deployment and Maintenance

### Environment Configuration
```env
# Required Environment Variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Supabase Secrets (Edge Functions)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=your-resend-api-key
```

### Deployment Process
1. **Frontend Deployment**
   - Build the React application: `npm run build`
   - Deploy to hosting platform (Vercel, Netlify, etc.)
   - Configure custom domain if needed
   - Set up SSL certificate

2. **Backend Configuration**
   - Supabase project setup
   - Database migration execution
   - Edge function deployment
   - Environment variable configuration

### Monitoring and Maintenance
1. **Performance Monitoring**
   - Application performance metrics
   - Database query performance
   - Edge function execution times
   - User experience monitoring

2. **Error Tracking**
   - Frontend error logging
   - Backend error monitoring
   - Email delivery tracking
   - System health checks

3. **Backup and Recovery**
   - Automatic database backups
   - Configuration backup
   - Data export procedures
   - Disaster recovery testing

### Scaling Considerations
1. **Database Scaling**
   - Connection pooling
   - Read replicas for analytics
   - Query optimization
   - Index management

2. **Application Scaling**
   - CDN implementation
   - Caching strategies
   - Load balancing
   - Performance optimization

---

## Appendices

### Appendix A: Troubleshooting Guide

#### Common Issues and Solutions

**Issue: Login Problems**
- Verify email and password
- Check internet connection
- Clear browser cache and cookies
- Try incognito/private browsing mode

**Issue: QR Code Not Scanning**
- Ensure adequate lighting
- Clean camera lens
- Check QR code hasn't expired
- Try different QR scanner app

**Issue: Notifications Not Working**
- Check notification preferences
- Verify email address is correct
- Check spam/junk folder
- Ensure browser notifications are enabled

**Issue: Attendance Data Not Saving**
- Check internet connection
- Refresh the page
- Try marking attendance again
- Contact technical support if persistent

### Appendix B: Frequently Asked Questions

**Q: How long are QR codes valid?**
A: QR codes are typically valid for 30 minutes from generation to ensure security.

**Q: Can I export attendance data?**
A: Yes, attendance data can be exported in multiple formats including PDF, Excel, and CSV.

**Q: How do I add multiple students at once?**
A: Use the bulk import feature with a CSV file. Download the template first.

**Q: Can students mark attendance from any location?**
A: This depends on your institution's settings. Location restrictions may be enabled.

**Q: What happens if I forget my password?**
A: Use the "Forgot Password" link on the login page to reset your password via email.

### Appendix C: System Specifications

#### Minimum System Requirements
- **Processor:** Intel Core i3 or equivalent
- **Memory:** 4GB RAM
- **Storage:** 1GB available space
- **Network:** Broadband internet connection
- **Browser:** Modern web browser with JavaScript enabled

#### Recommended System Requirements
- **Processor:** Intel Core i5 or equivalent
- **Memory:** 8GB RAM
- **Storage:** 2GB available space
- **Network:** High-speed broadband connection
- **Browser:** Latest version of Chrome, Firefox, or Safari

#### Browser Compatibility
- **Chrome:** Version 90 and above
- **Firefox:** Version 88 and above
- **Safari:** Version 14 and above
- **Edge:** Version 90 and above
- **Mobile Browsers:** iOS Safari 14+, Android Chrome 90+

---

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Next Review Date:** July 2025  

**Contact Information:**  
Technical Support: support@classsnap.com  
Documentation: docs@classsnap.com  
General Inquiries: info@classsnap.com