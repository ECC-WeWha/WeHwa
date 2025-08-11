// src/router/routes.jsx
// 페이지 이동을 위해 만들었다

import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/home-page";
import LoginPage from '../pages/login-page';
import SignupPage from '../pages/signup-page';
import BoardPage from "../pages/board-page";
import BoardWrite from "../pages/board-write";
import BoardDetail from "../pages/board-detail";
import BoardScrap from "../pages/board-scrap";
import BoardMyPage from "../pages/board-my-page";
//import FriendListPage from '../pages/friend-list-page';
//import FriendFindPage from '../pages/friend-find-page';
import KakaoRedirection from "../components/user/KakaoRedirection";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // 공통 레이아웃 (맨위꺼 공통으로)
    children: [
      { path: "", element: <HomePage /> },
      { path: "login", element: <LoginPage /> },    
      {path: "signup", element: <SignupPage /> },   
      { path: "board",
        children: [
          { index: true, element: <BoardPage /> },   // /board
          { path: "write", element: <BoardWrite /> }, // /board/write
          { path: ":postId", element: <BoardDetail /> }, 
          { path: "scrap", element: <BoardScrap /> },
          { path: "mypage", element: <BoardMyPage /> }  
        ], },
      {/*{ path: "board", element: <BoardPage /> },
      { path: "friends-list", element: <FriendListPage /> },
      { path: "friends-find", element: <FriendFindPage /> },  //일단 각 페이지별로 하나씩은 */},
      {path:"/kakao/callback",element:< KakaoRedirection/>},
    ],
  },
]);



export default router;


