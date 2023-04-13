import React from 'react';

import firebase from "firebase/compat/app";

import { collection, doc, addDoc, getFirestore, setDoc, getDoc, getDocs, query, updateDoc } from 'firebase/firestore';
import { initializeApp } from "firebase/app";

import { useCollectionData } from "react-firebase-hooks/firestore";
import { waitForElementToBeRemoved } from '@testing-library/react';

import "./index.css"

const firebaseConfig = {
    apiKey: "AIzaSyDVN5G7GDHLTOY7i37RgN9OrmsZtY40YII",
    authDomain: "honours-project-476b0.firebaseapp.com",
    projectId: "honours-project-476b0",
    storageBucket: "honours-project-476b0.appspot.com",
    messagingSenderId: "468964246212",
    appId: "1:468964246212:web:2d6e67a0251d58d974ff91",
    measurementId: "G-TJ19SJLYLN"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const usersRef = collection(db, "users")
const scenariosRef = collection(db, "scenarios")
const promptsRef = collection(db, "start_prompts")
const dljs = require("damerau-levenshtein-js")

class App extends React.Component {
    
    constructor() {
        super();
        this.state = {
            question: "question",
            answers: [],
            user: "",
            prompt: ""
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.setUser = this.setUser.bind(this)
    }

    async handleSubmit() {
        // this.state.answers = ["answer1", "answer2", "answer3", "test"]
        const q = query(scenariosRef)
        await getDocs(q).then((querySnap) => querySnap.forEach((doc) => {
            this.state.answers.push(doc.data())}))

        const q2 = query(promptsRef)
        await getDocs(q2).then((querySnap) => querySnap.forEach((doc) => {
            this.setState({ prompt: doc.data() })}))
    }

    setUser(docRef) {
        this.setState({user: docRef.id})
    }

    render() {
        return (
            <div className="App">
                {this.state.user == "" ? 
                <HomePage handleSubmit={this.handleSubmit} setUser={this.setUser} answers={this.answers}/> 
                : 
                this.state.prompt == "" ?
                null :
                <Questions prompt={this.state.prompt} answers={this.state.answers} user={this.state.user}/>}
            </div>
        )
    }
}






class HomePage extends React.Component {

    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.setUser = this.setUser.bind(this)
    }

    handleSubmit() {
        this.props.handleSubmit();
    }

    setUser(docRef) {
        this.props.setUser(docRef);
    }

    render() {
        return (
            <div className="home-page">
                <h1>Supporting Integration</h1>

                <DetailsForm handleSubmit={this.handleSubmit} setUser={this.setUser}></DetailsForm>
            </div>
        )
    }
}




class DetailsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: "",
            last_name: "",
            role: "",
            description: ""
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleFname = this.handleFname.bind(this)
        this.handleLname = this.handleLname.bind(this)
        this.handleRole = this.handleRole.bind(this)
        this.handleDesc = this.handleDesc.bind(this)
    }
    async sendUserData(e) {
        e.preventDefault();
        const docRef = await addDoc(collection(db, "users"), {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            role: this.state.role,
            description: this.state.description
        }).then((docRef) => {this.props.setUser(docRef)})
    }
    handleSubmit(e) {
        e.preventDefault();
        const docRef = this.sendUserData(e)
        this.props.handleSubmit(docRef)
    }
    handleFname(e) {
        this.state.first_name = e.target.value
    }
    handleLname(e) {
        this.state.last_name = e.target.value
    }
    handleRole(e) {
        this.state.role = e.target.value
    }
    handleDesc(e) {
        this.state.description = e.target.value
    }
    render() {
        return (
            <div>
                <form id="details">
                    <div id="fname">
                        <label htmlFor="fname">First name:</label>
                        <input onChange={this.handleFname} type="text" id="fname" placeholder="First name"></input>
                    </div>

                    <div id="lname">
                        <label htmlFor="lname">Last name:</label>
                        <input onChange={this.handleLname} type="text" id="lname" placeholder="Last name"></input>
                    </div>

                    <div id="role">
                        <label htmlFor="role">Role:</label>
                        <input onChange={this.handleRole} type="text" id="role" placeholder="Role"></input>
                    </div>

                    <div id="desc">
                        <label htmlFor="desc">Short description of you:</label>
                        <input onChange={this.handleDesc} type="text" id="desc" placeholder="Description"></input>
                    </div>

                    <div id="submit-button">
                        <input type="submit" value="Start" onClick={this.handleSubmit}></input>
                    </div>
                </form>
            </div>
        )
    }
}





