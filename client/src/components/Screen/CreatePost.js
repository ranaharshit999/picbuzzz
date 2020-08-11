import React, { useState,useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import M from "materialize-css";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  
  const history=useHistory();

  useEffect(()=>{
    if(url){
      fetch("/createpost",{
        method:"post",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
              },
        body:JSON.stringify({
            title,
            body,
            pic:url
           
           
        })
    }).then(res=>res.json())
    .then(data=>{
        console.log(data);
    if(data.error){
        M.toast({html: data.error})
    }else{
        M.toast({html: "Posted Succesfully"});
        history.push("/"); 
    }
    }).catch(err=>{
        console.log(err);
    })
    }else{
      console.log("error in fetching url");
    }
  },[url])

  const postDetails=()=>{
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


    return (
        <div className="card"
        style={{
            margin:"5rem auto",
            maxWidth:"30rem",
            padding:"4rem"
        }}>
         <input type="text" 
      placeholder="title"
      value={title} 
        onChange={(e)=>{setTitle(e.target.value)}}
      />
        <input type="text" 
        value={body}
         onChange={(e)=>{setBody(e.target.value)}}
        placeholder="body" />
        
            <div className="file-field input-field">
      <div className="btn">
      <span>+</span>
        <input type="file"
         placeholder="Add a Pic" 
          onChange={(e)=>setImage(e.target.files[0])}
        />
       
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate" type="text" />
      </div>
      </div>
     
        
        <button className="btn" onClick={()=>postDetails()} >Add Post</button>
        
        </div>
    )
}

export default CreatePost
