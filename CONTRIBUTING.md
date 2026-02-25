# Contributing to DocuMind AI

Thank you for your interest in contributing to DocuMind AI! 🎉

## 🤝 How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/your-org/documind-ai/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node version)

### Suggesting Features

1. Check [Issues](https://github.com/your-org/documind-ai/issues) for existing suggestions
2. Create a new issue with:
   - Clear feature description
   - Use case / problem it solves
   - Proposed solution
   - Alternative solutions considered

### Pull Requests

#### Setup Development Environment

```bash
# Fork the repo on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/documind-ai.git
cd documind-ai

# Add upstream remote
git remote add upstream https://github.com/your-org/documind-ai.git

# Install dependencies
npm install

# Create .env.local with your API keys
cp .env.example .env.local

# Run development server
npm run dev
```

#### Making Changes

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes**
   ```bash
   # Test locally
   npm run dev
   
   # Build to check for errors
   npm run build
   
   # Run linter
   npm run lint
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: resolve bug"
   ```

   **Commit Message Format:**
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting)
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Fill in PR template
   - Link related issues
   - Wait for review

#### Pull Request Guidelines

✅ **Do:**
- Keep PRs focused on a single feature/fix
- Write clear PR description
- Update documentation
- Add tests if applicable
- Respond to review feedback

❌ **Don't:**
- Mix multiple unrelated changes
- Break existing functionality
- Ignore review feedback
- Commit directly to main

## 📝 Code Style

### TypeScript

```typescript
// Use explicit types
function uploadDocument(file: File): Promise<Document> {
  // ...
}

// Use async/await over promises
async function getData() {
  const data = await fetchData();
  return data;
}

// Use early returns
function validate(input: string) {
  if (!input) return false;
  if (input.length < 5) return false;
  return true;
}
```

### React Components

```tsx
// Use functional components
export default function MyComponent({ prop }: Props) {
  return <div>{prop}</div>;
}

// Extract reusable logic to hooks
function useDocumentUpload() {
  const [loading, setLoading] = useState(false);
  // ...
  return { upload, loading };
}
```

### File Naming

- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- API routes: `route.ts`
- Pages: `page.tsx`

## 🧪 Testing

Currently, we don't have automated tests. Contributions to add testing are welcome!

**Manual testing checklist:**
- [ ] Sign up/sign in works
- [ ] Upload document works
- [ ] AI search works
- [ ] Payment flow works
- [ ] No console errors
- [ ] Mobile responsive

## 📚 Documentation

When adding features, update:
- README.md - If user-facing feature
- API.md - If adding/changing API
- DEVELOPMENT.md - If changing dev workflow
- Code comments - For complex logic

## 🎨 Design Guidelines

- Follow existing UI patterns
- Use Tailwind CSS utilities
- Maintain consistent spacing
- Ensure mobile responsiveness
- Test in multiple browsers

## 🐛 Debugging

### Common Issues

**Build fails:**
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

**Type errors:**
```bash
# Check TypeScript
npx tsc --noEmit
```

**Linting errors:**
```bash
# Run linter
npm run lint

# Auto-fix
npm run lint -- --fix
```

## 🔐 Security

- Never commit API keys or secrets
- Use environment variables
- Validate all user inputs
- Sanitize data before database operations
- Report security issues privately to security@documind.ai

## 📞 Getting Help

- 💬 [GitHub Discussions](https://github.com/your-org/documind-ai/discussions)
- 📧 Email: dev@documind.ai
- 🐛 [Open an Issue](https://github.com/your-org/documind-ai/issues)

## 🎉 Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Given credit in documentation

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to DocuMind AI! 🚀
