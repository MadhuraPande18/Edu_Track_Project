# 🎓 Edu-Track | Academic Control & Educational Activity Dashboard

**Edu-Track** is a state-of-the-art, high-fidelity full-stack educational dashboard designed to monitor and manage academic batches, trainers, courses, and student enrolments in real-time. Built with a Spring Boot backend and an extremely premium React + Vite frontend, it integrates seamless database synchronization with automatic offline fallback capabilities.

---

## 📸 Application Preview

Below is the premium dark mode dashboard showing clean card widgets, dynamic status banners, and glassmorphic quick-action panels.

<img width="1300" height="903" alt="dashboard" src="https://github.com/user-attachments/assets/86235c31-e2ed-4e2e-89e2-b22740c5c547" />


---

## ✨ Features

* **🔮 Rich Aesthetics & Theme Toggle:** Tailored glassmorphism UI with smooth CSS HSL transitions, fluid animations, custom-themed scrollbars, and full support for premium dark/light mode toggles.
* **📊 Analytics & Real-Time Stats:** Track critical operational metrics instantly (Total Students, Active/Ongoing Classes, Average Class Sizes, and Student Retention Rates).
* **📁 Smart Batch Grid:** Visually monitor learning schedules. Click on any batch card to expand an inline drawer detailing all students currently enrolled in that class.
* **👥 Student Directory:** A searchable and real-time filterable data table mapping full student details (email, phone, course, assigned batch, and enrolment dates).
* **⚡ Live Database Seeding:** If the database starts fresh or empty, a prominent button allows admins to populate MongoDB with pre-loaded mock batches and students in a single click.
* **🛡️ Robust Local Fallback:** If the backend Spring Boot server is offline, the React client automatically detects this and operates smoothly using offline `localStorage` simulation.
* **🌐 CORS Aligned:** Fully configured to communicate on port `3000` (React) to trusted endpoints on port `8080` (Spring Boot).

---

## 🛠️ Technology Stack

### Backend
* **Framework:** Spring Boot 3.5.9 (Java 17)
* **Database Access:** Spring Data MongoDB
* **Dev Efficiency:** Lombok & Spring Boot DevTools (Hot Reloading)
* **Web:** Spring Web (REST Controllers with CORS config)

### Frontend
* **Core:** React + Vite (ES6 JavaScript)
* **Icons:** Lucide React
* **Styling:** Custom Vanilla HSL Palette (Glassmorphism & Micro-animations)
* **Server Requesting:** Native Fetch API

### Database
* **Engine:** MongoDB (Port `27017`)

---

## 🚀 Setup & Launch Instructions

### Prerequisites
1. **Java Development Kit (JDK) 17** installed.
2. **Node.js** (v18+) installed.
3. **MongoDB** installed and running on default port `27017` locally.

---

### Step 1: Start the MongoDB Server
Ensure your local MongoDB instance is active on port `27017` before launching the backend.

### Step 2: Start the Spring Boot Backend
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd Edu-Track-Backend--main/edu-track-backend
   ```
2. Run the application:
   * **Windows (PowerShell):**
     ```powershell
     .\mvnw spring-boot:run
     ```
   * **macOS / Linux:**
     ```bash
     chmod +x mvnw
     ./mvnw spring-boot:run
     ```
3. The server will launch on **`http://localhost:8080`**.

---

### Step 3: Start the React Frontend
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd Edu-Track-Backend--main/edu-track-frontend
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. The client will launch locally on **`http://localhost:3000`** (auto-opened or accessible via browser).

---

## 🔧 Database Case Resolution (Important)
During local setups, MongoDB checks database capitalization. This project is configured to use the default case `edutrackDB` (lowercase `t`) in `application.properties` to avoid conflict with pre-existing collections on Windows environments.
