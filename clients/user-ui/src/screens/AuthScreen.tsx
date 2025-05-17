import { useState } from "react";
import Login from "../shared/Auth/Login";
import Register from "../shared/Auth/Register";

const AuthScreen = () => {
  const [activeState, setActiveState] = useState("login");
  return (
    <div className="w-full fixed top-0 left-0 h-screen z-50 flex items-center justify-center bg-[#00000027]">
      <div className="w-[500px] bg-slate-900 p-3 rounded shadow-sm ">
        {activeState === "login" ? (
          <Login setActiveState={setActiveState} />
        ) : (
          <Register setActiveState={setActiveState} />
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
