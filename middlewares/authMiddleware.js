// middleware/auth.js
import jwt from 'jsonwebtoken';
import {User} from '../models/User.js';

const authenticate = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Assuming the token is in the format "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    req.userId = decoded.id; // Assuming you set the user ID in the token payload
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    req.user = {
      id: user.id,
      username: user.username,
      role: user.role, // Set the role in the request object
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export default authenticate;
