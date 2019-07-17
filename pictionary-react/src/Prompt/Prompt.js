import React, { Component } from 'react'
import './Prompt.css'

export default class Prompt extends Component {
    render() {
        return (
            <div className="guesser-prompt">
                <span>Type your answer here, all words are lowercase</span>
                <input type="text" name="guess" />
                <input type="submit" value="Guess" />
            </div>
        )
    }
}
