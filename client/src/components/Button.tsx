import React, { ReactNode } from "react";
import styled from "styled-components";
import { Button as MuiButton, ButtonProps as MuiButtonProps } from "@mui/material";

const Cbutton = styled(MuiButton)`
  &.MuiButton-root {
    padding: 16px 36px;
    text-transform: capitalize;
    background-color: rgba(0, 0, 0, 0.3);
    border: 1px solid rgb(2 15 108);
    border-radius: 12px;
    text-align: center;
    color: white;
    transition: transform 0.1s ease-in-out;
    transition-timing-function: ease-out;
    margin-bottom: 20px;
    display: inline-flex;
    flex-direction: column;

    &:disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    :hover {
      cursor: pointer;
      transform: scale(1.05);
      transition-timing-function: ease-in;
      background-color: rgba(0, 0, 0, 0.4);
    }

    :active {
      transform: scale(0.96);
      transition-duration: 0.05s;
    }
  }
`;

interface ButtonProps extends Omit<MuiButtonProps, 'type'> {
  children: ReactNode;
  icon?: ReactNode;
  buttonType?: "primary" | "default" | "dashed" | "link" | "text";
}

const Button: React.FC<ButtonProps> = ({ children, icon, buttonType, ...props }) => {
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.onClick) props.onClick(event);
  };

  return (
    <Cbutton {...props} onClick={onClick} startIcon={icon} variant={buttonType === "primary" ? "contained" : "text"}>
      {children}
    </Cbutton>
  );
};

export default Button;