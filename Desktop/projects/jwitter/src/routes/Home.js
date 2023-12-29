import {useState, useEffect} from "react";
import {addDoc, collection, onSnapshot} from "firebase/firestore";
import {dbService} from "fbase";
import Jweet from "components/Jweet"

const Home = ({userObj}) => {
    const [jweet, setJweet] = useState("");
    const [jweets, setJweets] = useState([]);

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
        //await collection("jweets").add(~~~) 대신
        await addDoc(collection(dbService, "jweets"), {  //컬렉션 생성
            text: jweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        });
        setJweet("");
    };

    const onChange = (event) => {
        event.preventDefault();
        const {
            target : {value},
        } = event;
        setJweet(value);
    };

    return (
        <>
        <form onSubmit={onSubmit}>
            <input value={jweet} onChange={onChange} type="text"
            placeholder="What's on your mind?"
            maxLength={120} />
            <input type="submit" value="Jweet" />
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