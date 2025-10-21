# Vue 3 Component Errors - Quick Reference Guide

## Session 4 Fixes Summary

### Issue #1: Modal Fragment Props Warning
**Symptom:**
```
[Vue warn]: Extraneous non-props attributes (modelValue) were passed to component 
but could not be automatically inherited because component renders fragment or text 
or teleport root nodes.
```

**Root Cause:**
Modal component uses `<teleport>` which Vue treats as a fragment. Fragments don't auto-inherit non-props attributes.

**Fix:**
```typescript
// Add to Modal.vue <script setup>
defineOptions({
  inheritAttrs: false,
})
```

**File:** `admin-app/app/components/common/Modal.vue`

---

### Issue #2: Input Component Error Prop Type Error
**Symptom:**
```
[Vue warn]: Invalid prop: type check failed for prop "error". 
Expected String, got Boolean with value false.
```

**Root Cause:**
Error prop expects string but receives boolean when falsy values are passed.

**Fix:**
```typescript
// In inputClasses computed property
const errorMsg = typeof props.error === 'string' ? props.error : ''
if (errorMsg) { ... }

// In template
<p v-if="error && typeof error === 'string'" class="...">{{ error }}</p>
```

**File:** `admin-app/app/components/common/Input.vue`

---

### Issue #3: OrganizationForm ReferenceError
**Symptom:**
```
Uncaught (in promise) ReferenceError: organization is not defined
  at OrganizationForm.vue:52:3
```

**Root Cause:**
Unhandled error in localStorage access during mounted hook.

**Fix:**
```typescript
onMounted(() => {
  if (props.organization) {
    // ... initialize with props
  } else {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        Object.assign(formData, parsed)
        metadataJson.value = JSON.stringify(parsed.metadata || {}, null, 2)
      }
    } catch (e) {
      console.error('Failed to load form draft:', e)
    }
  }
})
```

**File:** `admin-app/app/components/organizations/OrganizationForm.vue`

---

## Common Vue 3 Component Patterns

### Pattern 1: Handling Fragment Components
When a component renders via `<teleport>` or returns fragments, use:
```typescript
defineOptions({
  inheritAttrs: false,
})
```

### Pattern 2: Type-Safe Props
Always validate prop types in computed properties:
```typescript
const computed = computed(() => {
  const safeValue = typeof prop === 'ExpectedType' ? prop : defaultValue
  // use safeValue
})
```

### Pattern 3: Error Handling in Lifecycle Hooks
Always wrap potential errors in try-catch:
```typescript
onMounted(() => {
  try {
    // risky operations
  } catch (e) {
    console.error('Error in onMounted:', e)
  }
})
```

---

## Testing Commands

```bash
# Run dev server and check console
npm run dev

# Type checking
npm run type-check

# Build
npm run build
```

---

## Related Components Using Similar Patterns

| Component | Pattern | Status |
|-----------|---------|--------|
| Modal.vue | Fragment (teleport) | ✅ Fixed |
| Input.vue | Prop validation | ✅ Fixed |
| Button.vue | Basic component | ✅ OK |
| Table.vue | Slot-based | ✅ OK |
| Card.vue | Basic component | ✅ OK |
| Alert.vue | Basic component | ✅ OK |
| Spinner.vue | Basic component | ✅ OK |
| Badge.vue | Basic component | ✅ OK |

---

## Prevention Checklist

- [ ] Use `defineOptions({ inheritAttrs: false })` for fragment components
- [ ] Always type-check computed properties
- [ ] Wrap lifecycle hooks in try-catch for risky operations
- [ ] Test with Vue DevTools console open
- [ ] Run `npm run type-check` before commits
- [ ] Validate all prop types in components
- [ ] Use strict mode in TypeScript config

---

## Additional Resources

### Vue 3 Fragment Documentation
https://vuejs.org/guide/extras/render-function.html#fragments

### Teleport Component
https://vuejs.org/guide/built-ins/teleport.html

### Composition API Error Handling
https://vuejs.org/guide/essentials/lifecycle.html

---

*Generated: 2024-10-21*  
*Phase: 3 - Admin Application Development*
