# Password Protection & Client Self-Measurement Portal Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Provide an Apple HIG luxury passcode lock to protect the master atelier workspace while offering a public, elegant client self-measurement portal accessible via unique shareable links (WhatsApp/clipboard).

**Architecture:** 
1. **Passcode Security Layer**: Client-side session and encrypted local/cloud master PIN verification with auto-lock, remember me, and quick lock actions in the Header.
2. **URL Routing & Portal Dispatcher**: Detect query parameters (`?portal=measure&cid=...` or `?portal=measure`) to bypass the tailor PIN lock and mount the public `ClientMeasurementPortal`.
3. **Client Self-Measurement Portal**: Guided, mobile-first Haute Couture self-measuring wizard with visual instructions, fraction selectors, fit preference choices, and direct Firestore cloud sync.
4. **Tailor Sharing Integration**: One-click "Copy Self-Measure Link" and "Send Invitation via WhatsApp" buttons integrated into the Customer Profile, Customer Card, and Header.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Lucide React, Zustand (`useTailorStore`), Firebase Firestore (`larreluxe-ac3c5`).

---

### Task 1: Passcode Protection & Authentication Store

**Files:**
- Create: `src/components/PasscodeLock.tsx`
- Modify: `src/store/useTailorStore.ts`
- Modify: `src/types/index.ts`

**Step 1: Define Passcode & Portal Types in `src/types/index.ts`**
- Add `AtelierSettings` interface (`passcode: string`, `isLockEnabled: boolean`, `autoLockTimeout: number`).
- Add `ClientSubmissionData` type for incoming client self-measurements.

**Step 2: Add Passcode State & Actions in `src/store/useTailorStore.ts`**
- Store `isUnlocked: boolean` (persisted in `sessionStorage` to keep unlocked across page refresh during the session).
- Store `masterPasscode: string` (default `'1926'`, customizable and saved in `localStorage`).
- Actions: `unlockApp(passcode: string): boolean`, `lockApp(): void`, `setMasterPasscode(newCode: string): void`.

**Step 3: Create `src/components/PasscodeLock.tsx`**
- Apple HIG luxury lock screen with obsidian glassmorphic aesthetic, gold crest, 4-6 digit PIN dots, numeric keypad, and toggle for standard text password entry.
- Visual shake feedback on incorrect PIN, haptic touch feedback.
- "Forgot Passcode" recovery guidance.

---

### Task 2: Client Self-Measurement Portal Component

**Files:**
- Create: `src/components/ClientMeasurementPortal.tsx`
- Create: `src/data/selfMeasurementGuides.ts`
- Modify: `src/services/firestoreService.ts`

**Step 1: Create Step-by-Step Guidance in `src/data/selfMeasurementGuides.ts`**
- Plain-English instructions and tips for Chest, Shoulder, Sleeve, Neck, Waist, Hip, Length, Inseam, etc.

**Step 2: Create `ClientMeasurementPortal.tsx`**
- Header with Larré Luxe royal crest and atelier welcome.
- Client Information Section (Name, WhatsApp/Phone, Email, Gender/Garment Type).
- Interactive Garment Selector (Senator Suite, Royal Agbada, Kaftan, Bespoke Suit, Shirt & Trousers).
- Guided measurement inputs with integer inputs + fraction chip picker ($0", 1/4", 1/2", 3/4"$).
- Fit Preference selector (Royal Slim, Classic Tailored, Relaxed Agbada Flow).
- Occasion date & special notes / fabric descriptions.
- Instant submission to Firebase Firestore under `customers` / `measurements`.
- Success Confirmation Screen: Haute Couture summary card with "Share Confirmation to Tailor on WhatsApp" button.

**Step 3: Support Self-Submission in `src/services/firestoreService.ts` & `src/store/useTailorStore.ts`**
- Create `submitClientSelfMeasurement(data: ClientSubmissionData)` that safely updates or creates the customer doc in Firestore.

---

### Task 3: URL Parameter Routing & Atelier App Integration

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/Header.tsx`
- Modify: `src/components/CustomerCard.tsx`

**Step 1: Implement URL Route Detection in `src/App.tsx`**
- Detect `window.location.search` on mount:
  - If `?portal=measure`: Render `ClientMeasurementPortal` directly (no passcode needed).
  - If no portal params: Render `PasscodeLock` if `!isUnlocked`, otherwise render the Master Atelier dashboard.

**Step 2: Add "Share Measurement Link" to Customer Profile & Cards**
- In `CustomerCard.tsx` & `App.tsx` customer details banner:
  - Add "Copy Self-Measure Link" button.
  - Add "Send WhatsApp Invite" button with pre-filled message:
    > *"Greetings [Client Name], here is your personal Larré Luxe bespoke measurement link to record your garment specifications: [URL]"*

**Step 3: Add Portal Generator & Lock Action in `Header.tsx`**
- Add quick Lock button (padlock icon) to immediately secure the atelier screen.
- Add "Share Self-Measure Link" modal/button in Header to generate a generic link for prospective clients (`/?portal=measure`).

---

### Task 4: Passcode Settings Modal & Security Management

**Files:**
- Create: `src/components/PasscodeSettingsModal.tsx`
- Modify: `src/components/Header.tsx`
- Modify: `src/App.tsx`

**Step 1: Create `src/components/PasscodeSettingsModal.tsx`**
- Allows master tailor to change the atelier PIN / password.
- Toggle between 4-digit PIN and alphanumeric password.
- Test and verify new PIN before saving.

**Step 2: Connect Settings in Header**
- Open `PasscodeSettingsModal` from Header settings icon.

---

### Task 5: Verification & Quality Assurance

**Files:**
- Verify with `npm run build`
- Test cases:
  1. Master Atelier Lock Screen: verify incorrect PIN shows shake animation; correct PIN unlocks.
  2. Lock Button: clicking padlock locks session immediately.
  3. Client Portal Link (`?portal=measure`): opens public client form without requiring PIN.
  4. Specific Client Portal Link (`?portal=measure&cid=...`): pre-populates client name and contact details.
  5. Measurement Submission: submit from client portal, verify real-time appearance in tailor dashboard.
  6. WhatsApp Share Link: verify properly formatted URL and pre-filled luxury copy.
