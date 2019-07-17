import React, { Component } from 'react'
import './Prompt.css'

export default class Prompt extends Component {

    makeGuess = e => {
        e.preventDefault();
        if(e.target.guess.value) {
            this.props.handleGuess(e.target.guess.value);
        }
    }

    render() {
        return (
            <div className="guesser-prompt">
                <span>Type your answer here, all words are lowercase</span>
                <form onSubmit={this.makeGuess}>
                    <input type="text" name="guess" />
                    <input type="submit" value="Guess" />
                </form>
                
            </div>
        )
    }
}
