import React ,{useMemo} from "react"
import { useNavigate } from "react-router-dom";
import GreenButton from "../../components/common/GreenButton";
import "../../styles/signup.css";
import axios from "axios";


function Step3Form({ formData, onChange,backStep}){
    const navigate = useNavigate();
    
    const setField = (name, value) => {
        onChange({ target: { name, value } });  //이건뭘까
    };

    const agreeAll = useMemo(() => { //전체동의 여부
        return !!formData.agreeAge && !!formData.agreeMarketing;
    }, [formData.agreeAge, formData.agreeMarketing]);
    const toggleAgreeAll = (checked) => {
        setField("agreeAge", checked);
        setField("agreeMarketing", checked);
    };
    const canSubmit = !!formData.agreeAge; //필수동의 체크 여부

    const handleSignup = async () => {
        if (!canSubmit) {
        alert("필수약관에 동의해주세요");
    return;
    }
    try {
        const res = await axios.post(
            "/api/signup", //백엔드의 경로//수정수정////////////////언젠가는/////
            {
            ...formData,
            over14: !!formData.agreeAge,
            marketing_opt_in: !!formData.agreeMarketing,
            },
        );
        alert("회원가입이 완료되었습니다.");
        navigate("/login", { replace: true });
        } catch (err) {
        console.error(err);
        alert("회원가입 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };
    return (
        <>  
            <div style={{ width: "660px", margin: "0 auto"}}>
                <div className="signup-horizontal-div">
                    <div style={{ display:"flex",alignItems:"center",gap:"8px"}}>
                        <input
                            type="checkbox"
                            className="custom-checkbox"
                            checked={agreeAll}
                            onChange={(e)=>toggleAgreeAll(e.target.checked)}/>
                        <div className="green-text-24px">전체 약관 동의</div>
                    </div>
                    <div style={{
                            fontFamily: "'IBM Plex Sans KR', sans-serif",
                            fontSize: "24px",
                            lineHeight: "100%",
                            color: "#36AE92",
                            textDecoration:'underline'
                            }}> 자세히 보기 &gt;&gt;
                    </div>
                </div>
                <div className="signup-horizontal-div">
                    <div style={{ display:"flex",alignItems:"center",gap:"8px",marginLeft:"58px",marginTop:"10px"}}>
                        <input type="checkbox" className="custom-checkbox"
                        checked={!!formData.agreeAge}                 
                        onChange={(e) => setField("agreeAge", e.target.checked)}/>
                        <div className="green-text-24px">[필수] 만 14세 이상입니다.</div>
                    </div>
                </div>
                <div className="signup-horizontal-div">
                    <div style={{ display:"flex",alignItems:"center",gap:"8px",marginLeft:"58px",marginTop:"10px"}}>
                        <input type="checkbox" className="custom-checkbox"
                        checked={!!formData.agreeMarketing}
                        onChange={(e) => setField("agreeMarketing", e.target.checked)} />
                        <div className="green-text-24px">[선택] 마케팅 정보 수신 및 선택적 개인정보 제공.</div>
                    </div>
                </div>
            </div>

            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "500px",
                margin: "0 auto", }}>
                <GreenButton onClick={backStep} text="이전"></GreenButton>
                <GreenButton onClick={handleSignup} text="회원가입"></GreenButton>
            </div>
        </>
    );
}

export default Step3Form;