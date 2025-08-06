import React from "react"
import InputBox from "../common/InputBox"
import GreenButton from "../../components/common/GreenButton";

function Step2Form({ formData, onChange, nextStep,backStep}){
    return (
        <>
            <div className="signup-horizontal-div" style={{width:"660px"}}>
                <div className="signup-div-more">
                    <div className="signup-green-text">국적</div>
                    <div className="signup-need-text">*</div>
                </div>
                <InputBox
                    type="text"
                    name="nationality"
                    placeholder=""
                    value={formData.nationality}
                    onChange={onChange}
                    style={{flex:"1"}}
                />
            </div>
            <div className="signup-horizontal-div" style={{width:"660px"}}>
                <div className="signup-div-more">
                    <div className="signup-green-text">학적</div>
                    <div className="signup-need-text">*</div>
                </div>
                <InputBox
                    type="text"
                    name="studentStatus"
                    placeholder=""
                    value={formData.studentStatus}
                    onChange={onChange}
                    style={{flex:"1"}}
                />
            </div>
            <div className="signup-horizontal-div" style={{width:"660px"}}>
                <div className="signup-div-more">
                    <div className="signup-green-text">학년</div>
                    <div className="signup-need-text">*</div>
                </div>
                <InputBox
                    type="text"
                    name="grade"
                    placeholder=""
                    value={formData.grade}
                    onChange={onChange}
                    style={{flex:"1"}}
                />
            </div>
            <div className="signup-horizontal-div" style={{width:"660px"}}>
                <div className="signup-div-more">
                    <div className="signup-green-text">년생</div>
                    <div className="signup-need-text">*</div>
                </div>
                <InputBox
                    type="number"
                    name="birthYear"
                    placeholder=""
                    value={formData.birthYear}
                    onChange={onChange}
                    style={{flex:"1"}}
                    min={1990}
                    max={2020}
                />
            </div>

            
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "500px",
                margin: "0 auto", }}>
                <GreenButton onClick={backStep} text="이전"></GreenButton>
                <GreenButton onClick={nextStep} text="다음"></GreenButton>
            </div>

            

            
        </>
    );
}

export default Step2Form;