# RBAC Finance Dashboard

A stunning, highly-interactive Personal Finance Dashboard designed with React, Vite, Tailwind CSS, and Recharts. This intuitive web application helps users securely monitor their real-time financial trajectory using simulated Role-Based Access Control (RBAC).

## 🚀 Features

- **RBAC Simulation:** Secure UI views simulating data-access control schemas (`Admin` controls state mutations whereas a `Viewer` can solely consume metrics in a read-only capacity).
- **Comprehensive Overviews:** Tracks Total Balance, Income, and Expense data across time via robust visual representations (Area Charts, Pie Charts, Bar Charts).
- **Finance Operations:** Add, Edit, or Delete custom transaction records with categorized groupings depending on income/expense choices.
- **Robust Insights Manager:** Automatically detects highest expense areas alongside current general savings rates across temporal scopes.
- **Dynamic Search & Filtering:** Quickly search through custom data sets with robust filtering by component, type, description, and categorized arrays.
- **State Management:** Secure centralized state transitions maintained locally and instantaneously refreshed using Zustand.
- **Empty States Framework:** Carefully handles visual null state bounds rendering friendly messages preventing empty `ResponsiveContainer` crashes.

## 💻 Tech Stack

- **Framework:** React + Vite
- **Styling:** Vanilla CSS variables + Tailwind CSS with modern design heuristics (Dark themes, glassmorphism UI overlays).
- **Charts:** Recharts
- **State Management:** Zustand
- **Icons:** Lucide-React
- **Date Utilities:** date-fns

## 🛠️ Installation & Setup

1. **Clone the project & Navigate to directory:**
   ```bash
   cd "Finance Dashboard"/client
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

The application will usually be running at `http://localhost:5173/`.

## 🎨 UI Guidelines

- **Component Design:** Built to align perfectly using high-end UI themes like `glass-panels`. It adopts layered backdrop blurs (`backdrop-blur-sm/md`) to synthesize depth between dynamic content objects and the fixed layered application backgrounds.
- **Roles Details:** Admins get comprehensive editing features, while Viewers are restricted globally from altering records but keep search and filtering powers. Switch between roles via the explicit toggle situated in the Header bar directly!

## 🤝 Roadmap / Future implementations

- Link dashboard up against an active real-world MongoDB cluster by porting the `utils/mockData.js` arrays onto dedicated REST APIs.
- Enhance custom role access token integrations like JWT/OAuth bindings to securely anchor endpoints.
