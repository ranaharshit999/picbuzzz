import React ,{useContext,useRef,useEffect,useState}from 'react'
import { Link, useHistory } from 'react-router-dom'
import {UserContext} from "../App"
import M from 'materialize-css'
function Navbar() {

  const searchModal=useRef(null)
  const dropdown=useRef(null)
  const [search,setSearch]=useState('');
  const [userDetails,setUserDetails]=useState([])
  const {state,dispatch}=useContext(UserContext);
  const history=useHistory();

useEffect(()=>{
  
  M.Modal.init(searchModal.current)
  
  M.Dropdown.init(dropdown.current)
},[dropdown])

  const renderList=()=>{
    if(state){
      return [
       
        <li key="2" className="nav-icon" ><Link  to="/profile">Profile</Link></li>,
        <li key="3" className="nav-icon" ><Link to="/create">Add a Post</Link></li>,
        <li key="4" className="nav-icon" ><Link to="/myfollowingpost" >My Following</Link></li>,
        <li key="5" className="nav-icon" >
          <button style={{backgroundColor:"black",color:"white"}}
           className="btn"
          onClick={()=>{
            localStorage.clear()
            dispatch({type:"CLEAR"})
            history.push("/login")
          }}>
          Logout
          </button>
        </li> 
      ]
    }else{
      return [ <li key="6" className="nav-icon" ><Link to="/login">Login</Link></li>,
      <li key="7" className="nav-icon" ><Link to="/signup">Sign up</Link></li> ]
    }
  }

const fetchUsers=(query)=>{
setSearch(query)
fetch('/search-user',{
  method:"post",
  headers:{
    "Content-Type":"application/json",

  },
  body:JSON.stringify({
    query
  })
}).then(res=>res.json())
.then(result=>{
  console.log(result)
  setUserDetails(result.user)
})
}



    return (
        <nav>
        <div className="nav-wrapper black">
        <Link to={state?"/":"/login"} className="brand-logo-left">Pic Buzz</Link>,
          <ul id="nav-mobile" className="right right-side">
         {state?<li key="1" className="search" style={{cursor:"pointer"}}><i data-target="modal1" className="material-icons modal-trigger"> search</i></li>
         : <li></li>} 
            {/* Dropdown Trigger  */}
  <a className='dropdown-trigger btn' href='#' data-target='dropdown1' ref={dropdown}>
  <i data-target="modal1"

   className="material-icons" > settings</i></a>

  
  <ul id='dropdown1' className='dropdown-content'>
  {renderList()}
    
  </ul>
          </ul>
        </div>


        <div id="modal1" className="modal" ref={searchModal}  style={{color:"black"}} >
    <div className="modal-content">
    <input
        type="text"
        value={search}
       
        onChange={(e)=>{fetchUsers(e.target.value)}}
        placeholder="search for users by username"/>
        <ul className="collection" style={
          {
            display:"flex",
            flexDirection:"column"
            
          }
        }>
        {userDetails.map(item=>{
         return <Link key={item._id} to={item._id !== state._id ?"/profile/"+ item._id :"/profile"}
        onClick={()=>{
          M.Modal.getInstance(searchModal.current).close()
        }}
         ><li style={{color:"black"}}
         className="collection-item">{item.email}</li></Link>
        })}
      
     
    </ul>
    </div>
    <div className="modal-footer">
      <button  className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>Close</button>
    </div>
  </div>
      </nav>
    )
}

export default Navbar
