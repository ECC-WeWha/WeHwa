//app.jsx

import React from "react";
import { Outlet } from "react-router-dom"; //이건뭐야
import Header from "./components/layout/header";  //이거 headar의 함수 쓴다는거야?

function App() {
  return (
    <div className="app-wrapper"> 
      <Header />
      <main style={{ padding: "20px" }}>  
        <Outlet /> {/* 각 페이지가 여기에 렌더링됨 */}  
      </main>
    </div>
    
  );
}




export default App;

