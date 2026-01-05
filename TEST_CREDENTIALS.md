# NRCC System - Test Credentials

## Mock Login Credentials

Use these credentials to test the authentication system with different user roles.

### Applicants

**Individual Applicant:**
- Email: `applicant@test.com`
- Password: `password`
- Role: Applicant
- Organization: Independent Applicant

**Member of Parliament:**
- Email: `mp@parliament.go.tz`
- Password: `password`
- Role: Applicant
- Organization: Member of Parliament - Dar es Salaam

### Reviewers

**District Reviewer:**
- Email: `district@roadsfund.go.tz`
- Password: `password`
- Role: District Reviewer
- Organization: Kinondoni District Council
- Region: Dar es Salaam
- District: Kinondoni

**Regional Reviewer:**
- Email: `regional@roadsfund.go.tz`
- Password: `password`
- Role: Regional Reviewer
- Organization: Dar es Salaam Regional Roads Board
- Region: Dar es Salaam

**National Reviewer:**
- Email: `national@roadsfund.go.tz`
- Password: `password`
- Role: National Reviewer
- Organization: Roads Fund Board - National Office

**NRCC Member:**
- Email: `nrcc@roadsfund.go.tz`
- Password: `password`
- Role: NRCC Member
- Organization: National Road Classification Committee

**System Administrator:**
- Email: `admin@roadsfund.go.tz`
- Password: `admin123`
- Role: Administrator
- Organization: Roads Fund Board

## Testing Instructions

1. **Testing Applicant Login:**
   - Open the application
   - Click "Sign In" button
   - Select "Applicant" user type
   - Enter applicant credentials
   - Should redirect to `/applicant/dashboard`

2. **Testing Reviewer Login:**
   - Open the application
   - Click "Sign In" button
   - Select "Reviewer / Official" user type
   - Enter reviewer credentials
   - Should redirect to appropriate dashboard based on role:
     - District: `/reviewer/district/dashboard`
     - Regional: `/reviewer/regional/dashboard`
     - National: `/reviewer/national/dashboard`
     - NRCC: `/nrcc/dashboard`
     - Admin: `/admin/dashboard`

3. **Testing Role-Based Access:**
   - Try accessing a route that doesn't match your role
   - Should be redirected to your appropriate dashboard

4. **Testing Authentication Guard:**
   - Try accessing `/applicant/dashboard` without logging in
   - Should be redirected to home page `/`

## Features Implemented

✅ Mock authentication service with 7 test users
✅ User type selection (Applicant vs Reviewer)
✅ Role-based authentication (6 different roles)
✅ Route guards for protected routes
✅ Automatic redirection to appropriate dashboard
✅ Persistent login (using localStorage)
✅ Logout functionality
✅ Applicant dashboard with stats and quick actions
✅ Reviewer dashboard with different styling for officials
✅ Error handling for invalid credentials
✅ Loading states during authentication

## User Roles Hierarchy

1. **Applicant** - Submit applications, track status
2. **District Reviewer** - Review applications at district level
3. **Regional Reviewer** - Review applications at regional level
4. **National Reviewer** - Review applications at national level
5. **NRCC Member** - Final approval by committee
6. **Admin** - System administration and oversight

## Next Steps

- Implement application submission forms
- Create application review workflows
- Add document upload functionality
- Implement notifications system
- Add reporting and analytics
- Create user management for admins
