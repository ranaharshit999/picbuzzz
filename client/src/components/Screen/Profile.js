import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from "../../App"


const Profile=()=> {
    const [mypics,setPics]=useState([]);
    const {state,dispatch}=useContext(UserContext);
    const [image,setImage]=useState("");
    



    console.log('state')
    console.log(state);
    useEffect(()=>{
        fetch("/mypost",{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setPics(result.myPost)
        
            
        })
    },[])
    
useEffect(() => {
    if(image){
        const data= new FormData()
        data.append("file",image)
        data.append("upload_preset","Photo-Blog")
        data.append("cloud_name","harshit-rana")
       fetch("https://api.cloudinary.com/v1_1/harshit-rana/image/upload",{
          method:"post",
         body:data
       }).then(res=>res.json())
       .then(data=>{

        //   localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
        //   dispatch({type:"UPDATEPIC",payload:data.url})
       fetch('/updatepic',{
           method:"put",
           headers:{
               "Content-Type":"application/json",
               "Authorization":"Bearer "+localStorage.getItem('jwt')
           },
           body:JSON.stringify({
               pic:data.url
           })
        }).then(res=>res.json())
           .then(result=>{
               console.log(result)
               localStorage.setItem("user",JSON.stringify({...state,pic:result.url}))
               dispatch({type:"UPDATEPIC",payload:result.pic})
           })
       
    
    }).catch(err=>{
         console.log(err)
       })
    
    }
}, [image])

const updatePhoto=(file)=>{
    setImage(file)
   
}

    return (
        <>
        <div style={{maxWidth:"100%"}}>
      
            <div style={{
                    display:"flex",
                    
                    margin:"2rem 0.3rem",
                    borderBottom:"0.1rem solid grey"
                }}>
                <div>
                    <img className="profile-img" alt="profile-pic"
                    src={state?state.pic:"Loading...!"} />


                
        
        <div className="file-field input-field" style={{margin:"10px"}}>
        <div className="btn #64b5f6 blue darken-1">
            <span>Update pic</span>
            <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
            
        </div>
        </div>
        </div>

                
             

                
                <div className="profile-name">
                    <h4>{state?state.name:"Loading..."}</h4>
                    <p>{state?state.email:"Loading..."}</p>
                    
                    <div style={{ display:"flex",justifyContent:"space-between"}}>
                        <div> {mypics.length} Posts </div>
                        <div>{state ?state.followers.length:"0"} Followers </div>
                        <div> {state?state.following.length:"0"} Following </div>
                        {console.log(state)}
                    </div>
                </div>
            </div>
            
            <div className="gallery">
            {
                mypics.map(item=>{
                    return(
                        <img key={item._id} className="item" alt={item.title} src={item.photo}/>
                    )
                })
            }
               
            
            </div>
        </div>
</>
    )
}

export default Profile
