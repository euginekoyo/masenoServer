// middleware/authorize.js
const authorize = (allowedRoles = []) => {
    if (typeof allowedRoles === 'string') {
      allowedRoles = [allowedRoles];
    }
  
    return (req, res, next) => {
      const userRole = req.user.role; // Get the role from the authenticated user
  
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Access denied.' });
      }
  
      next();
    };
  };
  
  export default authorize;
  