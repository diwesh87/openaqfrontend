# Contributing to OpenAQ Global Air Dashboard - Frontend

Thank you for your interest in contributing to the OpenAQ Global Air Dashboard! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- **Clear title and description**
- **Steps to reproduce** the bug
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Browser/OS information**

### Suggesting Features

We welcome feature suggestions! Please open an issue with:
- **Clear description** of the feature
- **Use case** - why would this be useful?
- **Possible implementation** (if you have ideas)

### Code Contributions

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/openaqfrontend.git
   cd openaqfrontend
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Set up development environment**
   ```bash
   npm install
   npm run dev
   ```

4. **Make your changes**
   - Follow the existing code style
   - Write clear, readable code
   - Add comments for complex logic
   - Update documentation if needed

5. **Test your changes**
   ```bash
   npm run lint
   npm run build
   ```

6. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   # or
   git commit -m "fix: fix your bug description"
   ```

   **Commit message format:**
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template
   - Wait for review

## 📋 Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Define proper types/interfaces
- Avoid `any` type when possible
- Use meaningful variable names

### React
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop types/interfaces

### Styling
- Use Tailwind CSS utility classes
- Follow the existing dark mode patterns
- Ensure responsive design
- Maintain consistent spacing and colors

### File Structure
```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts
├── lib/           # Utilities and helpers
├── sections/      # Page sections
└── types/         # TypeScript definitions
```

## 🧪 Testing

Before submitting a PR, ensure:
- [ ] Code runs without errors
- [ ] No linting errors (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Dark mode works correctly
- [ ] Responsive design is maintained
- [ ] No console errors

## 📝 Pull Request Checklist

- [ ] Code follows the project's style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated (if needed)
- [ ] No new warnings generated
- [ ] Changes tested locally
- [ ] PR description is clear and detailed

## 🎨 Design Guidelines

### Dark Mode
- Always support both light and dark themes
- Use `useTheme()` hook from `contexts/ThemeContext`
- Apply dark mode classes: `dark:bg-gray-800`, `dark:text-neon-cyan`
- Test in both themes

### Colors
- Light mode: Use standard Tailwind colors
- Dark mode: Use neon colors (cyan, pink, green) for accents
- Maintain good contrast ratios for accessibility

### Components
- Keep components reusable and composable
- Use proper TypeScript props
- Handle loading and error states
- Provide meaningful fallbacks

## 🐛 Debugging Tips

1. **Check browser console** for errors
2. **Use React DevTools** for component inspection
3. **Check Network tab** for API issues
4. **Verify environment variables** are set correctly
5. **Clear browser cache** if styles aren't updating

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

## ❓ Questions?

If you have questions:
- Open an issue with the `question` label
- Check existing issues and discussions
- Review the README.md for setup instructions

## 🙏 Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!

