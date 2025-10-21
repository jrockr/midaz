# Phase 2 Quick Reference & Checklists

**Quick Links**:
- 📚 [Step-by-Step Guide](./PHASE2_IMPLEMENTATION_STEP_BY_STEP.md)
- ✅ [Master Checklist](./MASTER_PHASE2_CHECKLIST.md)
- 📋 [Detailed Implementation](./PHASE2_DETAILED_IMPLEMENTATION.md)
- 🎯 [Overview & Resumption](./PHASE2_OVERVIEW_AND_RESUMPTION.md)

---

## ⚡ Start Here (First Component)

### Component: MetadataEditor
**File**: `app/components/common/MetadataEditor.vue`

**What it does**: Read-only and editable JSON viewer for metadata

**Time**: 2 hours

**Setup**:
```bash
# Create file
touch app/components/common/MetadataEditor.vue

# Open in editor
code app/components/common/MetadataEditor.vue
```

**Template Structure**:
```vue
<template>
  <div class="rounded-lg bg-gray-900 text-white p-4">
    <!-- Read-only or editable JSON display -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue?: Record<string, any>
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readonly: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
}>()

// Component logic
</script>
```

**Key Implementations**:
1. Display JSON with syntax highlighting
2. Copy to clipboard button
3. Download as file button
4. Expand/collapse sections
5. JSON validation (edit mode only)

---

## 📝 Component Checklist Template

Use this for each component:

```markdown
## Component: [Name]
**File**: `app/components/[folder]/[Name].vue`
**Time**: X hours
**Status**: ⏳ Not Started / 🔄 In Progress / ✅ Complete

### Implementation Checklist
- [ ] File created
- [ ] Props defined with TypeScript
- [ ] Emits defined
- [ ] Template structure
- [ ] Reactive state (ref/reactive)
- [ ] Computed properties
- [ ] Methods/handlers
- [ ] Event handlers
- [ ] Styling (Tailwind)
- [ ] Mobile responsive
- [ ] Accessibility (ARIA)
- [ ] TypeScript strict mode
- [ ] No console errors
- [ ] Tested in browser
- [ ] Committed to git

### Components Used
- Input
- Button
- Card
- (others)

### Store Integration
- (which stores/actions used)

### Testing
- [ ] Renders without props
- [ ] Renders with sample props
- [ ] Mobile view (F12 toggle)
- [ ] Dark mode (if applicable)
- [ ] Keyboard navigation
- [ ] Error states

### Notes
- (any special considerations)
```

---

## 🔄 Daily Workflow

### Morning: Get Oriented
1. Open `MASTER_PHASE2_CHECKLIST.md`
2. Find first ⏳ task
3. Open relevant section in `PHASE2_IMPLEMENTATION_STEP_BY_STEP.md`
4. Run `npm run dev` and check console

### Working: Implementation
1. Create component file
2. Add TypeScript structure
3. Build template
4. Add reactive state
5. Add event handlers
6. Style with Tailwind
7. Test in browser
8. Fix issues

### End of Day: Commit
```bash
# Check what changed
git status

# Add changes
git add app/components/...

# Commit with clear message
git commit -m "feat: Add [ComponentName]

- [Description]
- [Features]"

# Push
git push origin main

# Update checklist
vim MASTER_PHASE2_CHECKLIST.md
# Mark component as ✅ Complete
```

---

## 🎨 Code Style Reference

### Component Template
```vue
<template>
  <div class="space-y-4">
    <!-- main content -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ComponentType } from '@/types'

// Props
interface Props {
  title?: string
  loading?: boolean
  items: ComponentType[]
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

// Emits
const emit = defineEmits<{
  select: [item: ComponentType]
  delete: [id: string]
}>()

// State
const selectedId = ref<string | null>(null)
const formData = reactive<Record<string, any>>({})

// Computed
const selectedItem = computed(() => 
  props.items.find(item => item.id === selectedId.value)
)

// Lifecycle
onMounted(() => {
  // Init logic
})

// Methods
const handleSelect = (item: ComponentType) => {
  selectedId.value = item.id
  emit('select', item)
}

const handleDelete = async (id: string) => {
  emit('delete', id)
}
</script>

<style scoped>
/* Component-specific styles */
</style>
```

### Page Template
```vue
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold">Page Title</h1>
      <p class="text-gray-600 mt-1">Description</p>
    </div>

    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />

    <!-- Main Content -->
    <ComponentName />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/stores'

const router = useRouter()
const store = useStore()

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Current', to: '/current' },
]
</script>
```

---

## 📊 Progress Tracking

### Daily Update Template
Save as `docs/PHASE2_DAILY_PROGRESS.md`:

```markdown
# Phase 2 Daily Progress

## Day 1 (Oct 21)
- MetadataEditor: ✅ DONE
- OrganizationForm: 🔄 60% (4/6 hours)
- Status: On track

## Day 2 (Oct 22)
- OrganizationForm: ✅ DONE
- OrganizationsTable: 🔄 30% (1.5/5 hours)
- Status: On track

## Day 3 (Oct 23)
- (continue pattern)
```

### Weekly Update Template
At end of each week, update `IMPLEMENTATION_PROGRESS.md`:

```markdown
## Week 1 (Oct 21-27)
**Status**: 🟢 ON TRACK
**Completion**: 5/16 components (31%)
**Hours Invested**: 20/80
**Est. Remaining**: 60 hours

### Completed
- MetadataEditor ✅
- OrganizationForm ✅
- OrganizationsTable ✅
- OrganizationsList ✅
- Org List Page ✅

### In Progress
- Org Create Page

### Blockers
- None

### Next Week Plan
- Complete Organization module (4 components)
- Start Ledgers module
```

