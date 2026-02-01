import { createRouter, createRootRoute, createRoute, createHashHistory } from '@tanstack/react-router'
import App from './App'

// Root route - the layout wrapper
const rootRoute = createRootRoute({
  component: App
})

// Index redirects to conversations
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw { redirect: { to: '/conversations' } }
  }
})

// Conversations list (corpus view)
const conversationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/conversations'
})

// Single conversation
const conversationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/conversations/$slug'
})

// Readings list (future)
const readingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/readings'
})

// Single reading (future)
const readingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/readings/$slug'
})

// Route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  conversationsRoute,
  conversationRoute,
  readingsRoute,
  readingRoute
])

// Create hash history for GitHub Pages
const hashHistory = createHashHistory()

// Create router
export const router = createRouter({
  routeTree,
  history: hashHistory,
  defaultPreload: 'intent'
})
