import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import de from 'date-fns/locale/de';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Backdrop } from '@mui/material';
import Divider from '@mui/material/Divider';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Modal from '@mui/material/Modal';
import ModalClose from '@mui/joy/ModalClose';
import { useAuth } from '../hooks/useAuth';
import useFetchVocab from '../hooks/useVocab';
import { useState, useEffect, } from 'react';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { useScheduleTest } from '../hooks/useTest';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import useTest from '../hooks/useTest';
import CircularProgress from '@mui/material/CircularProgress';



//TODO: create a collection to store words that user wants to be tested on in the future. User should be able to select individual words to be tested on within a vocab collection (?) or they can get tested on the entire collection

// the "home page" so to speak
export function TestIndex() {
    const { user } = useAuth();

    const navigate = useNavigate();

    const { getTestSchedule } = useScheduleTest(user);

    const [TestTypeModal, setTestTypeModal] = useState(false);

    const [scheduleTable, setScheduleTable] = useState(false);

    const [beginTestModal, setBeginTestModal] = useState(false);

    const [testDetails, setTestDetails] = useState({});

    // decide whether the user will schedule a test or not.
    const [schedule, setSchedule] = useState(false);

    const openTestTypeModal = () => {
        setTestTypeModal(true);
    }

    const closeTestTypemodal = () => {
        setTestTypeModal(false);
    }

    const closeBeginTestModal = () => {
        setBeginTestModal(false);
    }

    useEffect(() => {
        const getschedule = async () => {
            const testSchedule = await getTestSchedule();

            setScheduleTable(testSchedule);
        }

        getschedule();

    },[getTestSchedule]);


    const beginTest = () => {
        navigate(`/test/${testDetails.collection}`, {
            state: {
              testType: testDetails.testType,
              listName: testDetails.collection,
              testId: testDetails.id
            },
        });
    }

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
        <>
            <Modal
                open={beginTestModal}
                onClose={closeBeginTestModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Would you like to start this test?
                    </Typography>

                    <Button onClick={() => beginTest()}> Yes </Button>
                    <Button onClick={() => {closeBeginTestModal()}}> 
                        No 
                    </Button>
                </Box>
            </Modal>

            <div>
                <h1>Test</h1>

                <TestType 
                    open={TestTypeModal} 
                    close={closeTestTypemodal} 
                    schedule={schedule}
                >
                </TestType>

                <div >
                    <Button onClick={() => {
                        
                        setSchedule(false);

                        openTestTypeModal()
                    }}>
                        Quickstart a Test
                    </Button>

                    <Button onClick={() => {
                        setSchedule(true)
                        openTestTypeModal()
                    }}>
                        Schedule Test 
                    </Button>
                </div>
            </div>

            <Box className="table-position">

                <TableContainer id='schedule-table-container' component={Paper}>
                <Table 
                    sx={{ minWidth: 650, tableLayout: 'fixed' }} 
                    aria-label="simple table" 
                    id="test-schedule-table" 
                >
                {scheduleTable ?
                    <>
                        <TableHead>
                            <TableRow>
                                {/* replace with variables in future */}
                                <TableCell className='schedule-table-header'>
                                    Test
                                </TableCell>

                                <TableCell className='schedule-table-header'
                                    align='center'
                                >
                                    List
                                </TableCell>

                                <TableCell 
                                    className='schedule-table-header'
                                    align="right"
                                >
                                    Date
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {scheduleTable.length <= 0 ? (
                                <TableRow>
                                    <TableCell>
                                        Schedule is Empty
                                    </TableCell>
                                </TableRow>
                            ) : (
                                scheduleTable.map((row, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        className='schedule-table-rows'
                                        onDoubleClick={() => {
                                            setTestDetails(row);
                                            setBeginTestModal(true)
                                        }}
                                    >
                                        <TableCell component="th" scope="row" >
                                            {row.testType}
                                        </TableCell>
                                        
                                        <TableCell 
                                            sx={{ paddingRight: "0px !important" }}
                                            align='center'
                                        >
                                            {row.collection}
                                        </TableCell>   

                                        <TableCell  
                                            sx={{ paddingRight: "10px !important" }}
                                            align='right'
                                        >
                                            {row.date}
                                        </TableCell> 
                        
                                    </TableRow>
                                ))
                            )}
                        </TableBody> 
                        
                    </> :

                    <TableBody>
                        <TableRow>
                            <TableCell>
                                Loading...
                            </TableCell> 
                        </TableRow>
                    </TableBody>
                }
                    
                    </Table>
                </TableContainer>
            

            </Box>
            
        </>
    );
}


