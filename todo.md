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
- [ ] Route team login flow to new Team Dashboard instead of TeamPortal
- [ ] Refactor Knowledge Base page to remove nested headers from WriteUpsPage
- [ ] Verify end-to-end navigation from Team Login → Team Dashboard
