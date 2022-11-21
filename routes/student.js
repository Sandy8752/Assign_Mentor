var express = require("express");
var router = express.Router();
const { StudentsDetails } = require("../models/schema");

/* GET users listing. */
router.get("/", async(req, res) => {
    try {
        const data = await StudentsDetails.find();
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

router.post("/add", async(req, res) => {
    const { name, email, course, mentorAssigned } = req.body;

    const dbData = await StudentsDetails.findOne({ email: email });

    try {
        if (!dbData) {
            const data = await StudentsDetails.create({
                name: name,
                email: email,
                course: course,
                mentorAssigned: mentorAssigned ? mentorAssigned : null,
            });
            res.status(200).send(data);
        } else {
            res.status(400).send("Email already exists");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

// List of students with no mentors.
router.get("/no-mentor", async(req, res) => {
    try {
        const data = await StudentsDetails.find({ mentorAssigned: null });
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;