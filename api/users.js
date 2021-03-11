const express = require('express');
const usersRouter = express.Router()

usersRouter.post('/register', async (req, res, next) => {
  const { username, password } = req.user;
  console.log(req)
  try {
    const testUser = await getUserByUsername(username);
    if (testUser) {
      next({
        name: 'UserExistsError',
        message: 'A user by that username already exists'
      });
    }
    if (password.length < 8) {
      throw Error('Password is too short, it must be at least 8 characters long.');
    }
    // const hashedPassword = bcrypt.hashSync(password, 10)
    const createdUser = await createUser({username, password});
    console.log(createdUser)
    res.send(createdUser);
  } catch ({ name, message }) {
    next({ name, message })
  } 
});
-

usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    next({
      name: "Missing Credentials Error",
      message: "Please supply both a username and password"
    });
  }
  try {
    const user = await getUserByUsername(username);
    if (user && user.password == password) {
      const token = jwt.sign(
        {
          id: user.id, 
          username
        }, 
          process.env.JWT_SECRET
        );
      res.send({ message: "you're logged in!", 'token': token });
    } else {
      next({ 
        name: 'Incorrect Credentials Error', 
        message: 'Username or password is incorrect'
      });
    }
  } catch(error) {
    console.log(error);
    next(error);
  }
});

module.exports = usersRouter;