import React from 'react';
import App from './App';
import {
	ApolloClient,
	InMemoryCache,
	createHttpLink,
	ApolloProvider,
} from '@apollo/client';

import { setContext } from 'apollo-link-context';

const httpLink = createHttpLink({
	uri: 'https://shielded-stream-06787.herokuapp.com/',
});

const authLink = setContext(() => {
	const token = localStorage.getItem('jwttoken');
	return {
		headers: {
			Authorization: token ? `Bearer ${token}` : '',
		},
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

export default (
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
);
