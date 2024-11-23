// Manage various input events across the app

export class InputCheck {
    // no constructors needed

    // When a user is creating an account
    passwordStrength(password) {
        function hasNumber(userString) {
            return /\d/.test(userString);
          }
    
        function hasUppercase(userString) {
            return /[A-Z]/.test(userString);
          }
    
        function hasSpecialChars(userString) {
            return /[!@#$()]/.test(userString);
          }
    
        function checkForChars(userString) {
            return /[a-z]/i.test(userString)
        }
    
        function checkForUnmentionedChars(userString) {
            for (let i = 0; i < userString.length; i++) {
                if (!hasNumber(userString[i]) && !hasSpecialChars(userString[i]) && !checkForChars(userString[i])) {
                    return false;
                }
            }
    
            return true;
        }
    
        let errorMessage = {
            isValid: true,
            errors: []
        };
    
        // must contain:
        // 7 chars minimun
        if (password.length < 7) {
            errorMessage.isValid = false;
            throw new Error("Password cannot be shorter than seven character");
        }
        // at least one number
        if (!hasNumber(password)) {
            errorMessage.isValid = false;
            throw new Error("Password must contain at least one number");
        }
        // upper case letter
        if (!hasUppercase(password)) {
            errorMessage.isValid = false;
            throw new Error("Password must contain an uppercase letter")
        } 
    
        // special char: !, @, #, $, ()
        if (!hasSpecialChars(password)) {
            errorMessage.isValid = false;
            throw new Error("Password must contain at least one special character")
        }
    
        // if contains anything besides theses warn user
        if (!checkForUnmentionedChars(password)) {
            errorMessage.isValid = false;
            throw new Error("Password should not contain any spaces. It should only contain what was specified before");
        }
    
        return errorMessage;
    }

    // When adding a word into the list. Used to find nouns 
    //! everything else will be put into lower case though
    classifyWord(string) {
        function capitalizeFirstLetter(string) {
            const word = string.toLowerCase()
        
            // capitalize first letter and combine with rest of word
            return word.charAt(0).toUpperCase() + word.slice(1);
        };

       
        const articles = ["der", "die", "das"]
        // remove any spaces on the side
        console.log("Before: ", string)
    
        let word = string.trim()
    
        // take the first 3 letters from the word as a seperate string and convert to lower case
        const article = word.slice(0, 3).toLowerCase();
        console.log("Article: ", article)
    
        // if the string does not match (der,die,das), it's not a noun
        if (!articles.includes(article)) {
            // return false
            return word.toLowerCase();
        }
    
        if (articles.includes(article)) {
            // get the rest of the word
            word = word.slice(3)
            // remove any spaces behind the first letter
            word = word.trim()
            // capitalize the first letter
            word = capitalizeFirstLetter(word)
    
            // concatonate the lowercase article + " " + captilized word
            // return the final version of the word
            const completeWord = article + " " + word
            
            return completeWord;
        }
    }

    // verify the input
    checkVocabInput(word) {
        console.log("heyy")
        const native = word.native.trim();
        const translation = word.translation.trim();
        const alpha = /^[a-zA-Z]+(\s[a-zA-Z]+)*$/;

        // string should only contain alphabet
        // what about "-"?
        // I only want to make sure there aren't any numbers/special chars 
        if (!alpha.test(native) || !alpha.test(translation)) {
            throw new Error("Input should only contain alphabetical characters");
        }

        // if input is empty
        if (native === '' || translation === '') {
            throw new Error("Both fields need to be filled in");
        }

        return true
    }
    
}