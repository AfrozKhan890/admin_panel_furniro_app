export {}

// Create a type for the roles
export type Roles = 'admin' | 'superadmin'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}