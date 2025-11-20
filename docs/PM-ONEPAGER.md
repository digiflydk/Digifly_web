# One-Pager: [Feature/Project Title]

> **Owner:** `[Name]` | **Status:** `[Draft/In Review/Approved]` | **Date:** `YYYY-MM-DD`

---

## 1. The Problem
*A single, clear sentence stating the core problem.*

*(Example: "Our current navigation editor is difficult to use, error-prone, and does not support reordering links, leading to a frustrating experience for content managers.")*

## 2. The Opportunity
*Why is solving this problem valuable? What does it unlock?*

*(Example: "By building a modern, drag-and-drop navigation editor, we can reduce support tickets by 50%, speed up content updates, and lay the foundation for more advanced menu structures.")*

## 3. The Solution
*A concise, high-level description of the proposed solution.*

*(Example: "A new admin interface at `/dadmin/navigation` will allow users to add, edit, and reorder header and footer links using a drag-and-drop UI. All changes will be saved to the single `site/navigation` Firestore document via a Server Action.")*

### Key Features
- Drag-and-drop reordering for links.
- A unified editor for both header and footer menus.
- Clear separation between internal page links and external URLs.
- Real-time validation to prevent broken links.

### Out of Scope
- Multi-level (dropdown) navigation.
- Per-page navigation overrides.

## 4. Success Metrics
*How will we know we've succeeded?*

1.  **Metric 1:** `[e.g., Time to update a navigation link is reduced from 5 minutes to under 1 minute.]`
2.  **Metric 2:** `[e.g., 100% of acceptance tests for navigation writes and reads pass.]`
3.  **Metric 3:** `[e.g., Zero support requests related to navigation editing within 30 days of launch.]`

## 5. Risks
*What are the biggest risks or open questions?*

- **Risk 1:** `[e.g., The drag-and-drop library might have accessibility issues.]`
- **Mitigation:** `[e.g., Select a library with strong accessibility support and perform manual keyboard testing.]`
