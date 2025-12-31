import { getAuth } from '@clerk/nextjs/server'

/**
 * Get the current user ID from Clerk auth
 */
export async function getCurrentUserId() {
  const { userId } = await getAuth()
  return userId
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const { userId } = await getAuth()
  return !!userId
}

/**
 * Get user email (if available)
 */
export async function getUserEmail() {
  const auth = await getAuth()
  return auth.user?.primaryEmailAddress?.emailAddress
}

/**
 * Get user name (if available)
 */
export async function getUserName() {
  const auth = await getAuth()
  const firstName = auth.user?.firstName
  const lastName = auth.user?.lastName
  return firstName || lastName ? `${firstName} ${lastName}`.trim() : null
}

/**
 * Get user image URL (if available)
 */
export async function getUserImage() {
  const auth = await getAuth()
  return auth.user?.imageUrl || null
}
