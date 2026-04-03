<img width="100" src="https://github.com/techulus/manage/blob/main/public/images/logo.png?raw=true" />

# Manage

![License](https://img.shields.io/github/license/techulus/manage)
![Last Commit](https://img.shields.io/github/last-commit/techulus/manage)
![Contributors](https://img.shields.io/github/contributors/techulus/manage)
![Stars](https://img.shields.io/github/stars/techulus/manage)

An open-source project management platform with an intuitive interface, customizable features, and emphasis on collaboration.

## ✨ Features

- 🎯 **Intuitive Interface** — Clean, modern UI for seamless project tracking
- 👥 **Team Collaboration** — Built-in tools for team communication and coordination
- 🔒 **Self-Hosted** — Full data ownership with easy self-deployment options
- 🛠️ **Customizable** — Adapt workflows to match your team's processes
- 📊 **Project Tracking** — Task management with boards, lists, and timelines
- 🔔 **Notifications** — Email alerts for important updates and deadlines

## 🚀 Quick Start

### One-Click Deploy

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/manage)

### Manual Deployment

```bash
# Prerequisites
- Node.js 18+
- PostgreSQL database
- S3-compatible storage (optional)
- SMTP server (for email)

# Clone the repository
git clone https://github.com/techulus/manage.git
cd manage

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database and S3 credentials

# Run database migrations
npm run db:push

# Start the server
npm run dev
```

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript |
| Backend | Node.js, Bun |
| Database | PostgreSQL |
| Storage | S3-compatible |
| Deployment | Docker, Railway |

## 📁 Project Structure

```
manage/
├── app/              # Main application code
├── public/          # Static assets
├── prisma/          # Database schema
├── .env.example     # Environment template
└── package.json     # Dependencies
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Licensed under the [GNU AFFERO GENERAL PUBLIC LICENSE](LICENSE).

---

README optimized with [Gingiris README Generator](https://gingiris.github.io/github-readme-generator/)
