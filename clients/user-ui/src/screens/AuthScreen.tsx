import React, { useState } from "react";
import Login from "../shared/Auth/Login";
import Register from "../shared/Auth/Register";
import Verification from "../shared/Auth/Verification";

const AuthScreen = ({ setIsOpen }: { setIsOpen: (e: boolean) => void }) => {
  const [activeState, setActiveState] = useState("login");

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLDivElement && e.target.id === "screen") {
      setIsOpen(false);
    }
  };

  return (
    <div
      className="w-full fixed top-0 left-0 h-screen z-50 flex items-center justify-center bg-[#00000027]"
      id="screen"
      onClick={handleClose}
    >
      <div className="w-[500px] bg-slate-900 p-3 rounded shadow-sm ">
        {activeState === "login" && <Login setActiveState={setActiveState} setIsOpen={setIsOpen} />}
        {activeState === "register" && (
          <Register setActiveState={setActiveState} />
        )}
        {activeState === "verification" && (
          <Verification setActiveState={setActiveState} />
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
