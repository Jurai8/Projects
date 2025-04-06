import { useState, useEffect} from 'react';
import { useFetchVocab } from 'useSetVocab.js'



// hook to initialize different tests
export default async function useTest(list) {
    const [score, setScore] = useState();

    // questions that were answered incorrectly
    const [mistakes, setMistakes] = useState([]);

    const [count, setCount] = useState(0);

    const increment = () => setCount(count + 1);

    const addScore = () => setScore(score + 1)

    const saveMistake = (userInput, answer) => {
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
        if (vocab[count] === userInput) {
            // increase score
            addScore();

            // move to the next word
            increment();
        } else {

            // save the mistake/ incorrect answer
            saveMistake(userInput, vocab[count]);

            // increment without increasing score
            increment();
        }
    }

    // reset function ?
        // set values back to zero


        // isCorrect will increment and add score for me
    return {
        isCorrect,
        score,
        count,
        mistakes,
    };
}