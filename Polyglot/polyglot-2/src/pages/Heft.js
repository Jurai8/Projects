import * as React from 'react';
import VocabBook from '../components/Table'


// button leading to current page should be removed
export default function Heft () {
    // <AddWord> will pop up as a modal when the user wants to enter a word
    return (
        <div>
            {/* create a shadow around the box*/}
            <VocabBook />
        </div>
    )
}