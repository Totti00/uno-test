import React from "react";
import styled from "styled-components";
import { Typography as MuiTypography, TypographyProps as MuiTypographyProps } from "@mui/material";

const Ctypography = styled(MuiTypography)`
  color: white;
  font-weight: bold;
`;

const Typography: React.FC<MuiTypographyProps> = (props) => {
  return <Ctypography {...props} />;
};

export default Typography;