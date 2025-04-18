import { useState, useEffect, useCallback} from 'react';
import { useAuth } from './useAuth';
import { addDoc, collection, doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';


// hook to initialize different tests
export default function useTest(list) {
    const { user } =  useAuth();

    const [score, setScore] = useState(0);

    // questions that were answered incorrectly
    const [mistakes, setMistakes] = useState([]);

    const [count, setCount] = useState(0);

    const increment = () => setCount(count + 1);

    const addScore = () => setScore(score + 1)

    const saveMistake = (userInput, answer) => {
        if (!userInput) {
            userInput = "..."
        };

        setMistakes(prevInput => [
            ...prevInput,
            {
                userAnswer: userInput,
                correctAnswer: answer,
            }
        ]);
    };


    // compare user input against the word they were supposed to write
    const isCorrect = (vocab, userInput) => {
        // if they got the correct answer
        if (vocab === userInput) {
            // increase score
            addScore();

            // move to the next word
            increment();
        } else {
            // save the mistake/ incorrect answer
            console.log("Mistake:", userInput, "Correction:", vocab);

            saveMistake(userInput, vocab);

            // increment without increasing score
            increment();
        }
    }

    const randomize = useCallback((vocab) => {

        const random = vocab;
        // Iterate over the array in reverse order
        for (let i = random.length - 1; i > 0; i--) {
    
            // Generate Random Index
            const j = Math.floor(Math.random() * (i + 1));
    
            // Swap elements
            [random[i], random[j]] = [random[j], random[i]];
        }

        return random;
    }, [])

    // reset function ?
    const reset = () => {
        // set values back to original state
        setScore(0);
        setCount(0);
        setMistakes([])
    }

    const updatedTotalTests = async (perfects) => {
        const userDocRef = doc(firestore, "Users", user.uid);
        
        const docSnap = await getDoc(userDocRef);
        
        let testsDone = 0;
        let totalPerfects = 0;

        // if the user (doc) exists
        if (docSnap.exists()) {

            // get current number of tests done from db
            testsDone = docSnap.data().Tests + 1;
            totalPerfects = docSnap.data().Perfects + 1;
            
        } else {
            // Throw an Error?
            console.log("No such document!");
        }

        // update number of tests done
            // if they got a perfect score, update that too
        if (perfects === true) {
            try {
                updateDoc(userDocRef, {
                    Tests: testsDone,
                    Perfects: totalPerfects
                })
            } catch (error) {
                throw new Error(error);  
            }
        } else {
            try {
                updateDoc(userDocRef, {
                    Tests: testsDone,
                })
            } catch (error) {
                throw new Error(error);  
            }
        }
        
        
    }
       

    return {
        isCorrect,
        score,
        count,
        mistakes,
        randomize,
        reset,
        updatedTotalTests,
    };
}

export function useScheduleTest(user) {

    const timestamp = new Timestamp(0, 0);
    
    const scheduleTest = async (date) => {

        // * don't allow the user to schedule on or before the current day

        console.log("User Input:", date.$d);
        /* 
            await addDoc(collection(firestore, "Users", user.uid, "Test_Schedule"), {
                testType: testType,
                collection: listName,
                date: timestamp,
            });
        */
    }


    return {
        scheduleTest,
    }
    // if the test due on the current date/time, email the user
    // if I can't email the user. save an alert in the app
    // return true false if a test is scheduled for today
}