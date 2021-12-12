import React from "react";
import Button from "../components/Button";

class Participant extends React.Component{
    render(){
        const participant = this.props.participant;
        const onButtonClick = this.props.onButtonClick;
        return(
            <div className='tc'>
                <Button text={participant} onButtonClick={onButtonClick}/>
            </div>
        );
    }
}

export default Participant;