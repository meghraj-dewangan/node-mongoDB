import express from "express";
import mongoose from "mongoose";

import User from "./User.mjs";


// To connect mongodb 

mongoose.connect("mongodb://localhost:27017")

const db = mongoose.connection;

db.on("open", () => {
    console.log("Connection Successfull")
});

db.on("error", () => {
    console.log("Connection not successfull")
});

const app = new express();

app.use(express.json());  //To parse json from body

const router = express.Router();




//mount the router on /users path
app.use("/users", router);

router.use((req, res, next) => {
    console.log(req.method);
    next();

});

router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: "failed to fetch users" });
    }
});

// Middleware to check if user exists
router.param('id', async (req, res, next, id) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        req.user = user; // Attach user object to request
        next();
    } catch (err) {
        res.status(500).json({ error: 'Error finding user' });
    }
});

// get by id

router.get('/:id', async (req, res) => {
    
       
        res.status(200).json(req.user);
    
});


// To add new User


router.post("/user", async (req, res) => {
    const { firstName, lastName, hobby } = req.body;

    if (!firstName || !lastName || !hobby) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const newUser = await User.create({ firstName, lastName, hobby });

    try {
        const savedUser = newUser.save();
        res.status(201).json({ message: "User added", user: savedUser })

    } catch (err) {
        res.status(500).json({ error: "Failed to add user" });
    }

});



// Delete User by MongoDB ObjectId

router.delete("/user/:id", async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted", user: deletedUser });

    } catch (err) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});


// Update user

router.put("/user/:id", async (req, res) => {
    const { firstName, lastName, hobby } = req.body;

    if (!firstName || !lastName || !hobby) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const updateUser = await User.findByIdAndUpdate(
            req.params.id,
            { firstName, lastName, hobby }, { new: true, runValidators: true }
        );
        if (!updateUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User updated", user: updateUser })
    } catch (err) {
        res.status(500).json({ error: "Failed to update user" });
    }
});







app.listen(5200, () => {
    console.log("server is running on port 5200")
})

