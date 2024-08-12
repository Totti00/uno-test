import { useEffect, useState, CSSProperties } from "react";
import API from "../../api/API";
import { Button } from "antd";

const PassButton: React.FC = () => {
    const divStyle: CSSProperties = {
        fontWeight: 'bold',
        fontSize: 'larger',
        textAlign: 'center',
        borderRadius: '10px',
        display: 'block',
        marginTop: '50px',
    };

    const [showButton, setShowButton] = useState<boolean>(false);

    const handleUNO = () => {
        API.PASS();
    }

    useEffect(() => {
        API.onShowPassButton((showButton: boolean) => {
            setShowButton(showButton);
        });
    }, []);
  
    return (
        <div style={divStyle}>
            {showButton && <Button onClick={handleUNO} type="primary" size="large">Pass</Button>}
        </div>
    );
};
  
export default PassButton;