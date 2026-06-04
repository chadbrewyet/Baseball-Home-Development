# Clubhouse Baseball Development

A dependency-free web app built around the incorporated 12U Baseball At-Home Training and Development Plan.

## Run

Serve the folder from `localhost` or HTTPS, then open it in a browser. For example:

```powershell
python -m http.server 4173
```

Open `http://localhost:4173`. The app stores local profiles and records in IndexedDB. Local profiles do not synchronize between devices.

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
- Multiple local player, parent, coach, and scheduler profiles using name + PIN
- Multiple teams, priority-team membership, team events, player overrides, and conflict decisions
- Five-choice illustrated player readiness check-in with arm-pain admin alerts
- Responsive installable PWA with offline app-shell support
