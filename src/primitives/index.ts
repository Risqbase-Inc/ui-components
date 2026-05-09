// Primitives — INTERNAL ONLY. Not re-exported from the package root.
//
// This file is intentionally not listed in tsup's entry points or in
// package.json `exports`. Future inhabitants (Slot, useId, VisuallyHidden,
// composeRefs, etc.) are consumed by other domains within the package
// only — they are implementation details, not part of the public API.
//
// Adding to this folder does NOT widen the package surface area.

export {}
