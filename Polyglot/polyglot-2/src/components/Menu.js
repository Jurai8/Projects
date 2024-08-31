import { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


export default function MenuListComposition({ wordToUpdate, handleClose }) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

 /*
  const handleClose = (event, value) => {
    console.log("Target: ", value);

    setWordToUpdate(() => {
      if (value === null || value === undefined) {
        return "which word";
      }
      return value;
    });



    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };
*/

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Stack direction="row" spacing={2}>
      <div>
        <Button
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? 'composition-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          variant='contained'
          onClick={handleToggle}
          endIcon={<KeyboardArrowDownIcon />}
        >
          {wordToUpdate}
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
          style={{ zIndex: 1300 }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom-start' ? 'left top' : 'left bottom',
              }}
            >
              <Paper 
                variant="elevation"
                elevation={12}
                style={{ backgroundColor: '#fff' }}
              >
                <ClickAwayListener onClickAway={() => {
                       handleClose();
                       setOpen(false)}}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem onClick={(event) => {
                       handleClose(event, "Native");
                       setOpen(false);
                    }}>
                        Native
                    </MenuItem>
                    <MenuItem onClick={(event) => {
                       handleClose(event, "translation");
                       setOpen(false);
                    }}>
                        Translation
                    </MenuItem>
                    <MenuItem onClick={(event) => {
                       handleClose(event, "both");
                       setOpen(false);
                    }}>
                        Native & Translation
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </Stack>
  );
}