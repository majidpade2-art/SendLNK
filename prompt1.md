# PROJECT: MAJIDSPACE — PREMIUM SOCIAL MEDIA LINK HUB

Build a complete, modern, premium social media link-in-bio platform inspired by Linktree, but with a unique visual identity and original design.

The platform should allow users to create personalized profile pages containing their social media links, websites, contact information, and other important destinations.

## 1. TECHNOLOGY STACK

Use the following technologies:

- Next.js 15+ with App Router
- React 19+
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- Lucide React for icons
- Supabase for authentication and database
- Prisma ORM (optional, if needed)
- Zod for form validation
- React Hook Form for form management
- Vercel for deployment

Use clean, reusable, scalable, and maintainable code.

## 2. DESIGN AND VISUAL IDENTITY

Create a premium, futuristic, minimalist, and modern interface.

Design direction:
- Dark mode as the default theme.
- Deep black and dark navy backgrounds.
- Neon green as the primary accent color.
- Subtle purple and blue gradients.
- Glassmorphism effects.
- Smooth transitions and micro-interactions.
- Soft glowing borders.
- Rounded cards and modern typography.
- Beautiful spacing and consistent alignment.

The website should look like a premium SaaS product, not a basic HTML link page.

Use responsive layouts for desktop, tablet, and mobile devices.

## 3. PUBLIC PROFILE PAGE

Create a personalized public profile page for every user.

Include:

- Custom profile picture.
- Display name and username.
- Short biography.
- Verified badge option.
- Online status indicator.
- Social media icon buttons.
- Customizable background.
- Customizable theme colors.
- Custom fonts.
- Profile views counter.

## 4. LINK MANAGEMENT SYSTEM

Users should be able to:

- Add unlimited links.
- Edit existing links.
- Delete links.
- Reorder links using drag and drop.
- Add custom titles and descriptions.
- Upload custom thumbnails.
- Select icons for each link.
- Enable or disable individual links.
- Highlight important links.
- Schedule link visibility.
- Organize links into categories.

Each link should have:
- Title
- URL
- Description
- Icon
- Thumbnail
- Status
- Display order

## 5. SOCIAL MEDIA INTEGRATION

Provide built-in social media buttons for:

- Instagram
- TikTok
- YouTube
- Facebook
- X (Twitter)
- Discord
- WhatsApp
- Telegram
- GitHub
- Twitch
- Spotify
- LinkedIn
- Email

Allow users to add custom social media URLs.

## 6. ADMIN DASHBOARD

Build a professional dashboard with a modern sidebar navigation.

Dashboard sections:

- Overview
- My Profile
- Manage Links
- Social Media
- Appearance
- Analytics
- Account Settings

Overview should display:
- Total profile views.
- Total link clicks.
- Most popular links.
- Recent activity.
- Click-through rate.
- Weekly and monthly statistics.

Use attractive charts and clean data visualizations.

## 7. AUTHENTICATION SYSTEM

Implement a secure authentication system using Supabase.

Features:
- User registration.
- Login.
- Logout.
- Forgot password.
- Password reset.
- Email verification.
- Protected dashboard routes.
- User profile management.

Users must only be able to manage their own profiles and links.

Implement proper authorization and Supabase Row Level Security (RLS).

## 8. ANALYTICS SYSTEM

Create an analytics dashboard that tracks:

- Total profile visits.
- Total link clicks.
- Daily visitors.
- Weekly visitors.
- Monthly visitors.
- Most clicked links.
- Device categories.
- Referral sources.

Display statistics using interactive charts.

Respect user privacy and avoid collecting unnecessary personal information.

## 9. CUSTOMIZATION SYSTEM

Allow users to personalize their profile pages.

Customization options:

- Dark and light mode.
- Background colors.
- Gradient backgrounds.
- Background images.
- Button styles.
- Card styles.
- Border radius.
- Font selection.
- Text colors.
- Animation preferences.

Provide a live preview while editing.

## 10. PREMIUM FEATURES

Design the architecture to support future premium subscriptions.

Potential premium features:

- Custom domains.
- Advanced analytics.
- Remove platform branding.
- Premium themes.
- Custom CSS.
- Scheduled links.
- Advanced profile customization.

Do not implement fake payment functionality. Keep subscription integration modular.

## 11. ADDITIONAL FEATURES

Include:

- QR code generator for public profiles.
- Copy profile URL button.
- Share profile functionality.
- Search and filter links.
- Mobile-first navigation.
- SEO metadata.
- Open Graph preview images.
- Custom 404 page.
- Loading skeletons.
- Empty states.
- Error handling.
- Toast notifications.

## 12. DATABASE STRUCTURE

Create appropriate database tables for:

- Users
- Profiles
- Links
- Social Accounts
- Analytics Events
- Themes
- Subscriptions

Use proper relationships, indexes, validation, and security policies.

## 13. PERFORMANCE AND SECURITY

Requirements:

- Optimize images.
- Use server components where appropriate.
- Use client components only when necessary.
- Implement proper input validation.
- Sanitize user-generated content.
- Validate external URLs.
- Protect private routes.
- Prevent unauthorized database access.
- Avoid exposing API secrets.
- Implement accessible UI components.
- Optimize for Core Web Vitals.

## 14. PROJECT STRUCTURE

Use a clean and scalable folder structure.

Separate:
- App routes
- Components
- Dashboard components
- UI components
- Hooks
- Utilities
- Database configuration
- Types
- API routes
- Authentication logic

## 15. DEVELOPMENT REQUIREMENTS

Important instructions:

1. Build a fully functional application, not just a static UI mockup.
2. Make every button and interactive element work.
3. Connect forms to the actual database.
4. Implement real authentication.
5. Make the dashboard functional.
6. Ensure profile customization is saved.
7. Ensure links are dynamically rendered.
8. Make the application responsive.
9. Avoid placeholder functionality presented as completed features.
10. Provide clear setup instructions in README.md.
11. Include an .env.example file.
12. Make the project ready for deployment on Vercel.

If external credentials are required, provide clear environment variable instructions instead of inventing credentials.

## 16. PRODUCTION ADDENDUM & TECHNICAL SPECIFICATIONS

To ensure enterprise-grade reliability and security in production:

1. **Custom Domain Routing Architecture:**
   - Use Next.js Middleware to inspect the incoming `Host` header.
   - If the host differs from the apex domain (e.g., `userdomain.com` or `links.brand.com`), rewrite the request internally to `/[username]` while preserving the URL bar.
   - Support Vercel Domains API or Cloudflare for SaaS SSL termination.

2. **Asset & Image Storage Pipeline:**
   - Dedicated Supabase Storage buckets: `avatars` and `thumbnails`.
   - Max file size limit: 2MB for avatars, 5MB for thumbnails.
   - Enforce allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`.
   - Storage RLS: Public read access enabled; upload/delete restricted to authenticated owner (`auth.uid() = (storage.foldername(name))[1]`).

3. **Rate Limiting & Anti-Abuse for Analytics:**
   - Protect public telemetry endpoints (`/api/analytics/view`, `/api/analytics/click`).
   - Implement rate limiting (e.g., Upstash Redis or token bucket) with a threshold of 60 requests per minute per IP address.
   - Ignore synthetic user-agent bots (Googlebot, Bingbot, crawlers) from analytics counting.

4. **URL Sanitization & Security Protocol:**
   - Validate external URLs with strict protocol whitelisting: `https://`, `http://`, `mailto:`, and `tel:`.
   - Explicitly block pseudo-protocols to prevent XSS: `javascript:`, `data:`, `vbscript:`, and `file:`.
   - Add `rel="noopener noreferrer"` to all outgoing external links.

5. **Subscription & Webhook Lifecycle:**
   - Maintain a webhook endpoint (`/api/webhooks/stripe` or LemonSqueezy) with cryptographic signature validation.
   - Automatically toggle `plan_tier` ('free', 'pro', 'vip') in the `profiles` table upon receiving `customer.subscription.updated` or `customer.subscription.deleted`.

6. **Automated Testing & QA:**
   - E2E testing for the drag-and-drop link reorder workflow and phone preview responsiveness.
   - Unit tests for date scheduling filters and analytics aggregation logic.

## FINAL GOAL

Create MAJIDSPACE, a premium all-in-one social media link platform that combines the simplicity of Linktree with the customization, analytics, and dashboard experience of a modern SaaS application.

The final result should feel polished, professional, futuristic, fast, and visually impressive.

Prioritize excellent UI/UX, functional features, clean architecture, security, and maintainability.

Do not stop after generating the homepage. Build the complete application step by step.