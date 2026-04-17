# Cazabanderas Project TODO

## Completed Features
- [x] Public website with all sections (Hero, About, Team, Platforms, Achievements, Write-ups, Join)
- [x] Write-ups section with filter/sort/search functionality
- [x] Custom authentication system (username/password login)
- [x] Team Portal with restricted access
- [x] Admin panel for team member management
- [x] Activity logging system with security tracking

## In Progress
- [x] Add real team statistics to homepage (0 CTFs, 5 members, 400+ flags)
- [x] Update Arsenal section with real CTF category breakdown

## Completed Features (Recent)
- [x] Team Resources section (file upload/download, documentation, access control)

## Planned Features
- [x] Team hunters profile management in admin panel (add/edit/remove hunter profiles)
- [x] Connect hunters profiles to public 'Meet the hunters' section
- [x] Add home page link to Team Login page
- [x] Add navigation (home/team dashboard) to Admin Panel header
- [x] Update platforms section with accurate rankings (HTB: Top 200, THM: Top 100%)
- [x] Clear dummy achievements and set flags captured to 0+
- [x] Remove all dummy write-ups
- [ ] Challenge Tracker for active CTF competitions
- [ ] Team Chat for real-time collaboration
- [ ] Leaderboard with member rankings and achievements
- [ ] CTFtime API integration for upcoming events
- [ ] Email notifications for security alerts
- [ ] Activity log export as CSV
- [ ] Team member invitation system with shareable links
- [x] Set up i18n infrastructure with i18next library
- [x] Create English translation files
- [x] Create Latin American Spanish translation files
- [x] Integrate i18n into Navbar component
- [x] Add language switcher UI component
- [x] Integrate i18n into HeroSection component
- [x] Integrate i18n into WriteupsSection component (header & empty state)
- [x] Integrate i18n into JoinSection component (critical user-facing)
- [x] Integrate i18n into Footer component (nav & contact)
- [x] Test translations across all pages and routes (Hero, Navbar, Write-ups, Join, Footer verified)
- [x] Integrate i18n into AboutSection component
- [x] Integrate i18n into CategoriesSection (Arsenal) component
- [x] Integrate i18n into TeamSection component
- [x] Integrate i18n into PlatformsSection component
- [x] Integrate i18n into AchievementsSection component
- [ ] Integrate i18n into TeamLogin page (future)
- [ ] Integrate i18n into TeamPortal page (future)
- [ ] Integrate i18n into AdminPanel page (future)
- [x] Create database schema for platforms and achievements
- [x] Create tRPC procedures for platforms and achievements CRUD
- [x] Add admin panel tabs for Platforms and Achievements
- [x] Build complete admin UI forms for editing platforms
- [x] Build complete admin UI forms for editing achievements (flags captured)
- [x] Integrate admin UI forms with backend procedures
- [x] Test admin panel platform and achievement editing
- [x] Create database schema for team write-ups with public/private visibility
- [x] Create tRPC procedures for write-ups CRUD operations
- [x] Build write-ups management UI for team dashboard
- [x] Add write-ups editor with markdown support
- [ ] Integrate public write-ups with homepage WriteUpsSection
- [x] Test write-ups visibility (public vs private) - UI ready
- [ ] Add write-ups to team activity log
- [x] Create dedicated write-ups management page with better organization
- [x] Build write-ups list with filtering, sorting, and search
- [x] Build improved write-up editor with markdown support
- [x] Add write-ups page navigation and route
- [x] Test dedicated write-ups page functionality
- [x] Add visible navigation link from Team Portal to dedicated /write-ups page
- [x] End-to-end test: create, edit, delete write-ups on dedicated page
- [x] Test public/private toggle and verify homepage integration
- [x] Test search and filter functionality on write-ups page
- [x] Redesign TeamPortal as button-based dashboard navigation
- [x] Create dedicated TeamResources page
- [x] Create dedicated KnowledgeBase page (write-ups management)
- [x] Update routing for new dashboard pages
- [x] Test team dashboard navigation and page transitions
- [x] Route team login flow to new Team Dashboard instead of TeamPortal
- [x] Refactor Knowledge Base page to remove nested headers from WriteUpsPage
- [x] Verify end-to-end navigation from Team Login → Team Dashboard
- [x] Integrate public write-ups with homepage WriteUpsSection

## Polish & Optimization Tasks
- [x] Verified no critical console errors
- [x] Tested all pages load cleanly and responsively
- [x] Confirmed navigation works smoothly
- [x] Verified forms render properly
- [x] Tested admin panel functionality
- [x] Confirmed team dashboard accessibility
- [ ] Add loading skeletons for async data (write-ups, team members, etc.) - future enhancement
- [ ] Improve empty states with CTAs - future enhancement
- [ ] Add form validation feedback - future enhancement
- [ ] Implement active navigation highlighting - future enhancement
- [ ] Add accessibility improvements (ARIA labels, keyboard navigation) - future enhancement
- [ ] Optimize images and assets for faster loading - future enhancement
- [ ] Test responsive design on mobile/tablet - future enhancement
- [ ] Fix any console warnings - future enhancement
- [ ] Add success/error toast notifications - future enhancement
- [ ] Improve error handling and user feedback - future enhancement

## Loading Skeleton Implementation
- [x] Create reusable Skeleton component with pulse animation
- [x] Create SkeletonCard component for write-ups and list items
- [x] Create SkeletonTable component for admin panel tables
- [x] Add skeleton screens to WriteupsSection (homepage)
- [x] Add skeleton screens to AdminPanel (team members, platforms, achievements)
- [x] Test skeleton animations and timing
- [x] Verify skeletons display during actual data fetching
- [ ] Add skeleton screens to TeamResources page (future enhancement)
- [ ] Add skeleton screens to KnowledgeBase/WriteUpsPage (future enhancement)

## Logo & Branding Update
- [x] New professional logo designed (wolf with red flag design)
- [x] Logo uploaded to CDN: https://d2xsxph8kpxj0f.cloudfront.net/310519663561350743/fQrwPhmvRnJkdAC8zKsvoi/ncaza_f9eab0bb.png
- [x] Update VITE_APP_LOGO in Management UI Settings → General
- [x] Verify logo displays in website header
- [x] Verify favicon updates in browser tab
- [x] Copy favicon.png to client/public directory
- [x] Update Navbar component to use new logo
- [x] Update index.html with favicon links
- [x] Update HeroSection component to use new logo
- [x] Audit entire codebase for old logo references
- [x] Verify new logo displays consistently across all pages (homepage, admin, team dashboard, team login)
- [x] Remove all old logo references

## Navbar Fixes
- [x] Remove duplicate Team Login button from navbar (kept the one in CTA section closest to Hunt With Us)

## i18n Translation Fixes
- [x] Fix navbar layout breaking when switching to Spanish (text wrapping/spacing)
- [x] Add footer translations (copyright, motto, description, flag hunters)
- [x] Set Latin American Spanish as default language instead of English
- [x] Add remaining homepage translations (About section, Categories, Join section, Write-ups empty state) - COMPLETED