// TODO: create test scheduler


export function TestLearner() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const { user } = useAuth();

    const { getVocab } = useFetchVocab(user);

    // Check if user is correct. Iterate through vocab. Manage scores
    const { isCorrect, count, score, randomize, reset, mistakes, updatedTotalTests,
    } = useTest(state.listName);

    const { unScheduleTest } = useScheduleTest(user);

    // current word to be displayed
    const [word, setWord] = useState('');

    // user answer
    const [input, setInput] = useState('');

    // keep track of whether test has started or not
    const [begin, setBegin] = useState(null);

    // vocab to be tested against
    const [vocabulary,setVocabulary] = useState([]);

    const [vocabType, setVocabType] = useState("")

    // shows mistakes table
    const [showMistakes, setShowMistakes] = useState(false);

    const displayMistakes = () => setShowMistakes(true);
    const closeMistakes = () => setShowMistakes(false)

    
    // get the vocab to be tested on
    useEffect(() => {
        const getwords = async () => {
            try {
                const words = await getVocab(state.listName, state.testType);

                console.log("words: ", words)

                if (state.testType === "definition") {
                    // definition the user is being compared against the word the give per definition.
                    setVocabType("translation");
                } else {
                    setVocabType(state.testType);
                }

                
                setVocabulary(randomize(words));

            } catch (error) {
                // send user to an error page?
                throw new Error(error);
            }
        }

        getwords();

    },[state.listName, getVocab, state.testType, randomize])

    // update which word is being shown and end the test when all values have been shown
    useEffect(() => {

        // Ensure vocabListRef.current is not empty before trying to access it
        // also make sure count doesn't reach an undefined index
        if (vocabulary.length > 0 && count < vocabulary.length) {
            // when count changes show the word at index "count"
            // ? The word shown needs to correspond to the test.
            setWord(vocabulary[count].main);
        } 

        // end test after going through the list
        if (vocabulary.length > 0 && count === vocabulary.length) {

            setBegin(false);

            // if the user scheduled a test
            if (state.testId) {
                // unschedule the test
                unScheduleTest(state.testId);
            }
            
            // update number of tests user has done
            // if the user got a perfect score
            if (mistakes.length === 0) {
                // record the perfect score
                updatedTotalTests(true);
            } else {
                // don't record the perfect score
                updatedTotalTests();
            }
            
        }

    }, [count,vocabulary, updatedTotalTests, mistakes, unScheduleTest, state.testId])


    // use to begin/restart a test
    const beginTest = () => {
        setBegin(true);

        // set count and score to 0
        reset();
    }


    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleConfirmClick = () => {

        console.log("VocabType:", vocabType, typeof vocabType);

        // check if user input the correct answer
        // compare the value they're being tested against with their answer
        // state.testType could be "translation", "pos" etc
        isCorrect(vocabulary[count][vocabType], input);


        setInput(''); // Clear the input field after adding to the array
    };

    const handleFormSubmit = (e) => {
        e.preventDefault(); // Prevent form from submitting and causing a reload
    };

    // control which buttons to display based on the state of begin
    function DisplayButtons({begin}) { 
        return (
            <>
                {begin === null && (
                    <Button variant="contained" onClick={() => {
                        beginTest()
                    }}>
                        Begin
                    </Button>
                )}
            </>
        )
    }   

    function DisplayMistakes() {
        return (
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={showMistakes}
                onClick={closeMistakes}
            >
                <TableContainer component={Paper} id='test-table-container'>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="left">Your answer</TableCell>
                            <TableCell align="right">Correct answer</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {mistakes.map((row, index) => (
                            <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">
                                {row.userAnswer}
                            </TableCell>

                            <TableCell align="right">
                                {row.correctAnswer}
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                        
                    </Table>
                </TableContainer>
            </Backdrop>
        )
    }

    return (
        <Box id='test-page'>
            {/* should be variable */}

            {state && 
                <Box id='test-heading'>
                    <h1>Test: {state.testType}</h1>
                    <h1>List: {state.listName}</h1>
                </Box>
            }

            {/* display "word" upon entering the page */}
            <Box id="test-center-content">
                <Paper id='test-screen' elevation={3}>

                    <Box id='test-content-container'>
                        {begin === null ? (

                        <Typography variant='h4'>Goodluck</Typography>
                    
                        ) : (
                            begin === true ? (
                                
                                    
                                <Box
                                    id='test-content'
                                    component="form"
                                    sx={{
                                        '& > :not(style)': { m: 1, width: '25ch' },
                                    }}
                                    noValidate
                                    autoComplete="off"
                                    onSubmit={handleFormSubmit}
                                >
                                    <Box id='test-word'>
                                        <Typography variant='h4'>
                                            Word: {word} 
                                        </Typography>
                                    </Box>
                                    

                                    
                                    <TextField 
                                        id="standard-basic" label="Answer" variant="standard" type='text' value={input} onChange={handleInputChange}
                                    /> 

                                    <Box id='test-confirm-button-container'>
                                        <Button 
                                            variant="contained" 
                                            onClick={() => {
                                            if (begin) {
                                                handleConfirmClick()
                                            } else {
                                                return null;
                                            }        
                                        }}>
                                            Confirm
                                        </Button>
                                    </Box>

                                </Box>
                            
                            ) : (
                                <Box 
                                    display="flex" 
                                    flexDirection="column" 
                                    height="100%"
                                >
                                    {/* Top Half – Score */}
                                    <Box id='test-result-top-half'>

                                        <Box id='score-container'>
                                            <Typography variant='h4'> 
                                                Score: {score} / {vocabulary.length} 
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Bottom Half – Buttons & Mistakes */}
                                    <Box id='test-result-bottom-half'
                                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
                                    >

                                        <Box display="flex" gap={2}>
                                            <Button 
                                                variant="contained" 
                                                onClick={() => {
                                                setVocabulary(randomize(vocabulary));
                                                beginTest();
                                                }}
                                            >
                                                Restart
                                            </Button>

                                            <Button 
                                                variant="contained" 
                                                onClick={() => {
                                                navigate("/test");
                                                }}
                                            >
                                                End
                                            </Button>
                                        </Box>

                                        {mistakes.length >= 1 &&
                                            <Box sx={{ paddingTop: "5px"}}
                                            >
                                                <Button variant='contained'
                                                    onClick={() => 
                                                        displayMistakes()
                                                    }   
                                                >
                                                    Mistakes
                                                </Button>
                                            </Box>
                                           
                                        }
                                        
                                    </Box>
                                </Box>
                            
                            )
                        )}

                      
                        <DisplayMistakes />   
                        

                        <DisplayButtons begin={begin}/>

                    </Box>
                    
                </Paper>

            </Box>   

        </Box>
    )
}


//This is where the user will choose which test to write.
function SelectTest() {
    const { user } = useAuth();

    const { getVocabLists } = useFetchVocab(user);

    const navigate = useNavigate();
    const location = useLocation();

    const [options, setOptions] = useState([]);

    // this will be used to generate rows depening on whether the user is scheduling or not
    const [pathname, setPathname] = useState(null);

    const [scheduleModal, setScheduleModal] = useState(false);

    const [selectedList, setSelectedList] = useState("");


    const open = () => setScheduleModal(true);
    const close = () => setScheduleModal(false);

    
    // redirection depends on whether the user is scheduling or starting a test
    const handleNavigation = (listName) => {
        navigate(`/test/${listName}`, {
            state: {
                testType: location.state.testType,
                listName: listName
            },
            replace: true  // This prevents going back
        });
    };

    useEffect(() => {
        setPathname(location.pathname);
        
        const getlists = async () => {
            try {
                const lists = await getVocabLists();
                setOptions(lists);
            } catch (error) {
                console.error(error)
            }
        }
      
        getlists();

    }, [getVocabLists, location]);

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


    const ScheduleTestModal = () => {

        const { scheduleTest } = useScheduleTest(user);

        return (
            <Modal
                open={scheduleModal}
                onClose={close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >

                <Box sx={style}>
                    <ModalClose 
                        variant="plain" 
                        sx={{ m: 1 }}
                        onClick={() => close()}
                    />
                    
                    <LocalizationProvider 
                        dateAdapter={AdapterDayjs} adapterLocale={de}
                    >
                        <StaticDatePicker 
                            defaultValue={dayjs()} 
                            // customize what button shows in the actionbar
                            slotProps={{
                                actionBar: {
                                  actions: ['accept'],
                                },
                            }}
                            // change the text of the buttons in the actionbar
                            localeText={{
                                okButtonLabel: "Confirm" ,
                            }}
                            
                            //  Onclick "Confirm"
                            onAccept={async (e) => {
                                try {
                                    const success = await scheduleTest(
                                        e.format("YYYY/MM/DD"),
                                        location.state.testType,
                                        selectedList
                                    );

                                    // Only close modal if scheduling succeeded
                                    if (success) {
                                        close();
                                        navigate("/test", { replace: true });
                                    }
                                } catch (error) {
                                    console.error("Failed to schedule test:", error);
                                    alert("Something went wrong. Please try again.");
                                }
                            }}
                        />
                    </LocalizationProvider>          
                </Box>
            </Modal>    
        )
    }
    
    return (
        <div>

            <ScheduleTestModal />

            <Typography variant='h5'> Select your vocab list</Typography>

            <Box className='table-position'>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                            <TableCell><strong>List Name</strong></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {options.map((list, index) => (
                            <TableRow
                                key={index}
                                hover
                                sx={{ cursor: 'pointer' }}
                                onClick={() => {
                                    if (pathname === "/test/schedule-test/select-list") {
                                        setSelectedList(list.listName);
                                        open();
                                    } else {
                                        handleNavigation(list.listName);
                                    }
                                }}
                            >
                                <TableCell>{list.listName}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                
            </Box>
            
        </div>
    )
}



export {SelectTest}

// after the user selects the test, they then select the list
function TestType({ open, close, schedule }) {
    // modal
    // options:
        // Pos test
        // definition test
        // translation test

        const navigate = useNavigate();

        const handleNavigate = (testType) => {
            if (schedule) {
                navigate("/test/schedule-test/select-list", { state: { testType: testType } });
            } else {
                navigate("/test/select-list", { state: { testType: testType } });

            }
        }


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
        <div>
            <Modal
                open={open}
                onClose={close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Select test type
                    </Typography>

                    <Divider />
                    <nav aria-label="test types">
                        {/*go to page where user selects list to be tested on
                            pass the test type too so that i can be used when getting the vocab
                         */}
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => {
                                    handleNavigate("translation")
                                }}>
                                    <ListItemText primary="Translation"/>
                                </ListItemButton>
                            </ListItem>

                            <ListItem disablePadding>
                                <ListItemButton onClick={() => {
                                    handleNavigate("pos")
                                }}>
                                    <ListItemText primary="Parts of Speech"/>
                                </ListItemButton>
                            </ListItem>

                            <ListItem disablePadding>
                                <ListItemButton onClick={() => {
                                    handleNavigate("definition")
                                }}>
                                    <ListItemText primary="Definitions" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </nav>
                </Box>
            </Modal>
        </div>
    );

    
}


