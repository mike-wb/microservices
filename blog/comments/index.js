const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];
    const status = 'pending';

    comments.push({id: commentId, content, status});

    commentsByPostId[req.params.id] = comments;

    await axios.post(`http://localhost:4005/events`, {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status
        }
    }).catch((err) => {
        console.error('comments:', err.message);
    });

    res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    const { type, data } = req.body;
    console.log('comments: EVENT:', type);

    if (type === 'CommentModerated') {
        const { id, content, postId, status } = data;

        const comments = commentsByPostId[postId];
        const comment = comments.find(comment => {
            return comment.id === id;
        })
        comment.status = status;

        await axios.post(`http://localhost:4005/events`, {
            type: 'CommentUpdated',
            data: {
                id,
                postId,
                status,
                content
            }
        }).catch((err) => {
            console.error('status:', err.message);
        });
    }    
    res.send({});
});

app.listen(4001, () => {
    console.log('comments: listening on http://localhost:4001');
});
