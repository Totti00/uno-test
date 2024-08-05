import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import API from "../../../api/API.ts";
import { Button } from "antd"

const UnoButton = () => {
    const divStyle = {
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        fontWeight: 'bold',
        fontSize: 'larger',
        textAlign: 'center',
        borderRadius: '10px',
    };

    const dispatch = useDispatch();

    const [showUNO, setShowUNO] = useState(false);

    const handleUNO = () => {
        API.UNO();
    }

    useEffect(() => {
        API.onShowUNO((showButton) => {
            setShowUNO(showButton);
        });
    }, dispatch);
  
    return (
        <div style={divStyle}>
            {showUNO && <Button onClick={handleUNO} type="primary" size="large">UNO !</Button>}
        </div>
    );
};
  
export default UnoButton;