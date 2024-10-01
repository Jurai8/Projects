import { Link } from "react-router-dom";

const MyButton = ({ link }) => {
  return (
    <Link to={`/${link}`}>
      <button className="my-button">
        {link === '' ? "Home" : link}
      </button>
    </Link>
  );
};
  
export default MyButton;