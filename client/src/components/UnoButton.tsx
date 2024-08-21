import { useEffect, useState, CSSProperties } from "react";
import API from "../api/API";
import { Button } from "antd";

const UnoButton: React.FC = () => {
    const divStyle: CSSProperties = {
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        fontWeight: 'bold',
        fontSize: 'larger',
        textAlign: 'center',
        borderRadius: '10px',
    };

    const [showUNO, setShowUNO] = useState<boolean>(false);

    const handleUNO = () => {
        API.UNO();
    }

    useEffect(() => {
        API.onShowUNO((showButton: boolean) => {
            setShowUNO(showButton);
        });
    }, []);
  
    return (
        <div style={divStyle}>
            {showUNO && <Button onClick={handleUNO} type="primary" size="large">UNO !</Button>}
        </div>
    );
};
  
export default UnoButton;