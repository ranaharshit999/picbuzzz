import React,{useState,useEffect} from 'react'
import { Link,useHistory } from 'react-router-dom'
import M from "materialize-css"



function Signup() {
    const history=useHistory();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image,setImage]=useState("");
    const [url,setUrl]=useState(undefined)


useEffect(() => {
    if(url){
        uploadFields()
    }
}, [url])


const uploadPic=()=>{
    const data= new FormData()
    data.append("file",image)
    data.append("upload_preset","Photo-Blog")
    data.append("cloud_name","harshit-rana")
   fetch("https://api.cloudinary.com/v1_1/harshit-rana/image/upload",{
      method:"post",
     body:data
   }).then(res=>res.json())
   .then(data=>{
     
      setUrl(data.url)
   }).catch(err=>{
     console.log(err)
   })

}

const uploadFields=()=>{
    if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
    {
       M.toast({html: "Invalid Email"});
       return;
    }else{
       fetch("/signup",{
           method:"post",
           headers:{
               "Content-Type":"application/json"
           },
           body:JSON.stringify({
               name:name,
               password:password,
               email:email,
               pic:url
           })
       }).then(res=>res.json())
       .then(data=>{
       if(data.error){
           M.toast({html: data.error})
       }else{
           M.toast({html: data.message});
           history.push("/login"); 
       }
       }).catch(err=>{
           console.log(err);
       })
   }
}

    const PostData=()=>{
        if(image){
            uploadPic()
        }else{
        uploadFields()
        }
       
}
    return (
        <div className="mycard">
            <div className="card auth-card">
        <h2 className="brand-logo-left">Pic Buzz</h2>



        <div className="file-field input-field">
      <div style={{width:"60%",height:"15rem",borderRadius:"50%",margin:"auto",backgroundColor:"gray"}}>
      <span style={{fontSize:"9rem",alignItems:"center"}} >+</span>
        <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
        </div>
      <div className="file-path-wrapper">
        <input style={{borderBottom:"none",width:"25%",margin:"auto"}} placeholder="Add Profile Pic" className="file-path validate" type="text" />
      </div>
      </div>





        <input
        type="text"
        placeholder="Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
        />


        <input
        type="email"
        placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
        />

       <input
        type="password"
        placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
        />


     

      <button className="btn" onClick={()=>PostData()}>Signup</button>
      <div>
          Already have an account?
          <Link to="/login"> Log in
              
          </Link>
      </div>

      </div>
        </div>
    )
}

export default Signup
