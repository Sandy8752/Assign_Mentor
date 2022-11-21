const { Schema, model } = require("mongoose");
const validator = require("validator");

const studentsSchema = new Schema({
    name: {
        type: "string",
        required: true,
    },
    email: {
        type: "string",
        required: true,
        lowercase: true,
        validate: (value) => {
            return validator.isEmail(value);
        },
    },
    course: {
        type: "string",
        required: true,
    },
    mentorAssigned: {
        type: Schema.Types.ObjectId,
        ref: "mentors",
        default: null,
    },
});

const mentorsSchema = new Schema({
    name: {
        type: "string",
        required: true,
    },
    email: {
        type: "string",
        required: true,
        lowercase: true,
        validate: (value) => {
            return validator.isEmail(value);
        },
    },
    expertise: {
        type: "string",
        required: true,
    },
    studentAssigned: [{
        type: Schema.Types.ObjectId,
        ref: "students",
        default: null,
    }, ],
});

const StudentsDetails = model("students", studentsSchema);
const MentorsDetails = model("mentors", mentorsSchema);

module.exports = { StudentsDetails, MentorsDetails };