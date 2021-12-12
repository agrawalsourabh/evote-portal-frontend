import React from "react";

class Button extends React.Component{
    render(){
        const text = this.props.text;
        const onButtonClick = this.props.onButtonClick;
        return (
            <div>
                <a className="f5 grow no-underline br-pill ph6 pv3 mb2 dib white bg-mid-gray" href="#0" onClick={onButtonClick}>{text}</a>
            </div>
        );
    }
}

export default Button;