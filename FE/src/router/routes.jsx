// src/router/routes.jsx
// 페이지 이동을 위해 만들었다

import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/home-page";
import LoginPage from '../pages/login-page';
import SignupPage from '../pages/signup-page';
import ProfilePage from "../pages/profile-page";
import BoardPage from "../pages/board-page";
import BoardWrite from "../pages/board-write";
import BoardDetail from "../pages/board-detail";
import BoardScrap from "../pages/board-scrap";
import BoardMyPage from "../pages/board-my-page";
import FriendListPage from '../pages/friend-list-page';
import FriendListDetail from "../pages/friend-list-detail"
import FriendFindPage from '../pages/friend-find-page';
import FriendFindDetail from '../pages/friend-find-detail';
import KakaoRedirection from "../components/user/KakaoRedirection";
import ProfileSetupPage from "../pages/friend-profile-page"



export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // 공통 레이아웃 (맨위꺼 공통으로)
    children: [
      { index : true , element: <HomePage /> }, //이거약간 수정
      { path: "login", element: <LoginPage /> },    
      {path: "signup", element: <SignupPage /> }, 
      {path : "profile", element: <ProfilePage/>}, 
      { path: "board",
        children: [
          { index: true, element: <BoardPage /> },   // /board
          { path: "write", element: <BoardWrite /> }, // /board/write
          { path: ":postId", element: <BoardDetail /> }, // /board/mypage
          { path: "scrap", element: <BoardScrap /> },
          { path: "mypage", element: <BoardMyPage /> }  
        ], },
      { path: "profilesetup", element: <ProfileSetupPage /> },
      { path: "friendlist",
        children: [
          { index: true, element: <FriendListPage /> },
          { path: ":id", element: <FriendListDetail /> },
          { path: "requests",element: <FriendListPage/>},
        ], }, 
      { path: "friendfind", 
        children: [
        { index: true, element: <FriendFindPage /> }, // /friendfind
        { path: ":id", element: <FriendFindDetail /> }, // /friendfind/:id
      ], },  //일단 각 페이지별로 하나씩은 */},
      {path:"/kakao/callback",element:< KakaoRedirection/>},
      
    ],
  },
]);



export default router;


