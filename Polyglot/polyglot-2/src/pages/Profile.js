import { useAuth } from "../hooks/useAuth";
import { firestore } from "../firebase";
import { collection, doc, getDoc} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import  useGetUserData  from "../hooks/useUserData";
import { Box, Paper, Typography } from "@mui/material";

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
                setJoined(docSnap.data().Joined)

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
        <Box id='profile-content-container'>
            <Box id='profile-personal'>
                <Typography variant="h3"> {username} </Typography>
                <Typography variant="h7"> Joined: {joined} </Typography>
            </Box>

            
            <Paper id='profile-collection'>
                <Box 
                    sx={{ width: '33.3%', display: 'flex', justifyContent: 'center',
                }}>

                    <Box 
                        sx={{ display: 'flex', justifyContent: 'center',alignItems: 'center', flexDirection: 'column'
                    }}>
                        <Typography variant="h4">Lists</Typography>
                        <Typography variant="h4">{lists}</Typography>
                    </Box>
                    
                </Box>

                <Box sx={{ width: '33.3%' }} /> {/* Empty middle spacer */}

                <Box 
                    sx={{ width: '33.3%', display: 'flex', justifyContent: 'center'
                }}>
                    <Box 
                        sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'
                    }}>
                        <Typography variant="h4">Words</Typography>
                        <Typography variant="h4">{words}</Typography>
                    </Box>
                    
                </Box>
            </Paper>
            
        
               
            <Paper id='profile-stats'>
                <Box 
                    sx={{ width: '33.3%', display: 'flex', justifyContent: 'center' 
                }}>
                    <Box 
                        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'
                    }}>
                        <Typography variant="h4">Tests</Typography>
                        <Typography variant="h4"> {tests}  </Typography>
                    </Box>
                    
                </Box>

                <Box sx={{ width: '33.3%' }} /> {/* Empty middle spacer */}

                <Box 
                    sx={{ width: '33.3%', display: 'flex', justifyContent: 'center' 
                }}>
                    <Box 
                        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'
                    }}>
                        <Typography variant="h4">Perfects</Typography>
                        <Typography variant="h4"> {perfects} </Typography>
                    </Box>
                </Box>
            </Paper>
            
        </Box>
        
       
    );
}