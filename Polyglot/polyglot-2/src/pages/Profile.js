import { useAuth } from "../hooks/useAuth";
import { firestore } from "../firebase";
import { collection, doc, getDoc} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import  useGetUserData  from "../hooks/useUserData";

export default function Profile () {

    const { user } = useAuth();

    // number of words that the user has saved
    const [words, setWords] = useState(0);

    const [lists, setLists] = useState(0);

    const [tests, setTests] = useState(0);

    const [joined, setJoined] = useState(0);

    const [perfects, setPerfects] = useState(0)

    const [username, setUsername] = useState("");

     
    const { getTotalVocab } = useGetUserData(user);


    const ProfileData = useCallback(async (user) => {

        setUsername(user.displayName);

        try {
            // Reference the user (doc)
            const userDocRef = doc(firestore, "Users", user.uid);

            const docSnap = await getDoc(userDocRef);

            // if the user (doc) exists
            if (docSnap.exists()) {
                // get the total number of words they have currently saved
                setWords(docSnap.data().Total_Words);
                setLists(docSnap.data().VocabLists);
                setTests(docSnap.data().Tests);
                setPerfects(docSnap.data().Perfects);

            } else {
                // Throw an Error?
                console.log("No such document!");
            }
        } catch (error) {
            console.error("error fetching profile data", error);
        } 

    }, [])



    useEffect(() => {
        ProfileData(user);
    }, [user, ProfileData])
    

    return (
        <div>
            <h1>Username: {username} </h1>

            <h1>Lists: {lists} </h1>
            <h1>Words saved: {words} </h1>
            <h1>Tests done: {tests} </h1>
            <h2>Perfects: {perfects} </h2>
            <h1>Date Joined: </h1>
        </div>
       
    );
}