import {dbService, storageService} from "fbase";
import {doc, deleteDoc, updateDoc} from "firebase/firestore";
import {useState} from "react";
import {deleteObject, ref} from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlus, faTimes, faTrash, faPencilAlt} from "@fortawesome/free-solid-svg-icons";

const Jweet = ({ jweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newJweet, setNewJweet] = useState(jweetObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("삭제하시겠습니까?");
        if(ok) {
            //const data = await dbService.doc(`jweets/${jweetObj.id}`)
            await deleteDoc(doc(dbService, "jweets", jweetObj.id));
            if (jweetObj.attachmentUrl != "")
                await deleteObject(ref(storageService,jweetObj.attachmentUrl));
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
        <div className="jweet">
            {editing ? (
                <>
                <form onSubmit={onSubmit} className="container jweetEdit">
                    <input onChange={onChange} value={newJweet} required
                    placeholder="Edit your jweet"
                    autoFocus
                    className="formInput" />
                    <input type="submit" value="Update Jweet" className="formBtn" />
                </form>


                <button onClick={toggleEditing} className="formBtn cancleBtn">Cancel</button>
                </>
            ):(
                <>
            <h4>{jweetObj.text}</h4>
            {jweetObj.attachmentUrl && (
                <img src={jweetObj.attachmentUrl} width="50px" height="50px" />
            )}
            {isOwner && (
                <div className="jweet__actions">
                    <span onClick={onDeleteClick}>
                        <FontAwesomeIcon icon={faTrash} />
                    </span>
                    <span onClick={toggleEditing}>
                        <FontAwesomeIcon icon={faPencilAlt} />
                    </span>
                </div>
            )}
            </>
            )}
        </div>
    );
};

export default Jweet;