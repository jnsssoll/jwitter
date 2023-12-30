import { authService, dbService } from "fbase";
import { useState } from "react";
import { updateProfile } from "@firebase/auth";

const Profile = ({ userObj, refreshUser }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut();
    };

    const onChange = (event) => {
        const {
            target : {value},
        } = event;
        setNewDisplayName(value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await updateProfile(userObj, { displayName: newDisplayName });
            refreshUser();
        }
    };


   
    return (
        <>
        <form onSubmit={onSubmit}>
            <input 
            onChange={onChange}
            type="text" placeholder="Display Name"
            value={newDisplayName} />
            <input type="submit" value="Update Profile" />
        </form>
        <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};

export default Profile;
