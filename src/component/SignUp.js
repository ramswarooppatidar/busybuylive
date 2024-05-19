import { useState } from "react"
import styles from "../styles/SignIn.module.css"
import { useValue } from "../itemContext"
import { toast } from "react-toastify"
import { NavLink, useNavigate } from "react-router-dom"
export const SignUp=()=>{
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const {createUser} = useValue()

    //Navogate 
    const nevigate = useNavigate();
    function handleName(e){
        setName(e.target.value)
    }

    function handleUsername(e){
        setUsername(e.target.value)
    }

    function handlePassword(e){
        setPassword(e.target.value)
    }
    function signUp(){
        if(name ==="" && username === "" && password === ""){
            toast.error("Please Enter Name, Username and Password ")
        }else{
            createUser(name, username, password);
            // setName("");
            // setUsername("");
            // setPassword("")
            nevigate("/")         
        }
    }

    
    return(
        <>
        <div className={styles.signInContainer}>
            <h1>Sign Up</h1>
            <div className={styles.field}>
                 <input type="text"
                  placeholder="Name"
                  onChange={handleName}
                  />
                <input type="text"
                 placeholder="Email"
                 onChange={handleUsername}
                 />
                <input type="text" 
                placeholder="Enter Password"
                onChange={handlePassword}
                />
                <button onClick={()=>signUp()}>Sign Up</button>
                {/* <Link>
                </Link> */}
                <br />
                <span className={styles.text}>Already User? <NavLink to='/sigin' className={styles.link}>Login</NavLink></span>

            </div>
        </div>
        </>
    )
}