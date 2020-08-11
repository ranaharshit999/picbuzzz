import React ,{useState,useEffect,useContext} from 'react'
import {UserContext} from "../../App";
import {Link} from 'react-router-dom';


function Home() {
    const [data, setData] = useState([]);
    const [comment, setComment] = useState('')
    const {state,dispatch} = useContext(UserContext)
    useEffect(()=>{
        const ac = new AbortController();
        fetch("/allpost",{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
        }).then(res=>res.json())
        .then(result=>{
        
        console.log(result);
            setData(result.posts)
        }).catch(err=>{
            console.log(err)
        })
        return () => ac.abort();
    },[])
  
    const likePost=(id)=>{
        fetch('/like',{
            method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    postId:id
                })
               
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result);
               const newData=data.map(item=>{
                   if(item._id==result._id){
                       return result
                   }else{
                       return item
                   }
               })
               setData(newData)
        }).catch(err=>{
            console.log(err);
        })
    }

    
    const unlikePost=(id)=>{
        fetch('/unlike',{
            method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    postId:id
                })
               
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result);
            const newData=data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err);
        })
    }

const makeComment=(text,postId)=>{
    fetch("/comment",{
        method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        
    }).then(res=>res.json())
    .then(result=>{ 
        console.log(result)
        const newData=data.map(item=>{
            if(item._id==result._id){
                return result
            }else{
                return item
            }
        })
        setData(newData)
        setComment('')
    }).catch(err=>console.log(err))
}

const deletePost=(postid)=>{
    fetch(`/deletepost/${postid}`,{
    method:"delete",
    
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")

        }
    
 }).then(res=>res.json())
 .then(result=>{
     console.log(result)
     const newData=data.filter(item=>{
         return item._id !==result._id
     })
     setData(newData)
 })
}
    return (
        <div className="home">
        {
            data.map(item=>{
                return(
                    
                    <div key={item._id} className="card home-card">
                    
                <h5 style={{padding:"1rem"}}>
              
              <div style={{display:"flex"}}>
              <img style={{width:"2rem",height:"2rem",borderRadius:"50%"}} src={item.postedBy.pic}></img>
      <Link style={{color:"black"}}
      to={item.postedBy._id!=state._id
      ? "/profile/"+item.postedBy._id
       :"/profile" }>{item.postedBy.name}
      </Link>
      </div>
                {item.postedBy._id ==state._id &&
                <i className="material-icons"
                 style={{float:"right",cursor:"pointer"}}
                 onClick={()=>deletePost(item._id)}>delete</i>}  </h5>
                <div className="card-image">
                    <img 
                    src={item.photo}
                        alt="post"
                    />
                </div>
                <div className="card-content">
                {item.likes.includes(state._id)
                ?<div><i className="material-icons icon" onClick={()=>unlikePost(item._id)}>thumb_down</i>
                <i className="material-icons icon" >comment</i>
                </div>
                :<div>
                <i className="material-icons icon" 
                onClick={()=>likePost(item._id)}>
                thumb_up </i>
                <i className="material-icons icon" >comment</i>
</div>
                }
                
                
                   <h6>{item.likes.length} Likes<span style={{margin:"1rem"}}>{item.comments.length} comments</span></h6>
                    <h4>{item.title}</h4>
                    <p>{item.body}</p>
<h4>Comments</h4>
                    {
                        item.comments.map(record=>{
                            return(
                                <div key={record._id}>
                                <h5>{record.postedBy.name}
                                <span style={{fontSize:"1rem", margin:"1rem"}}>{record.text}</span>
                                </h5>
                                </div>
                            )
                        })
                    }
                    <form onSubmit={(e)=>{
                        e.preventDefault()
                        makeComment(e.target[0].value,item._id)
                    }}>
                      <input type="text" 
                        value={comment}
                      onChange={(e)=>setComment(e.target.value)}
                      placeholder="add a comment" />
                    </form>
                </div>
            </div>
           
                )
            })
             
        }
       
           
        </div>
    )
}

export default Home
