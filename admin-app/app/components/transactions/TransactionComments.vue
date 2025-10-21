<script setup lang="ts">
import { ref } from 'vue'

interface Comment {
  id: string
  author: string
  text: string
  timestamp: string
  avatar: string
}

const comments = ref<Comment[]>([
  { id: '1', author: 'John Doe', text: 'This transaction looks good', timestamp: new Date().toISOString(), avatar: '👤' },
  { id: '2', author: 'Jane Smith', text: 'Please verify amounts', timestamp: new Date(Date.now() - 300000).toISOString(), avatar: '👥' }
])

const newComment = ref('')

const addComment = () => {
  if (!newComment.value) return
  comments.value.unshift({
    id: String(Date.now()),
    author: 'Current User',
    text: newComment.value,
    timestamp: new Date().toISOString(),
    avatar: '👤'
  })
  newComment.value = ''
}

const formatTime = (ts: string) => {
  const date = new Date(ts)
  const now = new Date()
  const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000)
  if (diffMins < 1) return 'now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  return date.toLocaleDateString()
}
</script>

<template>
  <div class="space-y-4">
    <h3 class="font-semibold text-gray-900">Comments</h3>

    <!-- Comments List -->
    <div class="space-y-3 max-h-64 overflow-y-auto">
      <div v-for="comment in comments" :key="comment.id" class="flex gap-3 text-sm">
        <span class="text-2xl">{{ comment.avatar }}</span>
        <div class="flex-1">
          <p class="font-medium text-gray-900">{{ comment.author }}</p>
          <p class="text-gray-700 mt-1">{{ comment.text }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ formatTime(comment.timestamp) }}</p>
        </div>
      </div>
    </div>

    <!-- Add Comment -->
    <div class="flex gap-2 pt-4 border-t border-gray-200">
      <input
        v-model="newComment"
        type="text"
        placeholder="Add a comment..."
        @keyup.enter="addComment"
        class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button @click="addComment" class="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
        Post
      </button>
    </div>
  </div>
</template>
