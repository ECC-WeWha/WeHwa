import React from "react"
import InputBox from "../common/InputBox"
import GreenButton from "../../components/common/GreenButton";

function Step1Form({ formData, onChange, nextStep}){
    return (
        <>
            <div className="signup-horizontal-div">
                <div className="signup-div-more">
                    <div className="signup-green-text">아이디</div>
                    <div className="signup-need-text">*</div>
                </div>
                <InputBox
                    type="text"
                    name="userId"
                    placeholder=""
                    value={formData.userId}
                    onChange={onChange}
                    style={{flex:"1"}}
                />
            </div>
            <div className="signup-horizontal-div">
                <div className="signup-div-more">
                    <div className="signup-green-text">비밀번호</div>
                    <div className="signup-need-text">*</div>
                </div>
                <InputBox
                    type="text"
                    name="password"
                    placeholder=""
                    value={formData.password}
                    onChange={onChange}
                    style={{flex:"1"}}
                />
            </div>
            <div className="signup-horizontal-div">
                <div className="signup-div-more">
                    <div className="signup-green-text">비밀번호 확인</div>
                    <div className="signup-need-text">*</div>
                </div>
                <InputBox
                    type="text"
                    name="passwordCheck"
                    placeholder=""
                    value={formData.passwordCheck}
                    onChange={onChange}
                    style={{flex:"1"}}
                />
            </div>

            
            {/* 여기부터는 뒤에 경고 안뜨는 것들*/}
            <div className="signup-horizontal-div" style={{width:"660px"}}>
                <div className="signup-div-more">
                    <div className="signup-green-text">닉네임</div>
                    <div className="signup-need-text">*</div>
                </div>
                <InputBox
                    type="text"
                    name="nickname"
                    placeholder=""
                    value={formData.nickname}
                    onChange={onChange}
                    style={{flex:"1"}}
                />
            </div>

            <div className="signup-horizontal-div" style={{width:"660px"}}>
                <div className="signup-div-more">
                    <div className="signup-green-text">이름</div>
                    <div className="signup-need-text">*</div>
                </div>
                <InputBox
                    type="text"
                    name="username"
                    placeholder=""
                    value={formData.username}
                    onChange={onChange}
                    style={{flex:"1"}}
                />
            </div>

            <div className="signup-horizontal-div" style={{width:"660px"}}>
                <div className="signup-div-more">
                    <div className="signup-green-text">이메일</div>
                    <div className="signup-need-text">*</div>
                </div>
                <InputBox
                    type="text"
                    name="email"
                    placeholder=""
                    value={formData.email}
                    onChange={onChange}
                    style={{flex:"1"}}
                />
            </div>

            <GreenButton onClick={nextStep} text="다음"></GreenButton>


            
        </>
    );
}

export default Step1Form;