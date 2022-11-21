var express = require("express");
var router = express.Router();
const { MentorsDetails } = require("../models/schema");

/* GET users listing. */
router.get("/", async function(req, res, next) {
    try {
        const data = await MentorsDetails.find();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post("/add", async(req, res) => {
    const { name, email, expertise, studentAssigned } = req.body;

    const dbData = await MentorsDetails.findOne({ email: email });
    try {
        if (!dbData) {
            const data = await MentorsDetails.create({
                name: name,
                email: email,
                expertise: expertise,
                studentAssigned: studentAssigned,
            });
            res.status(200).send(data);
        } else {
            res.status(400).send("Email already exists");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Show all students for a particular mentor.
router.get("/:id", async(req, res) => {
    const { id } = req.params;
    try {
        const data = await MentorsDetails.findById(id).populate(
            "studentAssigned",
            "name"
        );
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

module.exports = router;