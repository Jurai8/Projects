import { firestore } from '../firebase';
import { collection, getDocs } from "firebase/firestore"; 
import { useAuth } from '../hooks/useAuth';


export class Test {

    // constructor
    constructor(user) {
        this.user = user;
        // array of words to be tested on
        this.vocab = [];
        this.score = 0;
        // TODO: this.input = new Input(); - if needed
    }

    // fetchvocab()
    async getVocab(listName) {
        if (this.user) {
            const userId = this.user.uid;
            // get vocab 
            try {
                const getVocabdocs = await getDocs(collection(firestore, "Users", userId, listName)); 

                getVocabdocs.forEach((doc) => {
                    this.vocab.push({
                        native: doc.data().word,
                        translation: doc.data().translation
                    });
                });
            } catch (error) {
                console.error("could not get vocab for test");
            }
            
            // how to return a randomized order of the array ?
            return this.vocab;
        } else {
            console.error("User not logged in");
        }
    }

    checkAnswer(currentWord, currentAnswer) {

        console.log(currentWord,currentAnswer, currentWord === currentAnswer)
        if (currentWord === currentAnswer) {
            // score is handled by state
            return true;
        } else {
            return false;
        }
        
    }

    verifyWordSet(vocabList, count) {
        if (vocabList.length > 0 && count < vocabList.length) {
            return true;
        }

        if (!vocabList === null) {
            return true;
        }

        return false;
    }

    // allow user to select a date
    // we remind them on the date - the time to do the test is up to them
    scheduleTest(date, time) {
        

    }

    // getscore
    getScore() {
        // score is handled by state
        return this.score;
    }

    // set score?
}


