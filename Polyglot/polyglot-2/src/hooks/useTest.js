import { useState, useEffect, useCallback} from 'react';


// hook to initialize different tests
export default function useTest(list) {
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
       

    return {
        isCorrect,
        score,
        count,
        mistakes,
        randomize,
        reset
    };
}