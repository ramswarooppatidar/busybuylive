import { createContext, useContext, useEffect, useState } from "react";
import { Cart } from "./component/Cart";
import { MyOrder } from "./component/MyOrder";
import { toast } from "react-toastify";
import { db } from "./firebaseinit";
import { collection, addDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore/lite";
const itemContext = createContext();

function useValue(){
    const value = useContext(itemContext);
    return value;
}

function CustomItemContext({children}){
    const [cart, setCart] = useState([])
    const [total, setTotal] = useState(0)
    const [myOrder, setMyOrder] = useState([])
    const [authenticate, setAuthenticate] = useState(false)
    const [userId, setUserId] = useState()
    const [user, setUser] = useState([
        {
            id: 1,
            name: 'john',
            username: 'john@gmail.com',
            password: '12345'
          }
    ])

    useEffect( ()=>{
         async function fetchData(){
            try{
                const docRef = collection(db, "user");
                const docSnap = await getDocs(docRef)
    
                console.log("Document data:", docSnap);
                const users = docSnap.docs.map((doc) => {
                    return{
                        id : doc.id,
                        ...doc.data()
                    }
                })
                console.log("inside useEffect user :", users)
                console.log("inside useEffect userId  :", userId)
                setUser(users)  

                const matchingUser = users.find((usr) => usr.id === userId);
                if (matchingUser) {
                    setCart(matchingUser.cart);
                    console.log("Cart set successfully:", matchingUser.cart);
                    setMyOrder(matchingUser.MyOrder)
                } else {
                    console.log("No user found with ID:", userId);
                }                      
            }catch(error){
                console.error("Error fetching users:", error);
            }
           
         }
         fetchData();
       
    }, [userId])

    const addToCart1=(item)=>{
        console.log("items : ",item)
    const index = cart.findIndex((crt)=>crt.id === item.id)
    if(index === -1){
        setCart([...cart, {...item, qty:1}])
        setTotal(total + item.price)
     }
     //else{
        
    //     cart[index].qty++;
    //     setCart(cart)
    // }
    else {
        // Create a copy of the cart array
        const updatedCart = [...cart];
        // Update the quantity of the existing item in the copied array
        updatedCart[index] = { ...updatedCart[index], qty: updatedCart[index].qty + 1 };
        // Update the state with the new cart array
        setCart(updatedCart);
        setTotal(total + item.price)
    }
    }
    // addData firebase
    async function addToCart(item){
      try{ 
            const index = cart.findIndex((crt) => crt.id === item.id)
            let updatedCart;
            if(index === -1){
                updatedCart = [...cart, {...item, qty : 1}]
                setCart(updatedCart)
                setTotal(total + item.price)

                const docRef = doc(db, "user", userId)
                await updateDoc(docRef,{cart : updatedCart})
                console.log(" update cart in db")
            
            }
            else{
                updatedCart = [...cart];
                updatedCart[index] = { ...updatedCart[index], qty: updatedCart[index].qty + 1 };
                setCart(updatedCart);
                setTotal(total + item.price)

                const docRef = doc(db, "user", userId)
                await updateDoc(docRef,{cart : updatedCart})
                console.log(" update cart in db")
            }
        }
         catch(error){
            console.log("failed to update cart in db")
         }
        }
    // }
    const decreseQty=(item)=>{
        const index = cart.findIndex((crt)=> crt.id === item.id)
        if(cart[index].qty <= 1){
            removeFromCart(item)
            return;
        }
        if(index !== -1){
            const updatedCart = [...cart]
            updatedCart[index] = {...updatedCart[index], qty : updatedCart[index].qty - 1}
            setCart(updatedCart)
            setTotal(total - item.price)
        }
    }

    const removeFromCart1=(item)=>{
        const index = cart.findIndex((crt)=>crt.id === item.id)
        if(total - cart[index].qty*item.price <=0){
            return;
        }
        setTotal(total - cart[index].qty*item.price)
        const updatedCart = cart.filter((crt)=> crt.id !== item.id)
        setCart(updatedCart)

    }
    const removeFromCart = (item) => {
        const index = cart.findIndex((crt) => crt.id === item.id);
        if (index === -1) {
            return; // Item not found in cart
        }
        const itemTotalPrice = cart[index].qty * item.price; 
        // Update the total by subtracting the total price of the item to be removed
        setTotal(total - itemTotalPrice);
        // Filter out the item to be removed from the cart
        const updatedCart = cart.filter((crt) => crt.id !== item.id);
        setCart(updatedCart);
    };
    const purchase1=()=>{
       // setCart(cart);
    //    event.preventDefault();
       //setOrder(true)
       setMyOrder([...cart]) ;
       setCart([])
       setTotal(0) 
    }
    async function purchase(){
        try{
            const docRef = doc(db, "user", userId)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()){
                const userData = docSnap.data();
                const currentMyOrder = userData.myOrder || []

                 // Create a new order with the current cart
                 const newOrder = {
                    date: new Date().toString(),
                    items: [...cart],
                };

                const updatedMyOrder = [...currentMyOrder, newOrder]
                setMyOrder(updatedMyOrder) ;
                setCart([])
                setTotal(0)  

                // const updatedMyOrder = [...cart]
                await updateDoc(docRef,{cart : []})
                await updateDoc(docRef, {myOrder : updatedMyOrder})
                console.log("purchse completed successfuly ")
            }else{
                console.error("User document not found");
            }
            
        }catch(error){
            console.error("Failed to complete purchase:", error);
        }
    }

    const purchase2 = async () => {
        try {
            // Set myOrder and clear cart
            setMyOrder([...cart]);
            setCart([]);
            setTotal(0);

            // Create a new order with the current cart
            const newOrder = {
                date: new Date().toString(),
                items: [...cart],
            };

            // Ensure Firestore updates are done after state is set
            const updatedOrder = [...cart];
            const docRef = doc(db, "user", userId);

            await updateDoc(docRef, { cart: [] });
            await updateDoc(docRef, { myOrder: updatedOrder });

            console.log("Purchase completed successfully");
        } catch (error) {
            console.error("Failed to complete purchase:", error);
        }
    };

    //add new User
    const createUser1 = (name, email, password) => {
       const newUser={
         id : new Date(),
         name : name,
         username : email,
         password : password,
         cart : [],
         myOrder : []
       }
       setUser([...user, newUser])
       setAuthenticate(true)
       toast.success("User register successfully")
       console.log("user :", user)
    }

    //add user fire base
    async function createUser(name, email, password){
        try{
            const docRef = await addDoc(collection(db, "user"), {
                name: name,
                username : email,
                password : password,
                cart : [],
                myOrder : []
              });
              setAuthenticate(true)
              console.log("user register successfully ")
        }catch(error){
            console.log("failed to register user : ", error.message)
            toast.error("failed to register user", error.message)
        }
       
    }

    const authenticateUser = (username, password)=>{
        console.log("it is called successfully, username :", username +"password ", password)
        const foundUser = user.find((usr)=> usr.username === username && usr.password === password)
        console.log("found user :", foundUser)
        if(foundUser){
                setAuthenticate(true);
                setUserId(foundUser.id)
                return true;
            }
        else{
                setAuthenticate(false)
                return false;
            }
    }
    //log out user
    const logout = ()=>{
        const logoutUser = user.filter((usr) => usr.id !== userId)
        setUser(logoutUser)
        setAuthenticate(false)
    }
    return(
        <itemContext.Provider value={{addToCart,
                                        decreseQty,
                                        cart,
                                        total,
                                        myOrder,
                                        removeFromCart,
                                        purchase,
                                        authenticateUser,
                                        logout,
                                        createUser,
                                        authenticate,
                                        logout,
                                    }}>
            {children}
        </itemContext.Provider>
    )
   
}
export {useValue}
export default CustomItemContext;