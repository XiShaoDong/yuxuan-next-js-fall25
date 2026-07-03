# Kambaz LMS — Frontend

A full-featured Learning Management System frontend built with Next.js 15, featuring course management, a polymorphic quiz engine with real-time attempt tracking, role-based access control, and AI-powered tutoring feedback.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| UI Library | React 19 |
| Language | TypeScript |
| State Management | Redux Toolkit |
| HTTP Client | Axios (withCredentials) |
| UI Components | React-Bootstrap + React Icons |
| Testing | Jest + React Testing Library |
| CI/CD | GitHub Actions → Vercel |

## Architecture

```
app/(Kambaz)/                       ← Grouped route (not in URL)
├── layout.tsx                      ← Redux Provider + Session HOC
├── store.tsx                       ← Redux store (5 slices)
├── types.ts                        ← Shared TypeScript interfaces
├── Navigation.tsx                  ← Global sidebar (role-aware)
│
├── Account/                        ← Authentication module
│   ├── client.ts                   ← Auth API calls
│   ├── reducer.ts                  ← currentUser state
│   ├── Session.tsx                 ← HOC: auto-restores login on mount
│   ├── Signin/ Signup/ Profile/    ← Pages
│
├── Dashboard/                      ← Course enrollment + Faculty CRUD
│   ├── page.tsx                    ← Enrolled/All courses toggle
│   ├── client.ts                   ← Enrollment API
│
├── Courses/[cid]/                  ← Dynamic course routes
│   ├── layout.tsx + Navigation.tsx ← Course-level nav shell
│   ├── Modules/                    ← Module list + inline editing
│   ├── Assignments/                ← Assignment CRUD + editor
│   ├── People/                     ← User table with role filters
│   ├── Grades/                     ← Grade display
│   └── Quizzes/                    ← ★ Core feature
│       ├── page.tsx                ← Quiz list (Faculty: manage / Student: scores)
│       ├── client.tsx              ← Quiz CRUD + Questions API
│       ├── reducer.tsx             ← Quiz state management
│       └── [qid]/
│           ├── page.tsx            ← Quiz details + attempt history
│           ├── client.tsx          ← Attempts API + AI Tutor API
│           ├── Editor/
│           │   ├── page.tsx        ← Tabs: Details | Questions
│           │   ├── DetailsEditor   ← 14 quiz config fields
│           │   ├── QuestionsEditor ← Question list manager
│           │   └── QuestionEditor  ← MC/TF/FillInBlank + WYSIWYG
│           ├── Attempt/
│           │   ├── page.tsx        ← Quiz-taking engine
│           │   └── utils.ts        ← Fisher-Yates shuffle
│           ├── Preview/            ← Faculty preview with instant grading
│           └── Results/[rid]/      ← Score review + AI Tutor feedback
```

### Key Design Decisions

- **Session HOC**: Wraps the entire app to auto-restore login state via `POST /api/users/profile` on mount
- **Redux for entities, local state for UI**: Courses/modules/quizzes in Redux; timer/answers/pagination in component state
- **API Client Layer**: Each module has a dedicated `client.ts` with `axios.create({ withCredentials: true })`
- **RBAC via conditional rendering**: `currentUser.role === "FACULTY"` gates edit/publish/delete UI
- **WYSIWYG Editor**: Custom `contentEditable` with `Selection API` for blank placeholder insertion

## Pages (24)

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Redirect to Dashboard |
| Signin | `/Account/Signin` | Username/password login |
| Signup | `/Account/Signup` | Registration with optional email |
| Profile | `/Account/Profile` | View/edit user profile |
| Users | `/Account/Users` | Admin user management |
| Dashboard | `/Dashboard` | Course cards + enrollment toggle |
| Course Home | `/Courses/:cid/Home` | Course landing page |
| Modules | `/Courses/:cid/Modules` | Module/lesson list with inline editing |
| Assignments | `/Courses/:cid/Assignments` | Assignment list + CRUD |
| Assignment Editor | `/Courses/:cid/Assignments/:aid` | Assignment detail editor |
| People | `/Courses/:cid/People` | Enrolled users table |
| Grades | `/Courses/:cid/Grades` | Grade display |
| Quiz List | `/Courses/:cid/Quizzes` | Faculty: manage quizzes / Student: view scores |
| Quiz Details | `/Courses/:cid/Quizzes/:qid` | Attempt history, dates, take/edit buttons |
| Quiz Editor | `/Courses/:cid/Quizzes/:qid/Editor` | Details + Questions tabs |
| Quiz Attempt | `/Courses/:cid/Quizzes/:qid/Attempt` | Timer, pagination, shuffle, answer input |
| Quiz Preview | `/Courses/:cid/Quizzes/:qid/Preview` | Faculty preview with instant grading |
| Quiz Results | `/Courses/:cid/Quizzes/:qid/Results/:rid` | Score review + AI Tutor feedback |

## Quiz Engine Features

| Feature | Implementation |
|---------|---------------|
| 3 question types | Multiple Choice, True/False, Fill-in-the-Blank (multi-blank) |
| Countdown timer | `setInterval` with auto-submit on expiry |
| One-question-at-a-time | Conditional rendering with prev/next navigation |
| Answer shuffling | Fisher-Yates algorithm (extracted to `utils.ts` with unit tests) |
| Multi-blank rendering | Parses `[blank0]` placeholders into inline `<input>` elements |
| Attempt tracking | Displays attempt count, enforces max attempts |
| AI Tutor | Post-quiz AI feedback for wrong answers (Gemini / template fallback) |
| WYSIWYG editor | `contentEditable` + `document.execCommand` + Selection API |
| Progress tracking | `useMemo`-derived answered count + progress indicators |

## Role-Based Access Control

| Feature | Faculty/Admin | Student |
|---------|--------------|---------|
| Course CRUD | Create, edit, delete | View only |
| Enrollment | Auto-enrolled on create | Enroll/Drop toggle |
| Quiz management | Create, edit, delete, publish toggle | View published only |
| Quiz preview | Preview with instant grading | Not available |
| Quiz attempt | Not available | Take quiz, view results |
| AI Tutor | Not available | Get feedback on wrong answers |
| Context menu | Edit / Delete / Publish / Copy | Not shown |

## Getting Started

### Prerequisites
- Node.js 20+
- Backend server running ([kambaz-node-server-app](https://github.com/XiShaoDong/kambaz-node-server-app))

### Installation

```bash
git clone https://github.com/XiShaoDong/yuxuan-next-js-fall25.git
cd yuxuan-next-js-fall25
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_HTTP_SERVER=http://localhost:4001
```

For production (Vercel):
```env
NEXT_PUBLIC_HTTP_SERVER=https://your-backend.onrender.com
```

### Run

```bash
npm run dev
# App starts on http://localhost:3000
```

## Testing

```bash
npm test
```

- **Redux Reducer Tests**: All 5 slices (account, courses, modules, assignments, quizzes) — covers add, update, delete, toggle publish, question mutations
- **Utility Tests**: `shuffleArray` with mocked `Math.random` for deterministic verification

## CI/CD

| Workflow | Trigger | Steps |
|----------|---------|-------|
| **CI** | Push/PR to `main` | Install → Lint (ESLint) → Typecheck (tsc) → Test (Jest) → Build |
| **Deploy** | CI passes on `main` (`workflow_run`) | `vercel build --prod` → `vercel deploy --prebuilt --prod` |

## Backend Repository

[XiShaoDong/kambaz-node-server-app](https://github.com/XiShaoDong/kambaz-node-server-app)
