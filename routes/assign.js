var express = require("express");
var router = express.Router();
const objId = require("mongoose").Types.ObjectId;

const { StudentsDetails, MentorsDetails } = require("../models/schema");

// Assigning multiple students to a mentor
router.patch("/students", async(req, res) => {
    console.log("assignMentorToStudent");
    const { mentorId, studentsArray } = req.body;
    //req -> has mentor id + studentsId
    try {
        //updating studentList in mentor document.
        const mentorData = await MentorsDetails.findById(mentorId);
        // console.log(mentorData);
        // console.log(mentorData.studentAssigned);
        if (mentorData) {
            const assign = await MentorsDetails.findOneAndUpdate({ mentorId }, { $set: { studentAssigned: studentsArray } });
            // console.log(assign);
            //adding mentor to all respective students
            studentsArray.map(async(stud_id) => {
                const result = await StudentsDetails.findById(stud_id);
                result.mentorAssigned = mentorId;
                result.save();
            });
        } else {
            res.status(400).send("No mentor found");
        }

        res.status(200).json({
            message: "Selected one mentor and Added to multiple students",
            mentorData,
        });
    } catch (error) {
        console.log(error, "error in assign mentor route");
        res.status(400).send(error);
    }
});

router.patch("/mentor", async(req, res) => {
    const { studentId, mentorId } = req.body;
    try {
        let studentData = await StudentsDetails.findById(studentId);
        const oldMentorId = studentData.mentorAssigned;
        studentData.mentorAssigned = mentorId;
        studentData.save();

        // Removing student from Old mentor ID.
        let oldMentor = await MentorsDetails.findById(oldMentorId);

        if (oldMentor.studentAssigned.length < 0) {
            console.log("Old Mentor");
            return;
        } else {
            let newAssigned = oldMentor.studentAssigned;
            const indexOfStudent = newAssigned.indexOf(objId(studentId));
            console.log(indexOfStudent, "index");
            newAssigned.pop(indexOfStudent);
            console.log(newAssigned);
            oldMentor.studentAssigned = newAssigned;
        }

        oldMentor.save();

        //add the studentId in newMentor student Assigned list.
        let newMentor = await MentorsDetails.findById(mentorId);
        if (newMentor.studentAssigned.length < 0) {
            return;
        } else {
            if (!newMentor.studentAssigned.includes(studentId)) {
                newMentor.studentAssigned = [
                    ...newMentor.studentAssigned,
                    studentId,
                ];
            }
        }
        newMentor.save();

        res.status(200).json({
            message: "Updated mentor to respective student , updated in old mentor and new mentor studentAssigned list",
            newMentor,
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;