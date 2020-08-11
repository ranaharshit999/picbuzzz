import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from "../../App"
import {useParams} from "react-router-dom"

const UserProfile=()=> {
    const [userProfile,setProfile]=useState(null);
    const {state,dispatch}=useContext(UserContext);

    const {userid}=useParams();
    const [showfollow,setShowFollow]= useState(state?!state.following.includes(userid) :true)    

    // console.log(`state`)
    // console.log(state?!state.following.includes(userid):true)
    
     

   
    
    // console.log(`user id-${userid}`);
    useEffect(()=>{
        
       
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            
            // console.log(result)
            setProfile(result)
            
        })

    },[])


    const followUser=()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            })
            setShowFollow(false)
            console.log(state)
        }).catch(err=>
            {
                console.log("err")
                console.log(err)
            }
        )
    }


    const unFollowUser=()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))

            setProfile((prevState)=>{
                const newFollower=prevState.user.followers.filter(item=>item!=data._id)
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollower
                    }
                }
            })
            setShowFollow(true)
            console.log(state)
        }).catch(err=>
            console.log(err)
        )
    }

    return (
        <>
    {userProfile?
        <div style={{maxWidth:"100%"}}>
            <div style={{
                    display:"flex",
                    margin:"2rem 0",
                    borderBottom:"0.1rem solid grey"
                }}>
                <div>
                    <img className="profile-img" alt="profile-pic"
                    src={userProfile.user.pic} />
                </div>
                <div 
                className="profile-name">
                    
                     <h4>{userProfile.user.name}</h4>
                     <h6>{userProfile.user.email}</h6>

                    <div style={{ display:"flex",justifyContent:"space-between"}}>
                        <h6> {userProfile.posts.length}Posts </h6>
                        <h6>{userProfile.user.followers.length}Followers </h6>
                        <h6>{userProfile.user.following.length}Following </h6>

                    </div>
                {
                    showfollow?
                    <button style={{width:"6rem",
                    height:"2rem",
                    borderRadius:"0.3rem",
                    border:"2px solid blue",
                    margin:"1rem",
                    cursor:"pointer",
                    fontSize:"1.2rem"
                    ,backgroundColor:"blue"}} onClick={()=>followUser()} > Follow </button>
                    :
        <button style={{width:"6rem",
                    height:"2rem",
                    borderRadius:"0.3rem",
                    border:"1px solid blue",
                    margin:"1rem",
                    cursor:"pointer",
                    fontSize:"1.2rem"
                    ,backgroundColor:"white"}}  onClick={()=>unFollowUser()}>
        Unfollow
        </button>
                }
               

        </div>
            </div>
            
            <div className="gallery">
            {
                userProfile.posts.map(item=>{
                    return(
                        <img key={item._id} className="item" src={item.photo} alt={item.title}/>
                    )
                })
            }
            
            </div>
        </div>
        :<h1 style={{fontFamily:'Grand Hotel ,cursive'}}>Loading....</h1>

    }
        </>
    )
}

export default UserProfile
