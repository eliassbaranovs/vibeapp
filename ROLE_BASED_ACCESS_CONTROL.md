# Feature Request: Add Role-Based Access Control (RBAC)

## Context

The current application is a **single-owner system**:

- Every project and task belongs to exactly one user.
- Any authenticated user who owns a project can perform **all actions** on it.

As the product evolves, we need to support **safe collaboration** and **permission boundaries**.
This feature introduces **Role-Based Access Control (RBAC)** at the **project level**.

This feature will be implemented **live during the session** using a structured, AI-assisted planning approach.

---

## Goal

Introduce **project-level roles** so that different users can have different levels of access to the same project.

Roles:

- **Owner** (creator, cannot leave)
- **Admin**
- **Editor**
- **Viewer**

---

## Roles & Permissions

### Role definitions

- **Owner**

  - The project creator
  - Full access to the project
  - Can view, create, update, and delete projects and tasks
  - Can manage project members and their roles
  - Can transfer ownership to another user
  - **Cannot leave the project** (protection against orphaned projects)

- **Admin**

  - Full access to the project (same as Owner)
  - Can view, create, update, and delete projects and tasks
  - Can manage project members and their roles
  - Can promote other users to Admin
  - Can leave the project

- **Editor**

  - Can view the project
  - Can create, update, and delete tasks
  - Cannot update project name or settings
  - Cannot delete projects
  - Cannot manage roles

- **Viewer**
  - Read-only access
  - Cannot create, update, or delete anything

---

## Permission Matrix

| Action                         | Owner | Admin | Editor | Viewer |
| ------------------------------ | ----- | ----- | ------ | ------ |
| View project                   | ✅    | ✅    | ✅     | ✅     |
| Update project name            | ✅    | ✅    | ❌     | ❌     |
| Delete project                 | ✅    | ✅    | ❌     | ❌     |
| View tasks                     | ✅    | ✅    | ✅     | ✅     |
| Create / update tasks          | ✅    | ✅    | ✅     | ❌     |
| Delete tasks                   | ✅    | ✅    | ✅     | ❌     |
| Manage project members & roles | ✅    | ✅    | ❌     | ❌     |
| Transfer ownership             | ✅    | ❌    | ❌     | ❌     |
| Leave project                  | ❌    | ✅    | ✅     | ✅     |

---

## Functional Requirements

### 1) Project Membership

- A project can have **multiple members**
- Each member has **exactly one role** per project
- A user may have different roles in different projects

---

### 2) Backend / Database Enforcement (Critical)

- Permissions must be enforced on the **backend/database level**
- UI checks are **not sufficient**
- Unauthorized actions must fail even if attempted via API or dev tools

---

### 3) Role Assignment Rules

- The project creator becomes **Owner** by default
- Only **Owner** and **Admins** can:
  - Add members to a project
  - Change a member's role (except Owner)
  - Remove members from a project
- Only **Owner** can:
  - Transfer ownership to another member
  - Promote/demote Admins
- **Owner cannot be removed or leave the project**

---

### 4) UI Behavior (MVP Scope)

- Hide or disable actions the user is not allowed to perform
- Show read-only UI for Viewers
- Show clear error messages when an action is denied

**Member Management UI:**

- Create a **Project Settings page** accessible from project detail view
- Add "Members" tab/section showing current members and their roles
- **Add Member Flow:**
  - "Add Member" button opens a modal
  - Modal shows a list of all available users (user lookup)
  - Select user and assign role (Admin/Editor/Viewer)
  - Only Owner/Admin can see and use this feature
- **Remove Member:**
  - When a user is removed from a project, show a toast notification
  - User is redirected to dashboard if they're viewing that project
- **Role Changes:**
  - Owner/Admin can change roles via dropdown in members list
  - Show confirmation for sensitive actions (removing Admin, transferring ownership)

---

## Non-Goals (Out of Scope for Live Session)

- Organization-level roles
- Invitations by email
- Audit logs
- Fine-grained or custom permissions
- Temporary or time-based roles

---

## Technical Implementation Details

### Database Schema

**New Table: `project_members`**

```sql
CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

CREATE INDEX project_members_project_id_idx ON project_members(project_id);
CREATE INDEX project_members_user_id_idx ON project_members(user_id);
```

**Migration Strategy:**

- Add `project_members` table
- Migrate existing projects: Insert row for each project owner with role='owner'
- Update RLS policies to check project_members table

### RLS Policy Approach

**Projects Table:**

- SELECT: User must be a member of the project (join with project_members)
- UPDATE: User must be Owner or Admin
- DELETE: User must be Owner or Admin

**Tasks Table:**

- SELECT: User must be a member of the parent project
- INSERT/UPDATE: User must be Owner, Admin, or Editor
- DELETE: User must be Owner, Admin, or Editor

**Project Members Table:**

- SELECT: User must be a member of the project
- INSERT: User must be Owner or Admin of the project
- UPDATE: User must be Owner or Admin (cannot change Owner role)
- DELETE: User must be Owner or Admin (cannot delete Owner)

**Default Behavior for Non-Members:**

- Queries return empty results (no data exposed)
- Project doesn't appear in lists
- Direct access via URL fails/redirects to 404 or dashboard

---

## Edge Cases

1. **Zero Admins Prevention:**

   - Owner role prevents project from having zero administrators
   - Owner cannot leave or be removed from project
   - If Owner wants to leave, must transfer ownership first

2. **Ownership Transfer:**

   - Only Owner can transfer ownership
   - Target user must already be a member
   - Show confirmation dialog (irreversible action)
   - Previous Owner becomes Admin after transfer

3. **Last Admin Protection:**

   - If only one Admin exists (besides Owner), prevent role change/removal
   - Show warning: "Project must have at least one Admin"

4. **Member Removal:**

   - User removed from project:
     - Loses all access immediately (RLS enforced)
     - Redirected to dashboard if viewing the project
     - Toast notification: "You have been removed from [Project Name]"
   - Cannot remove Owner

5. **Backward Compatibility:**
   - Existing projects: Creator becomes Owner automatically
   - Migration creates project_members entry for all existing projects

---

## Acceptance Criteria

- A Viewer cannot modify data, even by manually calling APIs
- An Editor cannot delete a project
- Only Owner/Admins can manage members and roles
- Owner cannot leave the project
- Non-members cannot access project data (RLS enforced)
- Existing single-user projects continue to work:
  - The creator is automatically Owner with full access

---

## Implementation Guidance (for Live Session)

### Suggested Phases

1. **Data model changes**
   - Introduce project membership with roles
2. **Authorization rules**
   - Enforce permissions at the database / backend level
3. **Minimal UI updates**
   - Disable or hide unauthorized actions
4. **Manual verification**
   - Test each role against the permission matrix

---

## Key Principle (Say This Out Loud)

> **Frontend permissions are UX.  
> Backend permissions are security.**

---

## Success Definition

The feature is complete when:

- All four roles (Owner, Admin, Editor, Viewer) are clearly defined
- Permissions are consistently enforced at database level (RLS)
- Unauthorized access is impossible (even via direct API calls)
- Project Settings page allows member management
- Owner cannot leave/be removed (orphaned project prevention)
- Non-members cannot see or access projects
- Existing projects migrated successfully (creators → Owners)
- The system is easy to reason about and extend
