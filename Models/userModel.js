const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ObjectId = mongoose.Schema.Types.ObjectId;

const SALT_ROUNDS = 11;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    password: {
        type: String,
        required: true
    },
    notes: [{
        type: ObjectId,
        ref: "Note"
    }],
});

userSchema.pre('save', function(next) {
    bcrypt.hash(this.password, SALT_ROUNDS, (err, hash) => {
        if(err) {
            return next(err);
        }

        this.password = hash;
        next();
    })
});

userSchema.verifyPW = function(plainTextPW, cb) {
    return bcrypt.compare(plainTextPW, this.password, cb)
};

module.exports = mongoose.model("User", userSchema);