import { Link } from "react-router-dom";


const MyButton = ({ to }) => {
  return (
    <Link to={`/${to}`}>
      <button className="my-button">
        {to === '' ? "Home" : to}
      </button>
    </Link>
  );
};
  
export default MyButton;