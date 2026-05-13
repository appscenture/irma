<!-- PROJECT IMAGE / BANNER -->
<p align="center">
  <img width="1838" height="1054" alt="image" src="https://github.com/user-attachments/assets/a273df37-f3c9-4387-8c51-a268a1b25e02" />

</p>

# 🚀 Irma

> A beautiful, responsive personal timeline website with scroll-triggered animations, custom color palette, and WhatsApp integration.

---

## 📖 Description

Irma is a dynamic personal timeline website that showcases your journey, projects, and social presence. It features smooth scroll animations, dark/light mode, and seamless integration with Google Sheets for easy content management without code changes.

What makes it unique:
- Google Sheets integration for content management
- Interactive timeline with Framer Motion animations
- Automatic GitHub project showcase
- Dark/Light mode with smooth transitions
- Fully responsive design

---

## ✨ Features

- **Interactive Timeline** – Scroll-triggered animations using Framer Motion
- **Google Sheets CMS** – Update content via Google Sheets without code changes
- **GitHub Integration** – Automatically fetch and display your GitHub projects
- **Dark/Light Mode** – Toggle between themes with smooth transitions
- **Responsive Design** – Optimized for mobile and desktop
- **Animated Components** – Beautiful UI with Shadcn UI components

---

## 🧠 Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- Framer Motion

**Data Source**
- Google Sheets API
- GitHub API

**Deployment**
- GitHub Pages

---

## 🏗️ Architecture / Workflow

```text
Google Sheets → CSV → App Fetch → Display Timeline → GitHub API → Project Cards
```

---

## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/irma.git

# Navigate to project
cd irma

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## 🔐 Environment Variables

Update `src/config. ts`:

```typescript
export const CONFIG = {
    GITHUB_USERNAME: "your-username",
    GOOGLE_SHEET_URL: "your-published-sheet-csv-url",
};
```

---

## 🧪 Usage

* Step 1: Update `src/config.ts` with your GitHub username
* Step 2: Create a Google Sheet with columns: Section, Title, Description, Image, Link
* Step 3: Publish your sheet as CSV (File > Share > Publish to web)
* Step 4: Add the CSV URL to config
* Step 5: Deploy to Vercel with `vercel deploy`

---

## 🎥 Demo

* **Live Demo:** [Deployed on Vercel]
* **Contact:** WhatsApp - [+62 856-1027-824](https://wa.me/628561027824)

---

## 📂 Project Structure

```text
irma/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── theme-provider.tsx
│   │   └── mode-toggle.tsx
│   ├── lib/
│   │   ├── github. ts
│   │   └── sheets.ts
│   ├── config.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
├── vite.config.ts
└── README.md
```

---

## 🚧 Future Improvements

- [ ] Add blog section with markdown support
- [ ] Implement contact form
- [ ] Add analytics integration
- [ ] Create admin panel for content management
- [ ] Add multi-language support

---

## 👥 Team / Author

* **Contact:** WhatsApp - [+62812345678](https://wa.me/62812345678)
* **GitHub:** [your-github-profile](https://github.com/yourusername)

---

## 📜 License

This project is licensed under the MIT License.
