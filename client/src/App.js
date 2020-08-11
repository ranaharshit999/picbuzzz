import React,{useEffect,createContext,useReducer, useContext} from 'react';
import Navbar from './components/Navbar';
import "./App.css"
import {BrowserRouter,Route,Switch,useHistory} from "react-router-dom";
import Home from "./components/Screen/Home"
import Login from "./components/Screen/Login"
import Signup from "./components/Screen/Signup"
import Profile from "./components/Screen/Profile"
import CreatePost from './components/Screen/CreatePost';
import {reducer,initialState} from '../src/reducers/userReducer'
import UserProfile from './components/Screen/UserProfile';
import SubscribeUserPost from './components/Screen/SubscribeUserPost';


export const UserContext=createContext()

const Routing=()=>{
  const history=useHistory();
  const {state,dispatch}=useContext(UserContext)
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
      // history.push("/")
    }else{
      history.push("/login")
    }
  },[])
  return(<Switch>
        <Route  exact path="/">
       <Home />
     </Route>
     <Route  exact path="/login" > 
     <Login />
     </Route>
     <Route exact path="/signup" >
     <Signup />
     </Route>
     <Route exact path="/profile"  >
       <Profile />
     </Route>
     <Route exact path="/create"  >
       <CreatePost />
     </Route>
     <Route path="/profile/:userid" >
       <UserProfile /> 
     </Route>
     <Route path="/myfollowingpost" >
       <SubscribeUserPost /> 
     </Route>
  </Switch>

  )
}

function App() {
     const [state,dispatch]=useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>

    <BrowserRouter>
  <Navbar />
     <Routing />

    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
