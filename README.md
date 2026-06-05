# Clubhouse Baseball Development

A dependency-free web app built around the incorporated 12U Baseball At-Home Training and Development Plan.

## Run

Serve the folder from `localhost` or HTTPS, then open it in a browser. For example:

```powershell
python -m http.server 4173
```

Open `http://localhost:4173`. The app stores local profiles and records in IndexedDB. The active profile stays signed in on that browser until explicit sign-out. Local profiles do not synchronize between devices.

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
- Local Super User, Director, Coach, Parent, and Player profiles using name + PIN
- Login tracking with last-login timestamps and local login counts
- Seeded local Super User login for fresh installs
- Public sign-up creates a login immediately; new users see only Account Management until a higher-level user approves their organization, team, household, or player association
- Organization, team coach role, household, player-team, player-tag, and access-request records shaped for a future Supabase migration
- Super User masquerade support for testing non-Super User functionality
- Multiple teams, priority-team membership, team events, player overrides, and conflict decisions
- Five-choice illustrated player readiness check-in with arm-pain admin alerts
- Responsive installable PWA with offline app-shell support

## Local role model

Permissions are scoped as Super User, Director, Coach, Parent, Player. Fresh installs seed username `Super User` with PIN `244466666888888888`. Super Users manage users, roles, approvals, and masquerade testing. Directors manage assigned organizations. Head and Assistant Coach access is stored per team, with one active Head Coach per team. Parents manage households and household equipment. Players manage only their own check-ins and logs. UI controls and form handlers both check these scopes.
