import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

const posts = {};

// QUICK EXAMPLE
// posts === {
// 	'key123': {
// 		id: "postId",
// 		title: "post title",
// 		comments: [
// 			{
// 				id: "comment id",
// 				content: 'post comment'
// 			}
// 		]
// 	} 
// }

app.get('/posts', (req, res) => {
	res.status(201).json(posts)
})

app.post('/events', (req, res) => {
	const { type, data } = req.body;

	if (type === 'PostCreated') {
		const { id, title } = data;
		posts[id] = { id, title }
		posts[id].comments = []
	}

	if (type === 'CommentCreated') {
		const { id, content, postId, status } = data;

		const post = posts[postId];

		post?.comments.push({ id, content, status })
	}

	if (type === 'CommentUpdated') {
		const { id, postId } = data;

		if (posts[postId].comments.length > 0) {
			let commentFound = posts[postId].comments.find(comment => 
				comment.id === id
			);
	
			commentFound = { ...data }
		}
	}

	console.log('EVENTS QUERIED SERVICE: ', type)
	res.status(200).json({})
})

app.listen(4002, () => {
	console.log('Query service is running on 4002')
})