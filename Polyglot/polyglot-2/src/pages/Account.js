import { Button, Modal, Box, Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

// TODO: add a sign out function. remove the signout button from the home page
export default function Account() {

    const { deleteAccount } = useAuth();
    const [modal, setModal] = useState(false);

    const openModal = () => setModal(true);

    const closeModal = () => setModal(false);
    
    return (
        <>
            <Button onClick={() => openModal()}>Delete Account</Button>

            {modal && (
                <DeleteAccountModal 
                    open={modal} 
                    close={closeModal} 
                    deleteAccount={deleteAccount} 
                /> 
            )}
        </>

    );
}

function DeleteAccountModal({ open, close, deleteAccount }) {

    const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    };

    return (
         <Modal
            open={open}
            onClose={close}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography variant="h6" component="h2">
                   Permantly Delete Your Account ?
                </Typography>
                                                  
                <Button onClick={async() => {
                    close()
                    await deleteAccount()
                }}>
                    Yes
                </Button>

                <Button onClick={() => close()}>
                    No
                </Button>
            </Box>
        </Modal>
    )
}


