import React from "react";

class Headers extends React.Component{

    checkWalletConnection = (isWalletConnected, onClickFunc) => {
        if(!isWalletConnected){
            return (
                <a className="f6 fw4 hover-white no-underline white-70 dib ml2 pv2 ph3 ba" onClick={onClickFunc} href="#">Connect your wallet</a>
            );
        }
        return(
            <a className="f6 fw4 no-underline white-70 dib ml2 pv2 ph3 ba" href="#" onClick={onClickFunc}>Wallet Connected!</a>
        );
    }

    render(){
        // const isWalletConnected = this.props.walletConnection;
        const onClickFunc = this.props.onClick;
        const isWalletConnected = this.props.walletConnection;
        const addParticipant = this.props.addParticipant;
        return(
            
            <div>
                <nav className="dt w-100 mw8 center"> 
                    <div className="dtc v-mid tr pa3">
                        <a className="f6 fw4 no-underline white-70 dib ml2 pv2 ph3 ba" href="#" onClick={addParticipant} >Add Participants</a>
                        {this.checkWalletConnection(isWalletConnected, onClickFunc)}
                    </div>
                </nav> 
                <div className="tc-l mt4 mt5-m mt6-l ph3">
                    <h1 className="f2 f1-l fw2 white-90 mb0 lh-title">This is an eVoting Dapp</h1>
                    <h2 className="fw1 f3 white-80 mt3 mb4">Vote for the place where you want to grap a dinner!</h2>
                </div>
            </div>

        );
    }
}



export default Headers;