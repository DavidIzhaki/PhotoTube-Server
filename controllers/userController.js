import userService from '../services/userService.js';
import tokenService from '../services/tokenService.js';
import videoService from '../services/videoService.js';
import commentService from '../services/commentService.js'

// 201 Created: The request has succeeded and a new resource has been created as a result.
// 400 Bad Request: The server could not understand the request due to invalid syntax.
// 404 Not Found: The server can not find the requested resource.
// 500 Internal Server Error: The server encountered an unexpected 
//     condition that prevented it from fulfilling the request.


const createUser = async (req, res) => {
    try {
        const { username, password, gender, displayname, profileImg } = req.body;
        const user = await userService.createUser(username, password,displayname,gender , profileImg);
        if(user){
            res.status(201).json({ message: 'User created successfully'});
        }
    } catch (error) {
        if (error.message === 'Username already taken') {
            return res.status(400).json({ message: error.message });
        }
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
};

const getUser = async (req, res) => {

    try {
        const userId = req.params.id;
        const user = await userService.getUser(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }


        const UserData = {
            displayname: user.displayname,
            profileImg: user.profileImg,
            videoList: user.videoList,
        };

        res.send(UserData); // Send only the selected user data
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).send({ message: "Internal server error" });
    }
}

const getInfoUser = async (req, res) => {

    try {
        const userId = req.params.id;
        const user = await userService.getUser(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        

        const UserData = {
            username: user.username,
            password: user.password,
            displayname: user.displayname,
            gender: user.gender,
            profileImg: user.profileImg,      
        };

        res.send(UserData); // Send only the selected user data
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).send({ message: "Internal server error" });
    }
}

const isExist = async (req, res) => {
    try {
        const { username } = req.query;
       
        if (!username) {
            return res.status(400).json({ message: 'Username query parameter is required.' });
        }
        const isAvailable = await userService.isExist(username);
        res.status(201).json({ exists: isAvailable });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

function isLoggedIn(req, res, next) {
    // If the request has an authorization header
    if (req.headers.authorization) {
        // Extract the token from that header
        const token = req.headers.authorization.split(" ")[1];
        try {
            // Verify the token is valid
            const data = tokenService.verifyJwt(token);
            req.user = data;
            // Token validation was successful. Continue to the actual function (index)
            return next()
        } catch (err) {
            return res.status(401).json("Invalid Token");
        }
    }
    else
        return res.status(403).send('Token required');
}

const updateUser = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { displayname,password, gender, profileImg } = req.body;
       console.log(gender)
        // Prepare the update object based on provided data
        const updateData = {};
        if (displayname) updateData.displayname = displayname;
        if (password) updateData.password = password;
        if (gender) updateData.gender = gender;
        if (profileImg) updateData.profileImg = profileImg;
        
        const updatedUser = await userService.updateUser(userId, updateData);

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
       
      
        res.status(201).json({
            message: "User updated successfully",
            user: {
                displayname: updatedUser.displayname,
                profileImg: updatedUser.profileImg,
                videoList: updatedUser.videoList,
            }
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.user.id; 
           // Delete all comments associated with the video
           await commentService.deleteCommentsByUserId(userId);
       await videoService.deleteVideosByUserId(userId); 
        const deletedUser = await userService.deleteUser(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



async function login(req, res) {
    const user = await userService.login(req.body.username, req.body.password)
    if (user) {
        const token = tokenService.createToken(user._id)
        res.json({ result: 'Success', token: token,  userId: user._id })
    }
    else {
        res.json({ result: 'Failure', reason: 'Invalid username or password' })
    }
}

export default { 
          createUser,
          getUser,
          isExist ,
          login,
          updateUser,
          isLoggedIn,
          getInfoUser,
          deleteUser,
        };


