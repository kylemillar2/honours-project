import React from 'react';
import PropTypes from 'prop-types';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      question: "question",
      answers: ["answer1", "answer2", "answer3"]
    }
  }
  update(e) {
    this.setState({question: e.target.value})
  }
  render() {
    return (
      <div>
        <h1>Supporting Integration</h1>
        <h2>{this.state.question}</h2>
        <ul>
          {this.state.answers.map((ans) => (
            <li key={ans}>
              <input type="checkbox" name="check" value={ans}
              onClick={e => this.onlyOne(e.target.value)} />{ans}
            </li>
          )
          )}
        </ul>
      </div>
    )
  }
  onlyOne(checkedAns) {
    let checkboxes = document.getElementsByName("check")
    checkboxes.forEach((item) => {
      if (item.value !== checkedAns) {
        item.checked = false
      }
    })
  }
}



export default App