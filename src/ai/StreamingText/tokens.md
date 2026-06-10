# Tokens — `StreamingText`

| Token | Used for |
|---|---|
| `color.iris.streamhead` | blinking cursor colour |

Inherits text colour from its container — by design, the streaming text should match the surrounding `prose` styling.

Under reduced motion (`useReducedMotion()` from `MotionProvider`, DS v4.4 workstream E) the cursor is not rendered and tokens reveal immediately — `color.iris.streamhead` is unused in that mode.
