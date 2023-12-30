import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTwitter, faGoogle, faGithub,
} from "@fortawesome/free-brands-svg-icons";

import { authService, firebaseInstance } from "fbase";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, } from "firebase/auth";
import {useState} from "react";
import {
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
} from "firebase/auth";


const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onChange = (event) => {
        const {
            target: {name, value},
        } = event;
        if (name==="email") {
            setEmail(value);
        } else if (name==="password") {
            setPassword(value);
        }
        };
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            let data;
        if (newAccount) {
            //create newAccount
            data = await createUserWithEmailAndPassword(authService, email, password);
        }
        else {
            // log in
            data = await signInWithEmailAndPassword(authService, email, password);
        }
        console.log(data);
    } catch (error) {
        setError(error.message);
    }
    };

    const toggleAccount = () => setNewAccount((prev) => !prev);

    const onSocialClick =  async (event) => {
        const {
            target: {name},
        } = event;
        let provider;
        if (name==="google") {
            provider = new GoogleAuthProvider();
        }
        else if (name ==="github") {
            provider = new GithubAuthProvider();
        }
        const data = await signInWithPopup(authService, provider);
        console.log(data);
    };

    return (
        <div className="authContainer">
            <FontAwesomeIcon
                icon={faTwitter}
                color={"#04AAFF"}
                size="3x"
                style={{marginBottom: 30}}
                />
            <form onSubmit={onSubmit} className="container">
                <input 
                name="email"
                type="email" placeholder="Email" required 
                value={email}
                onChange={onChange}
                className="authInput"
                />
                <input 
                name="password"
                type="password" placeholder="Password" required
                value={password}
                onChange={onChange}
                className="authInput"
                 />
                <input type="submit" value={newAccount ? "Create Account" : "Log In"}
                className="authInput authSubmit" />
                {error && <span className="authError">{error}</span>}
            </form>
            <span onClick={toggleAccount} className="authSwitch">
                {newAccount? "Sign in" : "Create Account"}
            </span>
            <div className="authBtns">
                <button onClick={onSocialClick} name="google" className="authBtn">Continue with Google <FontAwesomeIcon icon={faGoogle} /></button>
                <button onClick={onSocialClick} name="github" className="authBtn">Continue with Github <FontAwesomeIcon icon={faGithub} /></button>
            </div>
        </div>
    );
};

export default Auth;