import React,{useState, useMemo} from "react"
import InputBox from "../common/InputBox";
import GreenButton from "../../components/common/GreenButton";
import SelectBox from "../common/Select";
import RadioBox from "../common/Radio";
// 국적 학적 학년 년생

function Step2Form({ formData, onChange, nextStep,backStep}){

    const nationalityError = useMemo(() => {
        return formData.nationality ? "" : "error";
    }, [formData.nationality]);
    const isStepValid = !nationalityError;


    return (
        <>
            <div className="signup-three">
                <div className="three left">
                    <div className="signup-green-text">국적</div>
                    <div className="signup-need-text">*</div>
                </div>
                <div className="three center">
                    <SelectBox
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
                        ]}/>
                </div>
                <div className="three right"></div>  {/*비워놓고*/}
            </div>
            <div className="signup-three">
                <div className="three left">
                    <div className="signup-green-text">학적</div>
                </div>
                <div className="three center" style={{marginLeft:"-700px"}}>
                    <RadioBox 
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
                        type="number"
                        name="grade"
                        placeholder=""
                        value={formData.grade}
                        onChange={onChange}
                        style={{flex:"1"}}
                        min={1}
                        max={8}
                    />
                </div>
                <div className="three right"></div>
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
                <GreenButton
                onClick={() => {
                    if (isStepValid) {
                    nextStep();
                    } else {
                    alert("입력값을 확인해주세요");
                    }
                }}
                text="다음"
                />
            </div>
        </>
    );
}

export default Step2Form;