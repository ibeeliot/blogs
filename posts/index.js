import express from 'express'
import crypto from 'crypto'
import cors from 'cors'
import axios from 'axios';

const app = express();

app.use(cors());
app.use(express.json());

const posts =  {};

app.get('/posts', (req, res) => {
	res.send(posts);
})

app.post('/posts', async (req, res) => {
	const id = crypto.randomBytes(4).toString('hex');

	const { title } = req.body;

	posts[id] = {
		id,
		title
	}

	// adding to event bus
	await axios.post('http://localhost:4005/events', {
		type: "PostCreated",
		data: {
			...posts[id]
		}
	})

	res.status(201).send(posts[id]);
})

app.post('/events', (req, res) => {
	console.log('RECEIVED EVENT', req.body.type);

	res.status(200).json({})
})

app.listen(4000, () => {
	console.log('Posts listening on 4000')
})