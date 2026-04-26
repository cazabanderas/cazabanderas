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
- [x] Integrate i18n into TeamLogin page (COMPLETED - fully translated)
- [x] Integrate i18n into TeamPortal page (COMPLETED - fully translated)
- [x] Integrate i18n into AdminPanel page (COMPLETED - header, tabs, navigation translated)
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


## Recruitment System Implementation

- [x] Design database schema for recruitment_applications table (COMPLETED)
- [x] Create tRPC procedures for application CRUD operations (COMPLETED)
- [x] Implement automated scoring algorithm (challenge count, category diversity, platform reputation, GitHub activity) (COMPLETED)
- [x] Add i18n translations for recruitment pages (COMPLETED - English & Spanish)
- [x] Build recruitment application form with 13 fields (COMPLETED)
- [x] Create admin dashboard for reviewing applications (COMPLETED)
- [x] Integrate recruitment form into homepage "Join the Hunt" section (COMPLETED)
- [ ] Implement application status tracking (pending, reviewed, accepted, rejected) (PENDING)
- [ ] Add Discord integration for acceptance notifications (PENDING)
- [ ] Create feedback system for rejected candidates (PENDING)
- [ ] Implement review timeline tracking (24-48 hour deadline) (PENDING)
- [ ] Test end-to-end recruitment workflow (PENDING)


## HackTheBox API Integration

- [x] Set up HTB API token as environment variable (COMPLETED)
- [x] Create tRPC procedures for HTB team activity (COMPLETED)
  - [x] getTeamActivity: Fetch raw team activity from HTB
  - [x] getChallengeCounts: Process activities and count by category
  - [x] getLatestPwns: Get latest 3 pwns with metadata
- [x] Build RecentPwns component to display latest 3 pwns (COMPLETED)
- [x] Create RecentActivitySection for homepage (COMPLETED)
- [x] Update CategoriesSection to fetch live challenge counts from HTB (COMPLETED)
- [x] Integrate RecentActivitySection into homepage (COMPLETED)
- [x] Write comprehensive vitest tests for HTB router (COMPLETED - 12 tests passing)
- [x] Verify all tests pass and integration works (COMPLETED)

## Features Enabled by HTB Integration

- Live challenge count updates in Arsenal section (syncs with team activity)
- Display of latest 3 team pwns on homepage with user, challenge, category, date, points
- Automatic category detection from challenge names
- Real-time team activity tracking


## Challenge Deduplication System (Arsenal Section Redesign)

- [x] Update database schema with completedChallenges table (COMPLETED)
- [x] Seed database with 30 challenges across 12 categories (COMPLETED)
- [x] Refactor HTB router with deduplication logic (COMPLETED)
  - [x] getChallengeCounts: Returns counts from database (prevents duplicates)
  - [x] getAllChallenges: Retrieves all challenges with details
  - [x] addChallenge: Manual challenge addition with duplicate prevention
  - [x] syncHTBActivity: Auto-sync from HTB API with deduplication
- [x] Update CategoriesSection to display challenges from database (COMPLETED)
  - [x] Hover to show challenge names
  - [x] Live counts from database
  - [x] Category grouping
- [x] Write comprehensive deduplication tests (COMPLETED - 11 tests passing)
- [x] Verify all counts match specifications (COMPLETED)
  - [x] OSINT: 6
  - [x] Web: 4
  - [x] Hardware: 2
  - [x] And all other categories

## Key Features Implemented

- **Challenge Tracking:** Each completed challenge stored with name, category, difficulty, points
- **Deduplication:** Unique constraint on challenge name prevents double-counting
- **Database-Driven:** Arsenal section now pulls from database instead of hardcoded values
- **Auto-Sync:** syncHTBActivity mutation can auto-add new challenges from HTB API
- **Manual Management:** addChallenge procedure for manual challenge addition
- **Hover Details:** Categories show challenge names on hover for transparency


## Team Member Sync from HTB
- [x] Create team_members database table with HTB sync fields (COMPLETED)
- [x] Add HTB API endpoint to fetch team members (COMPLETED)
- [x] Create tRPC procedure to sync team members from HTB (COMPLETED)
- [x] Build admin panel for editing team member cards (COMPLETED - HTBTeamMemberManager with full edit UI)
- [x] Update TeamSection to display synced members with profile pictures (COMPLETED)
- [x] Write tests for team member sync logic (COMPLETED)

## i18n Bug Fixes (Session 2)
- [x] Fix TypeScript errors in HTB router (name → challengeName) - COMPLETED
- [x] Fix PlatformsSection i18n structure (added platforms.items array) - COMPLETED
- [x] Fix deduplication tests to match actual API behavior - COMPLETED
- [x] Fix AboutSection missing i18n keys (added about.label, title, intro1, intro2, values) - COMPLETED
- [x] Fix HeroSection missing i18n keys (added hero.label, tagline, joinThePack, ourHunts, stats) - COMPLETED