---

## 🐛 Common Git Issues & Fixes

### Need to undo last commit
```bash
git reset --soft HEAD~1
# Files are staged, ready to modify and recommit
```

### Accidental commit on wrong branch
```bash
git branch -m wrong-branch-name
git checkout -b correct-branch-name
git push -u origin correct-branch-name
```

### Check what changed since last commit
```bash
git diff HEAD
```

### View commit history
```bash
git log --oneline -n 10
```

### Revert last commit completely
```bash
git reset --hard HEAD~1
git push origin main --force-with-lease
```

---

## 💾 Storage & File Management

### Save Form Data to localStorage (Auto-Save Example)

```typescript
import { useStorage } from '@vueuse/core'

// In component
const formData = useStorage('form-org-create', {
  name: '',
  email: '',
  legalName: '',
})

// Automatically saves to localStorage
// Load on next page load

// Clear after successful submit
const handleSubmit = async () => {
  await submit()
  localStorage.removeItem('form-org-create')
}
```

### Download File (Export JSON Example)

```typescript
const downloadJSON = (data: any, filename: string) => {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// Usage
downloadJSON(organization, `organization-${organization.id}.json`)
```

---

## 🎯 Quick Decision Tree

```
Starting a new component?
├─ New?
│  ├─ Yes → Create file, start with template structure
│  └─ No → Edit existing, preserve old code
├─ Using props?
│  ├─ Yes → Define interface, use withDefaults
│  └─ No → Skip
├─ Emitting events?
│  ├─ Yes → Define emits interface
│  └─ No → Skip
├─ Need reactive state?
│  ├─ Yes → Use reactive() for objects, ref() for primitives
│  └─ No → Use computed only
├─ Need API call?
│  ├─ Yes → Create loading ref, handle error
│  └─ No → Skip error handling
└─ Responsive needed?
   ├─ Yes → Use Tailwind grid/flex responsive classes
   └─ No → Use fixed classes only
```

---

## 📱 Mobile Testing Checklist

After each component, verify mobile:

- [ ] Tap targets are 48x48px minimum
- [ ] Text is readable (16px minimum)
- [ ] No horizontal scroll needed
- [ ] Forms are single column
- [ ] Buttons are below-the-fold
- [ ] Dropdowns don't overflow screen
- [ ] No console errors on mobile

**Test with**:
```bash
npm run dev
# Open DevTools (F12)
# Toggle "Toggle device toolbar" (Ctrl+Shift+M)
# Test on different device sizes
```

---

## 🔐 TypeScript Strict Mode Tips

### Avoid 'any' Type
```typescript
// ❌ BAD
const data: any = response.data

// ✅ GOOD
interface Organization {
  id: string
  name: string
}
const data: Organization = response.data
```

### Optional Properties
```typescript
// ✅ GOOD
interface Form {
  name: string        // required
  email?: string      // optional
  metadata?: Record<string, any>
}
```

### Type Guards
```typescript
// ✅ GOOD
if (organization && organization.id) {
  // Use organization.id safely
}

// Better
if (organization?.id) {
  // Use organization.id safely
}
```

---

## 🚀 Performance Tips

### Debounce Search Input
```typescript
import { useDebounceFn } from '@vueuse/core'

const debouncedSearch = useDebounceFn(() => {
  // Make API call
}, 300) // 300ms delay

const handleSearchChange = (value: string) => {
  searchQuery.value = value
  debouncedSearch()
}
```

### Lazy Load Images
```vue
<img v-lazy="imageUrl" alt="..." />
```

### Virtual Scrolling for Long Lists
```vue
<VirtualScroller :items="items" :item-height="60">
  <template #default="{ item }">
    <ItemComponent :item="item" />
  </template>
</VirtualScroller>
```

---

## 📚 Documentation Template

Add to each component's JSDoc:

```typescript
/**
 * OrganizationForm component
 * 
 * Provides a form interface for creating and editing organizations.
 * Includes validation, auto-save to localStorage, and metadata editor.
 * 
 * @component
 * @example
 * <OrganizationForm 
 *   :isLoading="false"
 *   :isEditing="false"
 *   @submit="handleSubmit"
 *   @cancel="goBack"
 * />
 * 
 * @prop {boolean} [isLoading=false] - Show loading state during submission
 * @prop {boolean} [isEditing=false] - Set to true when editing existing data
 * @prop {Organization} [initialData] - Pre-fill form with existing data
 * 
 * @emit submit - Fired when form is submitted with valid data
 * @emit cancel - Fired when user clicks cancel button
 */
export default {
  name: 'OrganizationForm',
  props: { /* ... */ },
  emits: { /* ... */ },
}
```

---

## 🎓 Key Learning Resources

### For Vue 3 Composition API
- Official Vue docs: https://vuejs.org/guide/
- Composition API: https://vuejs.org/guide/extras/composition-api-faq.html

### For Tailwind CSS
- Documentation: https://tailwindcss.com/docs
- Component examples: https://ui.shadcn.com/

### For TypeScript
- Handbook: https://www.typescriptlang.org/docs/
- React+TS patterns apply: https://www.typescriptlang.org/docs/handbook/react.html

---

## 🎯 Success Milestones

- 🟨 After Component 1: Understand pattern
- 🟨 After Component 3: Can build without reference
- 🟩 After Component 5: Comfortable with workflow
- 🟩 After Component 10: Building efficiently
- 🟩 After Component 16: Ready for Phase 3

---

**Last Updated**: October 21, 2025  
**Status**: 📖 Reference Guide Complete  
**Ready for**: Phase 2 Implementation
