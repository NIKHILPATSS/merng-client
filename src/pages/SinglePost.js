import gql from 'graphql-tag';
import React, { useContext, useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
	Button,
	Card,
	Form,
	Grid,
	Icon,
	Image,
	Label,
	Popup,
} from 'semantic-ui-react';
import moment from 'moment';
import LikeButton from '../components/LikeButton';
import { AuthContext } from '../context/auth';
import DeleteButton from '../components/DeleteButton';

const SinglePost = (props) => {
	const postId = props.match.params.postId;

	const { user } = useContext(AuthContext);

	const commentInputRef = useRef(null);

	const [comment, setComment] = useState('');

	const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
		variables: {
			postId,
		},
	});

	const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
		update() {
			setComment('');
			commentInputRef.current.blur();
		},
		variables: {
			postId,
			body: comment,
		},
	});

	const deletePostCallback = () => {
		props.history.push('/');
	};

	let postMarkup;

	if (!getPost) {
		postMarkup = <p>Loading post...</p>;
	} else {
		const {
			id,
			body,
			createdAt,
			username,
			comments,
			likes,
			likeCount,
			commentCount,
		} = getPost;

		postMarkup = (
			<Grid>
				<Grid.Row>
					<Grid.Column width={2}>
						<Image
							floated='right'
							size='small'
							src='https://semantic-ui.com/images/avatar/small/christian.jpg'
						/>
					</Grid.Column>
					<Grid.Column width={10}>
						<Card fluid>
							<Card.Content>
								<Card.Header>{username}</Card.Header>
								<Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
								<Card.Description>{body}</Card.Description>
							</Card.Content>
							<hr />
							<Card.Content extra>
								<LikeButton user={user} post={{ id, likeCount, likes }} />
								<Popup
									content='Comment on post'
									inverted
									trigger={
										<Button
											as='div'
											labelPosition='right'
											onClick={() => console.log('Comment on Post')}
										>
											<Button basic color='blue'>
												<Icon name='comments' />
											</Button>
											<Label basic color='blue' pointing='left'>
												{commentCount}
											</Label>
										</Button>
									}
								/>
								{user && user.username === username && (
									<DeleteButton postId={id} callback={deletePostCallback} />
								)}
							</Card.Content>
						</Card>
						{user && (
							<Card fluid>
								<Card.Content>
									<p>Post a comment</p>
									<Form>
										<div className='ui action input fluid'>
											<input
												type='text'
												placeholder='Comment..'
												name='comment'
												value={comment}
												onChange={(e) => setComment(e.target.value)}
												ref={commentInputRef}
											/>
											<button
												type='submit'
												className='ui button teal'
												disabled={comment.trim() === ''}
												onClick={submitComment}
											>
												Submit
											</button>
										</div>
									</Form>
								</Card.Content>
							</Card>
						)}
						{comments.map((Comment) => (
							<Card fluid key={Comment.id}>
								<Card.Content>
									{user && user.username === Comment.username && (
										<DeleteButton postId={id} commentId={Comment.id} />
									)}
									<Card.Header>{Comment.username}</Card.Header>
									<Card.Meta>{moment(Comment.createdAt).fromNow()}</Card.Meta>
									<Card.Description>{Comment.body}</Card.Description>
								</Card.Content>
							</Card>
						))}
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}

	return postMarkup;
};

const FETCH_POST_QUERY = gql`
	query ($postId: ID!) {
		getPost(postId: $postId) {
			id
			body
			createdAt
			username
			likes {
				id
				username
				createdAt
			}
			likeCount
			comments {
				id
				username
				createdAt
				body
			}
			commentCount
		}
	}
`;

const SUBMIT_COMMENT_MUTATION = gql`
	mutation ($postId: ID!, $body: String!) {
		createComment(postId: $postId, body: $body) {
			id
			comments {
				id
				body
				createdAt
				username
			}
			commentCount
		}
	}
`;

export default SinglePost;
