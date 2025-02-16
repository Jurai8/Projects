

// hook to initialize different tests


export default async function useTest(user) {
    // first decide which test the user will write

    // track score (usestate)

    // Match word to pos

    // Match definition to word

    // Match word to translation and vice versa
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
}