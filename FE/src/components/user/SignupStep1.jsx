import React, {useState, useMemo} from "react"
import InputBox from "../common/InputBox"
import GreenButton from "../../components/common/GreenButton";
import "../../styles/signup.css";

function Step1Form({ formData, onChange, nextStep}){
    
    const [touched, setTouched] = useState({ //사용자가 입력했는지 확인용
        //아무 입력도 안했는데 에러 뜨면 싫으니까 추가한 코드
        userId: false,
        password: false,
        passwordCheck: false,
    });
    const onBlur = (e) => { //error떠도 상관없으면 삭제해도 ㄱㅊ
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
    }; 
    const handleChange = (e) => {   //바로바로 입력할때마다 나오게
        onChange(e);
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
    };
    //아이디를 영문으로 하지 않은 죄
    const idError = useMemo(() => {
        if (!touched.userId) return "";
        if (!formData.userId) return "아이디를 입력해주세요.";
        if (!/^[A-Za-z]{8,11}$/.test(formData.userId))
            return "아이디는 영문 8~11자여야 합니다.";
        return "";
    }, [touched.userId, formData.userId]);
    //비밀번호를 영문으로 하지 않은 죄
    const pwError = useMemo(() => {
        if (!touched.password) return "";
        if (!formData.password) return "비밀번호를 입력해주세요.";
        if (!/^[A-Za-z]{8,11}$/.test(formData.password))
        return "비밀번호는 영문 8~11자여야 합니다.";
        return "";
    }, [touched.password, formData.password]);
    const pwCheckError = useMemo(() => {
        if (!touched.passwordCheck) return "";
        if (!formData.passwordCheck) return "비밀번호 확인을 입력해주세요.";
        if (formData.password !== formData.passwordCheck)
        return "비밀번호가 일치하지 않습니다.";
        return "";
    }, [touched.passwordCheck, formData.password, formData.passwordCheck]);
    //비어있으면 못 넘어가게
    const nicknameError = useMemo(() => {
        if (!formData.nickname) return "error";
        return "";
    }, [formData.nickname]);
    const usernameError = useMemo(() => {
        if (!formData.username) return "error";
        return "";
    }, [formData.username]);
    const emailError = useMemo(() => {
        if (!formData.email) return "error";
        return "";
    }, [formData.email]);

    const isStepValid =
    !idError &&
    !pwError &&
    !pwCheckError &&
    !!formData.userId &&
    !!formData.password &&
    !!formData.passwordCheck &&
    !nicknameError &&
    !usernameError &&
    !emailError;

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
                            onChange={handleChange}
                        />
                    <GreenButton text="중복체크"></GreenButton>
                </div>
                <div className="three right">
                    {idError && <div className="red-text-20px">{idError}</div>}
                </div>
            </div>
            
            <div className="signup-three">
                <div className="three left">
                    <div className="signup-green-text">비밀번호</div>
                    <div className="signup-need-text">*</div>
                </div>
                <div className="three center">
                    <InputBox
                        type="password"
                        name="password"
                        placeholder=""
                        value={formData.password}
                        onChange={handleChange}
                        style={{flex:"1"}}
                    />
                </div>
                <div className="three right">
                    {pwError && <div className="red-text-20px">{pwError}</div>}
                </div>  
            </div>
            
            <div className="signup-three">
                <div className="three left">
                    <div className="signup-green-text">비밀번호 확인</div>
                    <div className="signup-need-text">*</div>
                </div>
                <div className="three center">
                    <InputBox
                        type="password"
                        name="passwordCheck"
                        placeholder=""
                        value={formData.passwordCheck}
                        onChange={handleChange}
                        style={{flex:"1"}}
                    />
                </div>
                <div className="three right">
                    {pwCheckError && <div className="red-text-20px">{pwCheckError}</div>}
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
        </>
    );
}

export default Step1Form;