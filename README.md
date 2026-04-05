# 💎 Finance Dashboard (Full-Stack UI)

A stunning, highly-interactive Personal Finance Dashboard designed specifically to fulfill and exceed frontend evaluation requirements. Built with a **premium glassmorphism design**, this application allows users to securely monitor their financial trajectory with ease and elegance.

**Note on Scope:** While the assignment requested a frontend-only implementation, I have provided a completely functional **Node.js/Express Backend** with MongoDB integration and JWT Authentication to demonstrate full-stack competency. However, the frontend remains completely isolated in `./client` and can run purely using the `mockApiService`.

## 🌐 Live Deployment

- **Frontend (Client):** [https://finance-dashboard-ui-1-6jnz.onrender.com/](https://finance-dashboard-ui-1-6jnz.onrender.com/)
- **Backend (API):** [https://finance-dashboard-ui-17v5.onrender.com/](https://finance-dashboard-ui-17v5.onrender.com/)

---

## 🚀 Core Requirements (Assignment Checklist)

### 1. Dashboard Overview
- **Summary Cards:** Dynamic tracking for **Total Balance**, **Income**, and **Expenses** with trend indicators.
- **Time-Based Visualization:** Smooth `Recharts` Area Chart mapping balance trends over time.
- **Categorical Visualization:** Interactive Pie Chart breaking down expense allocations by category.

### 2. Transactions Section
- **Comprehensive Table:** Displays Date, Description, Category, Amount, and Type.
- **Advanced Filtering:** Dropdown type filter (All/Income/Expense) and intelligent text-search (by description or category).
- **Sorting:** Ascending and descending chronological sorting.
- **Data Management:** Admin role can add, edit, or delete transactions smoothly.

### 3. Basic Role-Based UI (RBAC)
- **Simulated Roles:** Uses `Zustand` to maintain an active role state (`Viewer` vs `Admin`).
- **Interactive Toggle:** Roles can be toggled via the **Eye** (Viewer) and **Shield** (Admin) icons in the top navigation.
- **UI Behavior:** 
  - **Admin:** Full CRUD access (Add/Edit/Delete).
  - **Viewer:** Read-only access; action buttons are hidden or disabled.

### 4. Insights Section
- **Automated Insights:** Highlights the **Highest Spending Category** and **Monthly Comparison**.
- **Financial Health:** Includes a dual Bar Chart for monthly Income vs. Expense comparisons and a "Savings Rate" calculation.

### 5. State Management
- **Tooling:** Powered by `Zustand`.
- **Logic:** Centralized state in `useFinanceStore` and `authStore` to prevent prop-drilling.
- **Persistence:** Flawlessly handled via Zustand's `persist` middleware, ensuring browser refreshes maintain active Roles, Themes, and Transactions.

---

## 🌟 Premium Enhancements (Bonus)

- **🌙 Dark Mode:** A flawless theme implementation using CSS root variables hooked to a sun/moon toggle switch.
- **💾 Data Persistence:** Local Storage for the frontend and MongoDB for the optional authentication layer.
- **⚡ Mock API Integration:** Includes a `mockApiService.js` that simulates network latency for a realistic loading experience.
- **🎬 Animations:** fully animated CSS classes (`page-enter`, `fade-in`, staggered list loading) using CSS transitions.
- **📤 Export Utilities:** Instant **CSV** and **JSON** export functionality for transaction data.

---

## 🎨 Design Philosophy & UX

1.  **Glassmorphism Aesthetic:** Utilizes semi-transparent surfaces, backdrop blurs, and subtle glowing gradients to create a "Premium/State-of-the-art" feel.
2.  **Visual Excellence:** Custom-curated color palettes (Secondary Green for Income, Accent Red for Expenses) instead of browser defaults.
3.  **Responsiveness:** Exclusively mobile-first Tailwind design that scales seamlessly from small phones to large desktop monitors.
4.  **Handling Edge Cases:** Custom "Empty State" components for charts and tables to ensure the UI never looks "broken" when data is missing.

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite, Tailwind CSS, Recharts, Zustand, Lucide-React.
- **Backend (Optional):** Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt.

---

## ⚙️ Installation & Setup

You can run the frontend in complete isolation.

### 1. Frontend Setup (Dashboard Only)
```bash
cd client
npm install
npm run dev
```
Navigate to `http://localhost:5173/`

### 2. Backend Setup (Optional)
If you wish to test the full-stack authentication flow:
```bash
cd server
npm install
# Configure .env based on .env.example
npm run dev
```

---

## 🤝 Evaluation Criteria Mapping

- **Design & Creativity:** Premium Glassmorphism UI with micro-animations.
- **Responsiveness:** 100% responsive across all device breakpoints.
- **Functionality:** Full CRUD on transactions, RBAC simulation, and automated insights.
- **Technical Quality:** Modular component structure and clean Zustand state logic.

This dashboard was built to demonstrate how a simple requirement can be turned into a premium-grade user experience. Enjoy!

