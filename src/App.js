import React from 'react';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      question: "question",
      answers: []
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  render() {
    let myComponent;
    if (this.state.answers.length == 0) {
      myComponent = (
        <div>
        <h1>Supporting Integration</h1>

        <DetailsForm handleSubmit={this.handleSubmit}></DetailsForm>
        <div>{this.state.answers}</div>

        </div>
      )
    }
    else {
      myComponent = (
        <div>
          <h1>Supporting Integration</h1>
          <h2>{this.state.question}</h2>
          <form>
            {this.state.answers.map((ans) => (
              <div key={ans}>
                <input type="radio" id={ans} name="choice" value={ans} />
                <label htmlFor={ans}>{ans}</label>
              </div>
              )
            )}
            <input type="submit" value="&rarr;"></input>
          </form>
        </div>
      )
    }

    return myComponent

  }
  handleSubmit() {
    console.log("test")
    this.setState({answers: ["answer1", "answer2", "answer3", "test"]})
    
  }
}

class DetailsForm extends React.Component {
  render() {
    return (
      <div>
        <form id="details">
          <label htmlFor="fname">First name:</label>
          <input type="text" id="fname" placeholder="First name"></input>
        
          <label htmlFor="lname">Last name:</label>
          <input type="text" id="lname" placeholder="Last name"></input>
        
          <label htmlFor="role">Role:</label>
          <input type="text" id="role" placeholder="Role"></input>
        
          <label htmlFor="desc">Short description of you:</label>
          <input type="text" id="desc" placeholder="Description"></input>
          
          <input type="submit" value="Start" onClick={this.props.handleSubmit}></input>
        </form>
      </div>
    )
  }
}

export default App