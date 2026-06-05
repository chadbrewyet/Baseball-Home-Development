# Clubhouse Baseball Development

A dependency-free web app built around the incorporated 12U Baseball At-Home Training and Development Plan.

## Run

Serve the folder from `localhost` or HTTPS, then open it in a browser. For example:

```powershell
python -m http.server 4173
```

Open `http://localhost:4173`. The app uses Supabase Auth and Supabase-backed records when configured, with IndexedDB as a local fallback.

## Supabase setup

1. In Supabase SQL Editor, run `supabase-schema.sql`.
2. In Authentication settings, enable Email/Password signups.
3. Serve the app from localhost or HTTPS and sign up with your first test account.
4. The first authenticated profile created in an empty Supabase records table becomes the initial Super User.

## Current features

- Exact in-season and off-season session templates from the development plan
- Workout builder with drill lists, categories, duration, and intensity
- Daily readiness check-in
- Session logging with RPE, metrics, and notes
- Pitch-count logging with age 11-12 rest calculations and catcher warnings
- Monthly speed, strength, command, and hitting assessments
- Drill library with cues and visual references
- Parent-approved structured drill library with research-backed variations
- Manual reusable session variation builder with balanced-rotation guidance
- Equipment Shed with missing-equipment alerts
- Drill completion and benchmark-result tracking
- Dashboard and progress summaries
- Supabase email/password auth with local role and association records
- Login tracking with last-login timestamps and local login counts
- First Supabase-authenticated profile becomes the initial test Super User when the records table is empty
- Public sign-up creates a login immediately without choosing a role; new users land on Profile, where they can create records or request organization, team, household, coach, or player associations
- Profile page with personal information, pending association requests, Add New and Link record workflows, associated-record tables, and app settings
- Super User Admin view with global Super User, unassociated user, organization, team, household, director, coach, parent, and player record tables plus masquerade testing
- Super Users can promote existing users or pre-authorize an email to become a Super User after sign-up
- Organization, team coach role, household, player-team, player-tag, and access-request records shaped for a future Supabase migration
- Super User masquerade support for testing non-Super User functionality
- Multiple teams, priority-team membership, team events, player overrides, and conflict decisions
- Five-choice illustrated player readiness check-in with arm-pain admin alerts
- Responsive installable PWA with offline app-shell support

## Local role model

Permissions are scoped as Super User, Director, Coach, Parent, Player. The first Supabase-authenticated profile in an empty records table becomes the initial Super User. Super Users manage users, roles, approvals, and masquerade testing. Directors manage assigned organizations. Head and Assistant Coach access is stored per team, with one active Head Coach per team. Parents manage households and household equipment. Players manage only their own check-ins and logs. UI controls and form handlers both check these scopes.
