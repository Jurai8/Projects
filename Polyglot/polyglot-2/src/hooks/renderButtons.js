import { useEffect } from "react"
import { Button } from "@mui/material"


export const DisplayButtons = ({begin}) => {
    useEffect(() => {
          // if begin === null
          if (begin !== true || begin !== false) {
            // include begin button
            return (
                <Button variant="contained" onClick={() => {
                }}>
                    Begin
                </Button>
            )
        }

        // if begin === true 
        if (begin) {
            // include confirm button
            <Button 
                variant="contained" 
                onClick={() => {
                    if (begin) {
                    } else {
                        return null;
                    }        
                }}>
                Confirm
            </Button>
        }
            
        // if begin === false
        if (!begin) {
            // include restart & new test button
            <>
                <Button 
                    variant="contained" 
                    >
                    restart
                </Button>

                <Button 
                    variant="contained" 
                    >
                    new test
                </Button>
            </>
            
        }
    },[begin])
}