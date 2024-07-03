import { Provider, useSelector } from 'react-redux';
import store from './store';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './components/home';
import Herosection from './components/herosection';
import FeatureSection from './components/features';
import Workflow from './components/workflow';
import Techstack from './components/techstack';
import Benefits from './components/benefits';
import Footer from './components/footer';
import Signin from './components/login';
import Signup from './components/signup';
import Forgotpswd from './components/forgotpswd';
import Resetpswd from './components/resetpswd';
import Dashboard from './components/db';
import Tasks from './components/dashboard/todo';
import Review from './components/dashboard/review';
import Visualize from './components/dashboard/visualize';
import Kanban from './components/dashboard/board';
import Notifications from './components/dashboard/notifications';
import Logout from './components/dashboard/logout';
import CollaboratorForm from './components/dashboard/collab';
import Groups from './components/dashboard/groups';
import Assign from './components/dashboard/assign';
import Assigned from './components/dashboard/assigned';
import Monitor from './components/dashboard/monitor';
import Chat from './components/dashboard/chat';
import { NotificationProvider } from './components/dashboard/notificationcontext';
import { UserProvider } from './components/dashboard/usercontext';


const Routes = () => {
  const user = useSelector(state => state.user);

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/signin" component={Signin} />
      <Route path="/create-account" component={Signup} />
      <Route path="/overview" component={Herosection} />
      <Route path="/features" component={FeatureSection} />
      <Route path="/enhancement" component={Workflow} />
      <Route path="/tech-stack" component={Techstack} />
      <Route path="/benefits" component={Benefits} />
      <Route path="/contact" component={Footer} />
      <Route path="/forgot-password" component={Forgotpswd} />
      <Route path="/reset-password/:id/:token" component={Resetpswd} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/review" component={Review} />
      <Route path="/visualize" component={Visualize} />
      <Route path="/kanban" component={Kanban} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/logout" component={Logout} />
      <Route
        path="/collab"
        render={() => <CollaboratorForm senderEmail={user ? user.email : ''} />}
      />
      <Route
        path="/group"
        render={() => <Groups senderEmail={user ? user.email : ''} />}
      />
      <Route
        path="/assign"
        render={() => <Assign senderEmail={user ? user.email : ''} />}
      />
      <Route
        path="/assigned"
        render={() => <Assigned senderEmail={user ? user.email : ''} />}
      />
      <Route
        path="/monitor"
        render={() => <Monitor senderEmail={user ? user.email : ''} />}
      />
      <Route
        path="/chat"
        render={() => <Chat senderEmail={user ? user.email : ''} />}
      />
    </Switch>
  );
};

const App = () => {
  return (
    <NotificationProvider>
      <UserProvider>
      <Provider store={store}>
        <Router>
          <Navbar />
          <div className="max-w-7xl mx-auto pt-20 px-6">
            <Routes />
          </div>
        </Router>
      </Provider>
      </UserProvider>
    </NotificationProvider>
  );
};

export default App;
