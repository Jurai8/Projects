import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MyButton from "../components/Button";
import { FetchVocab } from '../functions/MyEventHandlers';
import { Test, Vocab } from '../functions/Learner';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MenuItem, Select, Typography } from '@mui/material';


// This is the vocab test

// compare the word that they write against the word that they have saved
// if they are the same  +1 point else -1 point
// at the end give them their score/percentage 
// show words that they got incorrect

// first hardcode

//TODO: create a collection to store words that user wants to be tested on in the future. User should be able to select individual words to be tested on within a vocab collection (?) or they can get tested on the entire collection

export default function TestLearner() {
    const {testName} = useParams();

    // current word to be displayed
    const [word, setWord] = useState('');
    // move through vocablist indices
    const [count, setCount] = useState(null);
    // user answer
    const [input, setInput] = useState('');
    // user score
    const [score, setScore] = useState(0);
    // keep track of whether test has started or not
    const [begin, setBegin] = useState(false)
    // vocab list to be tested against
    const vocabListRef = useRef([]);

    const auth = getAuth();
    const user = auth.currentUser;

    const vocabTest = new Test(user);

    useEffect(() => {
        console.log(vocabTest.getScore())
        // Ensure vocabListRef.current is not empty before trying to access it
        if (vocabTest.verifyWordSet(vocabListRef.current, count)) {
            // when count changes show value at index "count"
            setWord(vocabListRef.current[count].native);
        }
    }, [count,vocabTest])

    const initializeVocab = async () => {
        const newWords = await vocabTest.getVocab();
        vocabListRef.current = newWords;
        // Reset count to 0 to start from the first word
        setCount(0);
    };

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleConfirmClick = () => {
        setInput(''); // Clear the input field after adding to the array
        setCount((prevCount) => prevCount + 1);
    };

   const compare = () => {
       if(vocabTest.checkAnswer(vocabListRef.current[count].translation, input)){
        setScore(score+1)
       }
   }
    return (
        <div>
            <MyButton to="" />

            {count === (vocabListRef.current.length) ?
                <h1> Score: {score} / 3</h1> : <h1> Word: {word} </h1>
            }
             
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                >
                <TextField id="standard-basic" label="Standard" variant="standard" type='text' value={input} onChange={handleInputChange}/> 

                <Button variant="contained" 
                onClick={() => {
                    if (begin) {
                        compare()
                        handleConfirmClick()
                    } else {
                        return null;
                    }        
                }}>
                    Confirm
                </Button>

                <Button variant="contained" onClick={() => {
                    setBegin(true)
                    initializeVocab()  
                }}>
                    Begin
                </Button>
            </Box>
        </div>
    )
}

//This is where the user will choose which test to write.
function IndexTest(){
    const [options, setOptions] = useState([])
    const [user, setUser] = useState(null);

    const getUser = () => {
        const auth = getAuth();

        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user); 
            } else {
                // TODO: cleanup subscription
                console.log("User is signed out");
                alert("Test: not signed in yet");
            }
        });
    }

    useEffect(() => {
        getUser();
    },[])

    const vocab = useMemo(() => {
      if (user) {
        return new Vocab(user);
      } else {
        console.log("user not authenticated, function: Sidebar");
        return null;
      }
    }, [user]);

    useEffect(() => {
      if (vocab) {

        const fetchVocabLists = async () => {
          try {
            console.log("Fetching vocab lists...");
            const vocabListNames = await vocab.getAllVocabLists();

            setOptions(vocabListNames);
          } catch (error) {
            console.error("Error fetching vocab lists:", error);
          }
        };
    
        fetchVocabLists();
      }
    }, [vocab]);

    
    return (
        <div>
            <Typography variant='h5'> Select your vocab list</Typography>
            {options.map((list,index)=>(
                <li key={index}>
                    <Link to={'/test/'+ list.listName}>{list.listName}</Link>
                </li>
            ))}
        </div>
    )
}



export {IndexTest}