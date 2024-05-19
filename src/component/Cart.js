import styles from "../styles/Cart.module.css"
import { items } from "../data/data"
import { useValue } from "../itemContext"
import { NavLink } from "react-router-dom"
export const Cart=()=>{
    const {cart, total, addToCart, decreseQty, removeFromCart, purchase} = useValue()

    const total_1 = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
    return(
        <>
             <div className={styles.home}>
            <div className={styles.total}>
                <h2>Total price : {total_1}/-</h2>
                    <button onClick={()=>{purchase()}}>Purcase</button>
                
            </div>
            <div className={styles.cartContainer}>
                {cart.map((item, index)=>{
                    return(
                    <div key={index} className={styles.cartItem}>
                        <div className={styles.image}>
                            <img src={item.imageUrl}/>
                        </div>
                        <div className={styles.description}>
                          <p><h3>{item.description}</h3></p>
                          
                        </div>
                        <div className={styles.itemCount}> 
                           <div><h2>Price {item.price}/-</h2></div>                            
                            <div className={styles.countIcon}>
                                <img
                                onClick={()=>{decreseQty(item)}}
                                 src ="https://cdn-icons-png.flaticon.com/128/14026/14026053.png"/>
                                <h2>{item.qty}</h2>
                                <img 
                                onClick={()=>{addToCart(item)}}
                                src="https://cdn-icons-png.flaticon.com/128/4587/4587285.png"/>
                            </div>
                        </div>
                        <div>
                            <button onClick={()=>removeFromCart(item)}
                            >Remove From Cart</button>
                        </div>
                    </div>
                    )
                })}              
            </div>
        </div>
        </>
    )
}