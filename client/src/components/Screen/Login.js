import React,{ useState,useContext,useReducer}  from 'react'
import { Link,useHistory } from 'react-router-dom'
import {UserContext} from "../../App"
import M from "materialize-css"

function Login() {
    const {state,dispatch}=useContext(UserContext)
    const history=useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const PostData=()=>{
        
        fetch("/login",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                
                email:email,
                password:password,
               
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data);
        if(data.error){
            M.toast({html: data.error})
        }else{
            localStorage.setItem("jwt",data.token);
            localStorage.setItem("user",JSON.stringify(data.user))
           dispatch({type:"USER",payload:data.user})
            M.toast({html: "Logged in Succesfully"});
            history.push("/"); 
        }
        }).catch(err=>{
            console.log(err);
        })
    }

    return (
        <div className="mycard">
            <div className="card auth-card">
        <h2 className="brand-logo-left">Pic Buzz</h2>
        <input
        type="text"
        value={email}
        onChange={(e)=>{setEmail(e.target.value)}}
        placeholder="Email"/>

       <input
        type="password"
        value={password}
        onChange={(e)=>{setPassword(e.target.value)}}
        placeholder="Password"/>
      <button
       className="btn"
        onClick={()=>PostData()}>
        Login
        </button>
      <div>
          Don't have an account?
          <Link to="/signup">
              Signup
          </Link>
      </div>
      </div>
        </div>
    )
}

export default Login
