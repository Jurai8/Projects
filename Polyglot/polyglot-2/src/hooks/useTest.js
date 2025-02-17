import { use } from 'react';
import { useState, useEffect} from 'react';
import { useFetchVocab } from 'useSetVocab.js'



// hook to initialize different tests
export default async function useTest(user, listname) {
    const { getVocab } = useFetchVocab(user);

    // first decide which test the user will write
    const [testType, setTestType] = useState('');

    // state to iterate through array
    const [vocab, setVocab] = useState([]);

    // state to track score
    const [score, setScore] =  useState();

    // begin test using useEffect
    const [isTesting, setIsTesting] = useState(false);

    useEffect(() => {
        if (isTesting) {
            const sourceTransTest = () => {

            }
        }
    }, [isTesting, testType])

    
    useEffect(() => {
        const getvocablist = async () => {
           const vocablist = await getVocab(listname);

           setVocab(vocablist);
        }

        getvocablist();
        
    }, [getVocab, listname])


    // Match word to pos

    // Match definition to word

    // Match word to translation and vice versa
        // fetchvocab()
       // getVocab
}