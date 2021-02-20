const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    description: {
        type: String,
    },

    imageId: {
        type: String,
    },

    userId: {
        type: String,
    },

    creationDate: {
        type: Date,
        default: Date.now,
    },

    updateDate: {
        type: Date,
        default: Date.now,
    },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
