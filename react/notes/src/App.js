import './App.css';

function App() {
  return (
    <div className="App">
      <nav>
        <p>hello</p>
      </nav>

      {menu()}
    </div>
  );
}

function menu() {
  return (
    <div className="menu">
      <p>h</p>
    </div>
  );
}

/*1. left vertical active bar
  2. top horizontal active bar
  3. top left corner - user icon
  4. the page to write on (color, default font)
  5. page to create an account
  6. backend database stuff for loging in etc... */

export default App;
