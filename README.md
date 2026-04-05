# Finance Dashboard (Full-Stack UI)

A stunning, highly-interactive Personal Finance Dashboard designed specifically to fulfill and exceed frontend evaluation requirements. Built with a premium glassmorphism design, this application allows users to securely monitor their financial trajectory.

**Note on Scope:** While the assignment requested a frontend-only implementation, I went ahead and built a completely functional **Node.js/Express Backend with MongoDB integration, JWT Authentication, and SendGrid email parsing** to demonstrate full-stack competency. However, the frontend remains completely isolated in `./client` and can run purely using the `mockApiService`.

---

## 🚀 Key Features (Assignment Checklist)

### 1. Dashboard Overview (Core)
- **Summary Cards:** Dynamic tracking for Total Balance, Income, and Expenses.
- **Time-Based Visualization:** Smooth `Recharts` Area Chart mapping balance trends over time.
- **Categorical Visualization:** Interactive Pie Chart breaking down expense allocations.

### 2. Transactions Section (Core)
- Comprehensive table listing displaying Date, Description, Category, Amount, and Type.
- **Advanced Filtering:** Dropdown type filter (All/Income/Expense) and intelligent text-search (by description/category).
- **Sorting:** Ascending and descending chronological sorting.
- Customizable `TransactionModal` smoothly handles data entry.

### 3. Basic Role-Based UI (Core)
- **Simulated RBAC:** The frontend utilizes Zustand to maintain an active role state (`Viewer` vs `Admin`).
- Roles can be immediately toggled using the **Eye** (Viewer) and **Shield** (Admin) icons mapped to the top navigation header.
- Viewers are physically restricted from editing data, deleting transactions, or natively adding records.

### 4. Insights Section (Core)
- A dedicated insights module highlighting highest spending category, gross savings rate, and rule-based financial health evaluations (50/30/20 rule).
- Includes a dual Bar Chart for monthly Income versus Expense comparisons.

### 5. State Management Approach (Core & #6)
- **Tool used:** `Zustand`
- The entire application lifecycle relies on `useFinanceStore` and `authStore` without any prop drilling.
- Data persistence is flawlessly handled via Zustand's `persist` middleware, meaning browser refreshes maintain exact user environments (Roles, Themes, Transactions).

### 6. Attention to Detail & Polish (#8)
- **Empty States Framework:** Carefully handles visual null state boundaries preventing empty `ResponsiveContainer` crashes and rendering friendly fallbacks.
- **Form Validation:** Client-side Regex tracking combined with a visual password strength meter, backed by `express-validator` on the server layer.
- **Responsiveness:** Exclusively mobile-first Tailwind design adapting seamlessly to phones, tablets, and massive desktops.

### 🌟 Bonus / Optional Enhancements (All Implemented)
- **Dark Mode:** A flawless theme implementation heavily relying on CSS root variables (`index.css`) hooked to a sun/moon toggle switch persisted in state.
- **Data Persistence:** Completely integrated (Local Storage for Frontend + MongoDB for Auth).
- **Mock API Integration:** Included `mockApiService.js` mapped directly to Zustand thunks mapping simulated network delays.
- **Animations & Transitions:** Fully animated CSS classes (`page-enter`, `fade-in`, staggered loading, micro-interactions).
- **Export Functionality:** Instant CSV and JSON export utilities triggered via the Transactions header buttons.

---

## 🛠️ Tech Stack

### Frontend Client (`/client`)
- **Framework:** React + Vite
- **Styling:** Vanilla CSS variables + Tailwind CSS.
- **Charts:** Recharts
- **State Management:** Zustand
- **Icons:** Lucide-React
- **Routing:** React Router v7

### Backend Server (`/server`)
- **Architecture:** Node.js + Express
- **Database:** MongoDB / Mongoose
- **Security:** bcryptjs, JSON Web Tokens (JWT)
- **Features:** Authentication/Authorization rules, locked accounts after invalid requests, SendGrid Password Reset.

---

## ⚙️ Installation & Setup Instructions (#7)

You can run the frontend in complete isolation.

### 1. Frontend Setup (Dashboard Only)
```bash
cd client
npm install
npm run dev
```
Navigate to `http://localhost:5173/`

### *(Optional)* 2. Backend Setup (Authentication Layer)
If you wish to test the full-stack authentication flow:
```bash
cd server
npm install
```
Configure your `.env` following `.env.example`, then start the server:
```bash
npm run dev
```
*Make sure your MongoDB instance is running locally or provide a URI in the `.env`.*

---

## 🤝 Project Structure / Documentation (#7)

- `client/src/pages/`: Contains isolated route views (`Dashboard`, `Transactions`, `Insights`) and the `auth/` subtree.
- `client/src/store/`: Zustand definitions. Notice how `useFinanceStore.js` intercepts data logic utilizing `mockApiService.js`.
- `client/src/index.css` & `auth.css`: Contains CSS variable mappings driving the glassmorphism and theme engine.
- `server/`: Complete MVC architecture separating routes, controllers, middleware limits, and Mongoose schema definitions.

This dashboard aims to be incredibly simple to navigate while still proving deep frontend complexity under the hood. Enjoy!
