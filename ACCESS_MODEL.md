# Clubhouse Access Model

Clubhouse uses scoped access. A user can have multiple roles, but every role is evaluated inside a silo instead of as a single global identity.

## Silos

- Household: parent-managed family unit. Parents manage household membership and have full access to household players. Players can view household members but cannot manage the household.
- Organization: director-managed baseball organization. Directors manage organization teams and coach assignments, and can invite or assign coaches, parents, and players to teams. Directors do not manage households.
- Team: coach-managed roster and training group. Head coaches manage team coaches, parents, players, and training. Assistant coaches are limited by skill focus.
- Individual: the player account and training record. Players manage only their own account, daily work, logs, schedule view, and requests.

## Roles

- Director: highest authority inside an organization and its linked teams.
- Head Coach: highest authority inside assigned teams.
- Assistant Coach: team-scoped coach with one or more skill focuses.
- Parent: household manager with full access to household players.
- Player: individual account owner with self-service training access.

## Permission Rule

Permissions are resolved by asking:

`What can this user do inside this specific silo?`

The highest access the user has in that silo wins, but access in one silo does not automatically grant management access in another silo. Organizations and teams can be linked, but households remain independent.

## Invite Model

Invites are silo-specific:

- Organization/Director workflows invite or assign coaches, parents, and players to teams.
- Team workflows invite coaches, parents, and players to that team.
- Household workflows invite parents and players only.
- Player workflows request team or household access.

Removing a member from a silo removes only that silo membership. It does not delete the user account.

## Profile UX

The Profile page should present one Associations section with tabs:

- Household
- Organizations
- Teams
- Individual

Each tab lists the silos connected to the logged-in user. Opening an item shows the members and linked records relevant to that silo, with actions filtered by the user's scoped permissions.
