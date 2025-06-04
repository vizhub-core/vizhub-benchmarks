# Claude Development Notes

## Current Status

### ✅ Completed (Committed)
- **Documentation**: Added collaborative grading system roadmap to README
- **Infrastructure**: Created grades/ directory and collaborative file saving
  - Grader auto-detects git user name 
  - Saves individual files like `grades/ej-fox.csv`
  - Reads from main repo instead of isolated copy

### 🚧 In Progress (Staged/Unstaged)
- **UI Overhaul**: Started fullscreen single-result interface
  - Basic layout exists but incomplete
  - Missing keyboard navigation and VizHub integration

## Next Development Phase: Minimal Grader Interface

### High Priority TODOs

#### 1. VizHub Code Viewer Integration
- [ ] Research VizHub editor component/API
- [ ] Replace placeholder code panel with actual VizHub editor
- [ ] Show challenge files: `index.mjs`, `functions.mjs`, etc.
- [ ] Enable syntax highlighting and file switching

#### 2. Keyboard Navigation System
- [ ] Add useEffect for keyboard listeners
- [ ] Implement arrow keys / J/K for result navigation
- [ ] Add currentIndex state management
- [ ] Ensure proper focus management

#### 3. Hotkey Grading
- [ ] Number keys 1-5 for technical scores
- [ ] Shift+1-5 for aesthetics scores  
- [ ] Zero key for auto-fail (both scores = 0)
- [ ] Space/Enter to advance to next result
- [ ] Visual feedback for applied grades

#### 4. Save Status & Feedback
- [ ] Auto-save on grade changes (no save button)
- [ ] Toast notifications: "Saving..." → "✓ Saved to grades/ej-fox.csv"
- [ ] Error handling with clear messages
- [ ] Unsaved changes indicator

#### 5. Polish & UX
- [ ] Escape key for help overlay showing all hotkeys
- [ ] Visual grade indicators (colored when scored)
- [ ] Skip functionality for already-graded results
- [ ] Progress persistence across sessions

### Development Approach

**Modular Commits Strategy:**
1. Each major feature = separate commit
2. Test thoroughly before committing  
3. Clear commit messages with context
4. No half-implemented features in commits

**Code Quality:**
- Well-documented functions with JSDoc
- TypeScript interfaces for all props
- Consistent naming conventions
- Minimal dependencies

### Technical Notes

**VizHub Integration:**
- Need to investigate VizHub's code editor component
- Should preserve existing file structure and imports
- May need to proxy file content through API routes

**Performance Considerations:**
- Keyboard listeners should be efficient 
- Auto-save debouncing to avoid spam
- Lazy load visualization images

**Accessibility:**
- Keyboard-only navigation must work perfectly
- Screen reader compatibility for grade status
- High contrast mode support

## File Structure

```
grader-app/
├── app/
│   ├── routes/
│   │   └── home.tsx          # Main grader interface
│   ├── components/
│   │   ├── CodeViewer.tsx    # VizHub integration (planned)
│   │   └── GradeResult.tsx   # Legacy (will remove)
│   └── app.css               # Fullscreen grader styles
└── README.md                 # Usage instructions

benchmarks/
└── results/
    ├── results.csv           # Main results file
    └── grades/               # Individual grader contributions
        └── ej-fox.csv        # Per-grader files
```

## Testing Checklist (Before Committing UI)

- [ ] Grader loads with fullscreen interface
- [ ] Position indicator shows correct count
- [ ] Visualization images display properly
- [ ] Code panel shows placeholder or actual files
- [ ] All keyboard shortcuts work as expected
- [ ] Auto-save functionality works
- [ ] Error states handle gracefully
- [ ] Works in both light/dark modes

## Future Enhancements (Post-MVP)

- [ ] Grade aggregation and consensus calculation
- [ ] Inter-grader agreement metrics
- [ ] Batch operations for multiple results
- [ ] Export functionality for grade reports
- [ ] Challenge description sidebar
- [ ] Filtering by model/challenge type