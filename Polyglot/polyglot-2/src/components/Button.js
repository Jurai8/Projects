const MyButton = ({ to }) => { 
    return ( 
        <a href={`/${to}`}> 
            <button className="my-button"> 
                {to === '' ? "home" : to} 
            </button> 
        </a> 
    ) 
} 
  
export default MyButton;