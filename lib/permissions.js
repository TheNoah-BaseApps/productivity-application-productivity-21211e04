export function hasPermission(userRole, allowedRoles) {
  if (!userRole || !allowedRoles) return false;
  
  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(userRole);
  }
  
  return userRole === allowedRoles;
}

export function canApproveLeaves(userRole) {
  return hasPermission(userRole, ['admin', 'manager']);
}

export function canManageTasks(userRole) {
  return hasPermission(userRole, ['admin', 'manager']);
}

export function canViewAllData(userRole) {
  return hasPermission(userRole, ['admin', 'manager']);
}

export function canDeleteUser(userRole) {
  return hasPermission(userRole, ['admin']);
}

export function canManageMilestones(userRole) {
  return hasPermission(userRole, ['admin', 'manager']);
}

export const ROLE_HIERARCHY = {
  admin: 3,
  manager: 2,
  employee: 1,
};

export function hasHigherRole(userRole, targetRole) {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const targetLevel = ROLE_HIERARCHY[targetRole] || 0;
  return userLevel > targetLevel;
}