# Keyboard Shortcuts

| Shortcut | Action | Scope |
|----------|--------|-------|
| Ctrl+K | Open search | Global |
| Ctrl+N | New application | Applications tab |
| Escape | Close modal | Global |
| Ctrl+S | Save changes | Profile tab |
| Ctrl+E | Export CSV | Applications tab |

## Implementation
- useKeyboardShortcuts hook
- Checks for input focus (prevents triggering while typing)
- Platform-aware (Cmd vs Ctrl)
