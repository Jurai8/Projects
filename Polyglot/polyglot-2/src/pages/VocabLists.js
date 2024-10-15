// render view of all vocab lists similar to how vocab is rendered in heft
// functionality of each row:
    // when the user hovers over the row three dots should appear
    // when clicked (3 dots), a menu will show up, to either delete the collection or initiate a test or view the vocab list
    // Also when the user double clicks on the list they should be taken to heft.js where they can view the list they clicked on

    // future: while in heft.js, they should be able to choose specific words they want to be tested on (on a specific date)
    
    
import { Button } from "@mui/material";
import MyButton from "../components/Button";
import { NewCollection } from "../components/Modal";
import { ShowVocabLists } from "../components/Table";
import { Vocab } from "../components/Learner"
import { getAuth, onAuthStateChanged} from "firebase/auth"
import { useState, useEffect, } from "react"
import { Outlet } from "react-router-dom";



export default function VocabLists() {
  const auth = getAuth();
  const [rows, setRows] = useState([]);

  const [heft, setHeft] = useState(false);

  const handleHeft = () => setHeft(true);
  // * new 
  const [newVocabCollection, setNewVocabCollection] = useState(false);
  // * new
  const toggleNewCollectionModal = (bool) => setNewVocabCollection(bool);

  /*  on double click
        send user to /heft
        load the vocab
  */

  const getLists = () => {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const vocab = new Vocab(user);
  
          try {

            const row = await vocab.getAllVocabLists();
            resolve(row);  // Resolve with the array of vocab lists
          } catch (error) {
            console.error(error);
            reject(error);  // Handle error
          }
  
        } else {
          alert("user not signed in");
          reject("user not signed in");  // Reject if not signed in
        }
      });
    });
  };

  useEffect(() => {
    console.log("renders")
    const fetchData = async () => {
      try {
        const vocablists = await getLists();  
        setRows(vocablists);  
      } catch (error) {
        console.error("Error fetching vocab lists:", error);
      }
    };
  
    fetchData();  // Call the function once on component mount
  }, []);  


  return (
      
    <div>
      <MyButton to="" />
      <h1>Your vocab lists</h1>

      <Button variant="contained" onClick={() => 
        toggleNewCollectionModal(true)
      }>          
        New Collection 
      </Button>

      <Button variant="contained">          
        Schedule Test
      </Button>

      {newVocabCollection && 
        <NewCollection 
          toggleNewCollectionModal={toggleNewCollectionModal}
        />
      }

      <ShowVocabLists rows={rows} handleHeft={handleHeft} />
    </div>
      
  );
}

