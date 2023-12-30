import {useEffect, useState} from "react";
import AppRouter from "components/Router";
import {authService} from "fbase";
import {updateProfile} from "@firebase/auth"

const App = () => {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn]=useState(false);
  const [userObj, setUserObj] = useState(null);

  const refreshUser = () => {
    setUserObj(authService.currentUser);
    const user = authService.currentUser;
  };

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(user);
        setUserObj(user);
        console.log(user);
      }
      else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  
  return (
    <>
    {init? ( <AppRouter 
    refreshUser={refreshUser}
    isLoggedIn={isLoggedIn} userObj={userObj} />
     ) : ( "initializing..."
     )}
    </>
  );
}

export default App;
