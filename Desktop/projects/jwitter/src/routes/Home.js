import {useState, useEffect} from "react";
import {addDoc, collection, onSnapshot} from "firebase/firestore";
import {dbService, storageService} from "fbase";
import Jweet from "components/Jweet"
import {v4 as uuidv4} from "uuid";
import {ref, uploadString, getDownloadURL} from "firebase/storage";


const Home = ({userObj}) => {
    const [jweet, setJweet] = useState("");
    const [jweets, setJweets] = useState([]);
    const [attachment, setAttachment] = useState("");

    useEffect(() => {
        // dbService.collection("jweets").onSnapshot((snapshot) => {
            onSnapshot(collection(dbService, "jweets"), (snapshot) => {
            const newArray = snapshot.docs.map((document) => ({
                id: document.id,
                ...document.data(),
            }));
            setJweets(newArray);
        });        
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        if (attachment !== "") {
        const attachmentRef = ref(storageService,`${userObj.uid}/${uuidv4()}`);
        const response = await uploadString(attachmentRef, attachment, "data_url");
        attachmentUrl = await getDownloadURL(response.ref);
        }
         //await collection("jweets").add(~~~) 대신
        await addDoc(collection(dbService, "jweets"), {  //컬렉션 생성
            text: jweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        });
        setJweet("");
        setAttachment("");
    };

    const onChange = (event) => {
        event.preventDefault();
        const {
            target : {value},
        } = event;
        setJweet(value);
    };

    const onFileChange = (event) => {
        const {
            target : {files},
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget : {result},
            } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };

    const onClearAttachment = () => setAttachment("");

    return (
        <>
        <form onSubmit={onSubmit}>
            <input value={jweet} onChange={onChange} type="text"
            placeholder="What's on your mind?" 
            maxLength={120} />
            <input type="file" accept="image/*" onChange={onFileChange} />   
            <input type="submit" value="Jweet" />
            {attachment && (
                <div>
                    <img src={attachment} width="50px" height="50px" />
                    <button onClick={onClearAttachment}>Clear</button>
                </div>
            )}
        </form>
        <div>
            {jweets.map((jweet) => (
                <Jweet key={jweet.id} jweetObj={jweet}
                isOwner={jweet.creatorId === userObj.uid}
                />
            ))}
        </div>
        </>
    );
};

export default Home;