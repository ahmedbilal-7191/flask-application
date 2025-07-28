# 📝 Flask Message Board App (To-Do List)

A full-stack **Flask-based Message Board App** (like a to-do list) with a PostgreSQL backend and Jinja2-powered frontend. The app is containerized with Docker, deployed to Kubernetes using Helm and ArgoCD, and integrated with a CI/CD pipeline that includes security and quality scans (Snyk, SonarQube, OWASP ZAP DAST).

---

## 🏗️ Project Structure
<pre> 
project-root/
│
├── app/ # Flask application
│ ├── static/ # CSS & JS files
│ │ ├── css/style.css
│ │ └── js/app.js
│ ├── templates/index.html # Jinja2 Template
│ ├── init.py # App Factory
│ ├── routes.py # Flask Routes
│ └── db.py # DB Models / Connection
│
├── config.py # Flask Configuration
├── run.py # Entry point
│
├── helm-chart/ # Helm deployment chart
│ ├── Chart.yaml
│ ├── values.yaml
│ └── templates/
│ ├── deployment.yaml
│ ├── flask-config.yaml
│ ├── flask-svc.yaml
│ ├── postgres-pv.yaml
│ ├── postgres-statefulset.yaml
│ └── postgres-svc.yaml
│
├── argocd/
│ └── application.yaml # ArgoCD GitOps Manifest
│
├── .env.example # Environment variable example
├── .gitignore
├── Dockerfile # Flask App Image
├── docker-compose.yml # Dev-only local setup
├── Jenkinsfile # CI/CD Pipeline
├── README.md

 </pre>
---

## 💡 Features

- ✅ Flask app with routes and templates
- ✅ PostgreSQL as persistent DB
- ✅ Responsive UI using Jinja2 and CSS
- ✅ Dockerized backend
- ✅ Helm for Kubernetes deployment
- ✅ ArgoCD for GitOps-based deployment
- ✅ Jenkins for CI/CD orchestration
- ✅ Snyk for dependency vulnerability scanning
- ✅ SonarQube for static code analysis
- ✅ OWASP ZAP for DAST on the deployed app

---

## 🚀 CI/CD Pipeline

![CI/CD Pipeline Diagram](./docs/ci-cd.png)

**Stages:**

1. **GitHub** – Source code management
2. **Jenkins** – CI/CD automation
3. **Snyk** – Dependency vulnerability scanning
4. **SonarQube** – Code quality checks
5. **Docker** – Build container image
6. **Docker Registry** – Push image to registry
7. **GitHub** – Commit Helm values / manifests
8. **ArgoCD** – GitOps deployment to cluster
9. **Helm** – Helm chart rendering and upgrade
10. **Kubernetes** – App runs inside cluster
11. **OWASP ZAP** – DAST scan post-deployment

---
## 💻 Working App Preview

Here’s how the Message Board App (To-Do List) looks in action:

![Working App Screenshot](./docs/message_board.png)

> This app allows users to add, update, and delete tasks. The UI is built using Jinja templates with a clean, minimal frontend.

---

## 🚀 ArgoCD Deployment View

Below is a screenshot of the ArgoCD dashboard showing the deployed resources and sync status:

![ArgoCD Dashboard](./docs/argo-cd.png)

> This helps visualize how the application is deployed and managed on Kubernetes using GitOps principles.

## 🐳 Local Development

1. Clone the repo and rename `.env.example` to `.env` with correct DB credentials.
2. Run locally with:


docker-compose up --build
🧪 Running Flask App Manually
export FLASK_APP=run.py
python run.py
⚙️ App Entry Point (run.py)

from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
📦 Docker Build (CI/CD)

docker build -t message-board-app:latest .
📦 Helm Deployment (Used by ArgoCD)

helm install message-board ./helm-chart -f helm-chart/values.yaml
🔐 Security Scanning
Snyk: Scans requirements.txt

SonarQube: Scans source code quality

OWASP ZAP: Scans live app for web vulnerabilities

🧠 Tech Stack
Layer	Tech
Backend	Flask (Python)
Frontend	Jinja2, HTML/CSS/JS
Database	PostgreSQL
Container	Docker
Orchestration	Kubernetes + Helm
Deployment	ArgoCD (GitOps)
CI/CD	Jenkins
Security	Snyk, SonarQube, ZAP

📄 License
MIT License

🙌 Credits
Created by Mohd Bilal Ahmed — Contributions welcome!



---
