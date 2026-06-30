# Scroll to loaded desktop operation history

Date: 2026-06-30 23:09
Scope: desktop
Branch: fix/desktop-history-scroll

## Goal

Bring the loaded operation-history card into view when the user selects Load history.

## Context

Operation history renders below the main package workflow. Loading it does not currently move the viewport, so users can miss the results.

## Plan

1. Attach a renderer ref to the operation-history card.
2. Smoothly scroll to the card after non-empty history is rendered.
3. Preserve initial-load, empty-history, and failed-load behavior and run desktop validation.

## Acceptance criteria

- Loading one or more history records scrolls the rendered history card into view.
- Initial rendering and empty history do not trigger scrolling.
- Existing desktop type, lint, and unit checks pass.

## Validation commands

- `npm run typecheck`
- `npm run lint`
- `npm run test`

## Risks

- Repeated successful loads will scroll to the card again, matching the explicit user action.

## Rollback plan

Revert the history ref and post-render scroll effect to restore the previous static viewport behavior.
