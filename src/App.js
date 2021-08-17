import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import SinglePost from './pages/SinglePost';
import MenuBar from './components/MenuBar';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

import { AuthProvider } from './context/auth';
import AuthRoute from './util/AuthRoute';

function App() {
	return (
		<AuthProvider>
			<Router>
				<Container>
					<MenuBar />
					<Route exact path='/' component={Home} />
					<AuthRoute exact path='/login' component={Login} />
					<AuthRoute exact path='/register' component={Register} />
					<Route exact path='/posts/:postId' component={SinglePost} />
				</Container>
			</Router>
		</AuthProvider>
	);
}

export default App;
