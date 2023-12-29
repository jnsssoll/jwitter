import {dbService} from "fbase";
import {doc, deleteDoc, updateDoc} from "firebase/firestore";
import {useState} from "react";

const Jweet = ({ jweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newJweet, setNewJweet] = useState(jweetObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("삭제하시겠습니까?");
        console.log(ok);
        if(ok) {
            console.log(jweetObj.id);
            //const data = await dbService.doc(`jweets/${jweetObj.id}`)
            const data = deleteDoc(doc(dbService, "jweets", jweetObj.id));
            console.log(data);
        }
    }

    const toggleEditing = () => setEditing((prev) => !prev);

    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setNewJweet(value);
    };

    const onSubmit = async (event) => {
        event.preventDefault(); //빈 값이 없게?
        //await dbService.doc(`jweet~~~~)
        await updateDoc(doc(dbService, "jweets", jweetObj.id), {text:newJweet});
        setEditing(false);
    };


    return (
        <div>
            {editing ? (
                <>
                <form onSubmit={onSubmit}>
                    <input onChange={onChange} value={newJweet} required />
                    <input type="submit" value="Update Jweet" />
                </form>
                <button onClick={toggleEditing}>Cancel</button>
                </>
            ):(
                <>
            <h4>{jweetObj.text}</h4>
            {isOwner && (
            <>
            <button onClick={onDeleteClick}>Delete Jweet</button>
            <button onClick={toggleEditing}>Edit Jweet</button>
            </>
            )}
            </>
            )}
        </div>
    );
};

export default Jweet;