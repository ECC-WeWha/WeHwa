import React from "react"
import InputBox from "../common/InputBox"
import GreenButton from "../../components/common/GreenButton";

//아아디 비밀번호 비밀번호확인 닉네임 이름 이메일

function Step1Form({ formData, onChange, nextStep}){
    return (
        <>
            <div className="signup-three" style={{width:"1000px"}}>
                <div className="three left">
                    <div className="signup-green-text">아이디</div>
                    <div className="signup-need-text">*</div>
                </div>
                <div className="three center" style={{display: "flex", alignItems: "center", gap: "10px",marginLeft:"-10px" }}>
                    <InputBox
                            style={{width:"300px"}}
                            type="text"
                            name="userId"
                            placeholder=""
                            value={formData.userId}
                            onChange={onChange}
                        />
                    <GreenButton text="중복체크"></GreenButton>
                </div>
                <div className="three right">
                    <div className="red-text-20px">사용 불가능한 아이디입니다.ⅹ</div>
                </div>
            </div>
            
            <div className="signup-three">
                <div className="three left">
                    <div className="signup-green-text">비밀번호</div>
                    <div className="signup-need-text">*</div>
                </div>
                <div className="three center">
                    <InputBox
                        type="text"
                        name="password"
                        placeholder=""
                        value={formData.password}
                        onChange={onChange}
                        style={{flex:"1"}}
                    />
                </div>
                <div className="three right">
                    <div className="red-text-20px">error message (비번 형식 안 맞음)</div>
                </div>  {/*경고메세지 들어갈 자리*/}
            </div>
            
            <div className="signup-three">
                <div className="three left">
                    <div className="signup-green-text">비밀번호 확인</div>
                    <div className="signup-need-text">*</div>
                </div>
                <div className="three center">
                    <InputBox
                        type="text"
                        name="passwordCheck"
                        placeholder=""
                        value={formData.passwordCheck}
                        onChange={onChange}
                        style={{flex:"1"}}
                    />
                </div>
                <div className="three right">
                    <div className="red-text-20px">error message (비번 형식 안 맞음)</div>
                </div>
            </div>

            <div className="signup-three">
                <div className="three left">
                    <div className="signup-green-text">닉네임</div>
                    <div className="signup-need-text">*</div>
                </div>
                <div className="three center">
                    <InputBox
                        type="text"
                        name="nickname"
                        placeholder=""
                        value={formData.nickname}
                        onChange={onChange}
                        style={{flex:"1"}}
                    />
                </div>
                <div className="three right"></div>{/*빈자리로 일단 해놓기*/}
            </div>
            <div className="signup-three">
                <div className="three left">
                    <div className="signup-green-text">이름</div>
                    <div className="signup-need-text">*</div>
                </div>
                <div className="three center">
                    <InputBox
                        type="text"
                        name="username"
                        placeholder=""
                        value={formData.username}
                        onChange={onChange}
                        style={{flex:"1"}}
                    />
                </div>
                <div className="three right"></div>{/*빈자리로 일단 해놓기*/}
            </div>
            <div className="signup-three">
                <div className="three left">
                    <div className="signup-green-text">이메일</div>
                    <div className="signup-need-text">*</div>
                </div>
                <div className="three center">
                    <InputBox
                        type="text"
                        name="email"
                        placeholder=""
                        value={formData.email}
                        onChange={onChange}
                        style={{flex:"1"}}
                    />
                </div>
                <div className="three right"></div>{/*빈자리로 일단 해놓기*/}
            </div>

            <GreenButton onClick={nextStep} text="다음"></GreenButton>


            
        </>
    );
}

export default Step1Form;