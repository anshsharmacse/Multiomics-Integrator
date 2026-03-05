# Contributing to MultiOmics-Integrator

Thank you for your interest in contributing to MultiOmics-Integrator! This document provides guidelines and instructions for contributing.

## 📜 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Please be considerate of others and follow these principles:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Bun or npm
- Git
- Basic knowledge of React, TypeScript, and Next.js

### Setting Up the Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork locally**
   ```bash
   git clone https://github.com/YOUR_USERNAME/multiomics-integrator.git
   cd multiomics-integrator
   ```

3. **Install dependencies**
   ```bash
   bun install
   ```

4. **Start the development server**
   ```bash
   bun run dev
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

## 🔄 Development Workflow

### Creating a Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `bugfix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests

### Making Changes

1. Write clean, readable code
2. Follow the existing code style
3. Add comments where necessary
4. Update documentation if needed

### Running Lint

```bash
bun run lint
```

Make sure there are no lint errors before committing.

### Committing Changes

We follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Example:
```
feat: add new 3D protein visualization component
```

### Pushing Changes

```bash
git push origin feature/your-feature-name
```

### Opening a Pull Request

1. Go to the original repository on GitHub
2. Click "Compare & pull request"
3. Fill in the PR template:
   - Description of changes
   - Related issue (if any)
   - Screenshots (if applicable)
   - Testing instructions

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── page.tsx           # Main page component
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── 3d/                # 3D visualization components
│   ├── analysis/          # Analysis components
│   └── ui/                # UI components (shadcn)
├── hooks/                 # Custom React hooks
└── lib/                   # Utility functions and stores
```

## 🧪 Testing

Currently, the project does not have automated tests configured. If you'd like to add tests, we welcome contributions in this area!

## 📚 Documentation

- Update the README.md if you change functionality
- Add JSDoc comments to new functions
- Update the worklog.md for significant changes

## 🐛 Reporting Bugs

If you find a bug, please open an issue with:

1. **Title**: Clear, descriptive title
2. **Description**: What happened vs. what you expected
3. **Steps to Reproduce**: List of steps
4. **Environment**: OS, browser, Node version
5. **Screenshots**: If applicable

## 💡 Feature Requests

We welcome feature requests! Please open an issue with:

1. **Title**: Clear feature description
2. **Motivation**: Why this feature would be useful
3. **Proposed Solution**: How you envision it working
4. **Alternatives**: Other approaches considered

## 📧 Contact

If you have questions, feel free to reach out:

- **GitHub**: [@anshsharmacse](https://github.com/anshsharmacse)
- **LinkedIn**: [Ansh Sharma](https://www.linkedin.com/in/anshsharmacse/)
- **Email**: anshsharmacse@gmail.com

---

Thank you for contributing to MultiOmics-Integrator! 🧬
