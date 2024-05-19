import styles from "../styles/Home.module.css"
import { items } from "../data/data"
import { useValue } from "../itemContext"
import { useEffect, useState } from "react"
export const Home =()=>{
    const {addToCart} = useValue()
    const[price, setPrice] = useState(12)
    const[filter, setFilter] = useState({
        womenCloth:false,
        menCloth : false,
        jewellery : false,
        electronics : false
    })
    const [FilterItem, setFilterItem] = useState(items)

    function handlePriceChanges(e){
        setPrice(Number(e.target.value));
    }

    function handleCheckBoxChange(e){
        const{name, checked} = e.target
        setFilter((prevFilter) => ({
            ...prevFilter,
            [name] : checked

        }))
    }
    useEffect(()=>{
        function applyFilter(){

        }
        const filterd = items.filter((item)=>{
            const matchesPrice = item.price <= price
            const matchesCategory = 
                (filter.womenCloth && item.description ==="women cloth") ||
                (filter.menCloth && item.description ==="men cloth") ||
                (filter.electronics && item.description ==="electronic") ||
                (filter.electronics && item.description.includes("electronic")) ||
                (filter.jewellery && item.description.includes("Jewellery"))||
                (!filter.womenCloth && !filter.menCloth && !filter.jewellery && !filter.electronics);

                return matchesPrice && matchesCategory
        })
        setFilterItem(filterd)
    },[price, filter])
    return(
        <>
        <div className={styles.home}>
            <div className={styles.filter}>
                <h1>Filter</h1>
                <h2>price: {price}</h2>
                <input type="range" 
                min="100" max="150000"
                value={price}
                onChange={handlePriceChanges}
                 />
                <div className={styles.checkBoxContainer}>
                    <input type="checkbox"
                     id="myCheckbox" 
                     name="womenCloth" 
                     value="isChecked"
                     onChange={handleCheckBoxChange}
                     />
                    <label for="myCheckbox">Women cloth</label>
                    <br/>

                    <input type="checkbox" 
                    id="myCheckbox"
                    name="menCloth"
                    value="isChecked"
                    onChange={handleCheckBoxChange}
                    />
                    <label for="myCheckbox">men cloth</label>
                    <br/>

                    <input type="checkbox" 
                    id="myCheckbox" 
                    name="jewellery" 
                    value="isChecked"
                    onChange={handleCheckBoxChange}
                    />
                    <label for="myCheckbox">Jewelleryes</label>
                    <br/>

                    <input type="checkbox" 
                    id="myCheckbox" 
                    name="electronics"
                    value="isChecked"
                    onChange={handleCheckBoxChange}
                    />
                    <label for="myCheckbox">electronics</label>

                </div>
            </div>
            <div className={styles.listContainer}>
                {FilterItem.map((item, index)=>{
                    return(
                    <div key={index} className={styles.listItem}>
                        <div className={styles.image}>
                            <img src={item.imageUrl}/>
                        </div>
                        <div className={styles.description}>
                          <p><h3>{item.description}</h3></p>
                          <h2>Price {item.price}/-</h2>
                        </div>
                        <div>
                            <button onClick={()=>{addToCart(item)}}>Add To Cart</button>
                        </div>
                    </div>
                    )
                })}              
            </div>
        </div>
        </>
    )
}