import React from "react"
import InputBox from "../common/InputBox"
import GreenButton from "../../components/common/GreenButton";

// 국적 학적 학년 년생

function Step2Form({ formData, onChange, nextStep,backStep}){
    return (
        <>
            <div className="signup-three">
                <div className="three left">
                    <div className="signup-green-text">국적</div>
                    <div className="signup-need-text">*</div>
                </div>
                <div className="three center">
                    <InputBox
                        type="select"
                        name="nationality"
                        placeholder=""
                        value={formData.nationality}
                        onChange={onChange}
                        style={{flex:"1"}}
                        options={[
                            {value: "Korea", label:"Korea"},
                            {value: "America", label:"America"},
                            {value: "Japan", label:"Japan"},
                            {value: "China", label:"China"},
                            {value: "Thailand", label:"Thailand"},
                            {value: "French", label:"French"},
                            {value: "Germany", label:"Germany"},
                        ]}
                    />
                </div>
                <div className="three right"></div>  {/*비워놓고*/}
            </div>
            <div className="signup-three">
                <div className="three left">
                    <div className="signup-green-text">학적</div>
                </div>
                <div className="three center" style={{marginLeft:"-850px"}}>
                    <InputBox
                        type="radio"
                        name="studentStatus"
                        value={formData.studentStatus}
                        onChange={onChange}
                        options={[
                            { value: "재학생", label: "재학생" },
                            { value: "졸업생", label: "졸업생" },
                            { value: "기타", label: "기타" },
                        ]}
                        />
                </div>
            </div>
            <div className="signup-three">
                <div className="three left">
                    <div className="signup-green-text">학년</div>
                </div>
                <div className="three center">
                    <InputBox
                        type="text"
                        name="grade"
                        placeholder=""
                        value={formData.grade}
                        onChange={onChange}
                        style={{flex:"1"}}
                    />
                </div>
                <div className="three right">
                    <div className="red-text-20px">숫자만 입력해 주세요. </div>
                </div>  {/*경고메세지 들어갈 자리*/}
            </div>
            <div className="signup-three">
                <div className="three left">
                    <div className="signup-green-text">년생</div>
                </div>
                <div className="three center">
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
                <div className="three right"></div>  {/*경고메세지 들어갈 자리*/}
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