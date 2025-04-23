import { firestore } from "firebase/firestore";
import { getDoc,query, collection } from "firebase/firestore";

export default function UseGetUserData(user) {

    const getTotalVocab = () => {
        // get all the collections
        const q = query(collection(firestore,"Users", user.uid, "All_Vocab_Lists"));

        let words = 0;

        q.forEach(doc => {
            // add up the total words from each collection
            words += doc.data().Words
        }); 

        return words
    }

    return {getTotalVocab}
}