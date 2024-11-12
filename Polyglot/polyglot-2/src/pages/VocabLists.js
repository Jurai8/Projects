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
import { Vocab } from "../functions/Learner"
import { getAuth, onAuthStateChanged} from "firebase/auth"
import { useState, useEffect, } from "react"

export default function VocabLists() {
  const auth = getAuth();
  
  const [rows, setRows] = useState([]);

  const [heft, setHeft] = useState(false);

  const handleHeft = () => setHeft(true);
  // * new 
  const [newVocabCollection, setNewVocabCollection] = useState(false);
  // * new
  const toggleNewCollectionModal = (bool) => setNewVocabCollection(bool);

  useEffect(() => {
    const lists = () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const vocab = new Vocab(user);
  
          try {
            const vocabLists = await vocab.getAllVocabLists();
  
            console.log(vocabLists.length);
            setRows(vocabLists);
          } catch (error) {
            console.error("could not get vocablists", error);
          }
  
        } else {
          alert("Vocablists: user not signed in");
        }
     })
    }

    lists();
  },[])


  return (
    <>
      <div>
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
    </>  
  );
}

/*
 const [learner, setLearner] = useState(null);

    const getUser = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setLearner(user); // Set the learner when the user is authenticated
            } else {
                console.log("User is signed out");
                alert("not signed in yet");
            }
        });
    }

    useEffect(() => {
        getUser();
    }, []);

  const vocab = useMemo(() => {

    if (learner) {
      console.log("hello")
      return new Vocab(learner);
    } else {
      alert("not signed in");
    }
  }, [learner])

useEffect(() => {
  console.log(vocab || "null");
  const getLists = async () => {
    if (vocab) {
      try {
        const vocabLists = await vocab.getAllVocabLists();
  
        console.log(vocabLists.length);
        setRows(vocabLists);
      } catch (error) {
        console.error("could not get vocablists", error);
      }
    }
  }

  getLists();
  
}, [vocab])

*/