import React from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

function ContributionButton() {

    const navigate = useNavigate();
return (
    
<Button onClick= {() => navigate('/contribution')} >Comment contribuer</Button>
);
}

export default ContributionButton;

