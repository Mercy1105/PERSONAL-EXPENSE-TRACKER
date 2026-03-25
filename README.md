# Cloud-Based Personal Expense Tracker

A premium, modern finance manager built with **Next.js**, **Tailwind CSS**, and **Firebase**.

## 🚀 Quick Start (Complete Steps)

Follow these steps exactly to run the project:

### 1. Open your Terminal
Open PowerShell, CMD, or your preferred terminal.

### 2. Navigate to the Project Folder
```powershell
cd "c:\Users\Mercy\Downloads\CloudProject"
```

### 3. Install Dependencies
Due to the use of Next.js 15 and React 19 RC, use the following command to handle peer dependency resolution:
```powershell
npm install --legacy-peer-deps
```

### 4. Run the Development Server
```powershell
npm run dev
```

### 5. Access the Application
Open your browser and visit:
[http://localhost:3000](http://localhost:3000)

---

## ☁️ Cloud Configuration (Firebase)

The project is currently configured with a **Demo Firebase Project**. To use your own cloud database:

1. Create a project at [Firebase Console](https://console.firebase.google.com).
2. Add a **Web App** to your project.
3. Copy the `firebaseConfig` object.
4. Open `lib/firebase.ts` in this project.
5. Replace the `firebaseConfig` values with your own.
6. Enable **Cloud Firestore** and **Anonymous Authentication** in the Firebase dashboard.

## 🚀 Deployment

### Option 1: Netlify (Recommended)
1. **Push your code to GitHub**: Create a new repository and push this folder.
2. **Login to Netlify**: Go to [app.netlify.com](https://app.netlify.com).
3. **Import from Git**: Select your repository.
4. **Configure Settings**:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `.next`
5. **Environment Variables**: Add your Firebase keys (from `lib/firebase.ts`) in **Site settings > Environment variables**.
6. **Deploy!**

### Option 2: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in this directory.

## ✨ Features
- **Real-time Synchronization**: Data stays in sync with Google Cloud.
- **Glassmorphism UI**: Beautiful, modern dark-themed aesthetics.
- **Interactive Charts**: Category breakdowns and cash flow visualizations.
- **Responsive**: Works on desktop and mobile.