class Questions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: "question",
            answers: this.props.answers,
            user: this.props.user,
            tags: [],
            curChoice: "",
            userString: "",
            prompt: this.props.prompt
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        console.log(this.state.prompt, this.props.prompt)
    }

    async handleSubmit(e) {
        e.preventDefault();

        this.state.answers.forEach((v) => {
            
            if (this.state.curChoice == v["key"]) {

                let toAdd = []
                v["add_tags"].forEach((e) => { 
                    if (!this.state.tags.includes(e)) {
                        toAdd.push(e)
                    }
                })
                
                let removedArr = this.state.tags
                v["remove_tags"].forEach((e) => {
                    removedArr = removedArr.filter(x => x != e)
                })

                let temp = toAdd.concat(removedArr)
                this.setState({ tags: temp })
            }
        })
        //this.setState({ userString: this.state.userString + this.state.curChoice})
        this.state.userString = this.state.userString + this.state.curChoice
        console.log(this.state.userString)

        if (this.state.userString.length == 5) {
            const userRef = doc(db, "users", this.state.user)
            await updateDoc(userRef, { answer: this.state.userString })
        }
    }

    render() {
        return (

            <div>
                {this.state.userString.length < 5 ?
                    <div>
                        <h1>Supporting Integration</h1>
                        <h3>{this.state.prompt["condition"]}</h3>
                        <form onSubmit={(e) => this.handleSubmit(e)}>
                            {this.state.answers.map((ans) => {
                                return (
                                    ans["condition"].every(v => this.state.tags.includes(v)) &&
                                    ans["false_condition"].every(v => !this.state.tags.includes(v)) &&
                                    (
                                    <div key={ans["key"]}>
                                        <input required type="radio" onClick={() => this.state.curChoice=ans["key"]} id={ans["key"]} name="choice" value={ans["key"]} />
                                        <label htmlFor={ans["key"]}>{ans["choice"]}</label>
                                    </div>
                                    )
                                )
                                }
                            )
                            }
                            
                            <input type="submit" value="&rarr;"></input>
                        </form>
                    </div>
                    :
                    <AnswerScreen choices={this.state.answers} userString={this.state.userString} user_id={this.state.user} />
                }
            </div>
        )
    }
}



class AnswerScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userString: this.props.userString,
            user_id: this.props.user_id,
            users: []
        }
        this.getUsers = this.getUsers.bind(this)
        this.setUsers = this.setUsers.bind(this)
        
        
        console.log("state id:",this.state.user_id)
    }

    async componentDidMount() {
        await this.getUsers()
    }

    async getUsers() {
        const q = query(usersRef)
        await getDocs(q).then((querySnap) => querySnap.forEach((doc) => {this.setUsers(doc)}))
    }

    setUsers(user) {
        let temp = this.state.users
        temp.push(user)
        this.setState({ users: temp })
    }

    render() {
        return (
            <div id="object-container">
                {this.state.users.map((user, index) => {
                    console.log(user.id)
                    return (
                        user.id != this.state.user_id && user.id != "placeholder" &&
                        <UserObject key={index} choices={this.props.choices} userString={this.state.userString} answer={user.data()["answer"]} first_name={user.data()["first_name"]} last_name={user.data()["last_name"]} role={user.data()["role"]} description={user.data()["description"]} />
                    )
                })}
            </div>
        )
    }
}



class UserObject extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            first_name: this.props.first_name,
            last_name: this.props.last_name,
            role: this.props.role,
            description: this.props.description,
            answer: this.props.answer,
            seen: false
        }
        console.log(this.state.first_name)
        this.togglePopUp = this.togglePopUp.bind(this)
        this.calculate_dld = this.calculate_dld.bind(this)
    }

    calculate_dld(userString) {
        console.log("distance between",userString,this.state.answer)
        return dljs.distance(userString, this.state.answer)
    }

    togglePopUp() {
        this.setState({ seen: !this.state.seen })
    }

    render() {
        return (
            <div className="user-object-container">
                <div className="user-object" onClick={this.togglePopUp}>
                    <div id="answer-name">
                        <b>Name:</b> {this.state.first_name + " " + this.state.last_name}
                    </div>
                    <div id="answer-role">
                        <b>Role:</b> {this.state.role}
                    </div>
                    <div id="answer-desc">
                        <b>Description:</b> {this.state.description}
                    </div>
                    <div id="answer-answer">
                        <b>Difference:</b> {this.calculate_dld(this.props.userString)}
                    </div>
                </div>
                
                    {this.state.seen ? 
                        <PopUp className="popup" userString={this.props.userString} answer={this.state.answer} choices={this.props.choices} toggle={this.togglePopUp} score={this.calculate_dld(this.props.userString)}/>
                        : null
                    }
            </div>
        )
    }
}


class PopUp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            choices: this.props.choices,
            userString: this.props.userString,
            answer: this.props.answer,
            choices: this.props.choices
        }
        this.handleClick = this.handleClick.bind(this)
        this.stopPropagation = this.stopPropagation.bind(this)

    }
    handleClick() {
        console.log("clicked")
        this.props.toggle();
    }
    stopPropagation(e) {
        e.stopPropagation();
    }
    compareAnswers() {
        let elements = []
        for (let i=0; i < this.state.userString.length; i++) {
            let comp1 = ""
            let comp2 = ""
            this.state.choices.forEach((v, index) => {
                if (v["key"] == this.state.userString[i]) {
                    comp1 = v["choice"]
                }
                if (v["key"] == this.state.answer[i]) {
                    comp2 = v["choice"]
                }
            })
            if (comp1 == comp2) {
                elements.push(
                    <div className="comparison" key={i}>
                        <div className="comp1 green">
                            ✔ {comp1}
                        </div>
                        <div className="comp2 green">
                            ✔ {comp2}
                        </div>
                    </div>
                )
            } else {
                elements.push(
                    <div className="comparison" key={i}>
                        <div className="comp1 red">
                            ✘ {comp1}
                        </div>
                        <div className="comp2 red">
                            ✘ {comp2}
                        </div>
                    </div>
                )
            }
        }
        console.log("test")
        return elements
    }
    render() {
        return (
            <div className="modal-container" onClick={this.handleClick}>
                <div className="modal" onClick={this.stopPropagation}>
                    <div className="modal-title">
                        Distance between your decisions is {this.props.score} (lower is better)
                    </div>
                    <div className="modal-users">
                        <span>Your answers</span>
                        <span>User's answers</span>
                    </div>
                    <div className="compare-container">
                        {this.compareAnswers()}
                    </div>
                </div>
            </div>
        )
    }
}


export default App