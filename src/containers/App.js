import React from 'react';
import abi from '../utils/smart_contract/eVote.json'
import { ethers } from 'ethers';

import './App.css';
import 'tachyons';

import Headers from '../components/Headers';
import Participant from './Participant';

class App extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      participants: ["Dominos" , "MOD"],
      alreadyVoted: true,
      walletConnected: false,
      owner: '0xB27d536976B9869309F665e01cFB28ebED580774',
      contractAddress: '0xeFd215CD9f0b71fC8a52271a94520C48E5AC53Bb',
      contractABI: abi.abi,
      sender: '',
      isOwner: false,
      votePart1: 0,
      votePart2: 0
    }
  }

  isWalletConnected = async() => {
    const {ethereum} = window;

    try{
      if(!ethereum){
        console.log("Metamask not found.")
        return;
      }
  
      const accounts = await ethereum.request({method: 'eth_accounts'});
  
      if(accounts.length !== 0){
        const account = accounts[0];
        console.log("Found an authorise account: ", account);
        this.setState({walletConnected: true});
        this.setState({sender: account});
      }
      else{
        console.log("No authorised account found.");
        this.setState({walletConnected: false});
      }
    }
    catch(error){
      console.error(error.message);
    }

  }

  connectWallet = async() => {
    try{
      const {ethereum} = window;

      if(!ethereum){
        console.log("Get metamask!");
        return;
      }

      const accounts = await ethereum.request({method: "eth_requestAccounts"});
      console.log("connected: " + accounts[0]);
      this.setState({walletConnected: true});
      this.setState({sender: accounts[0]});
    }
    catch(error){
      console.error(error.message);
    }
  }

  isAlreadyVoted = () => {
    if(!this.state.alreadyVoted){
      return (
        <div className='tc'>
          <p className='fw1 f3 white-80 mt3 mb4'> Your vote has been registered. Thanks! </p>
        </div>
      );
    }
  }

  addParticipant = async() => {
    console.log("Participant clicked!");

    if(this.state.owner.toLowerCase() !== this.state.sender.toLowerCase()){
      console.log("sender: " + this.state.sender);
      console.log("You are not the owner!");

      this.setState({isOwner: false});
      return ;
    }
    // owner
    try{
      const {ethereum} = window;
      const {contractAddress, contractABI} = this.state;
      this.setState({isOwner: true});

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const eVoteContract = new ethers.Contract(contractAddress, contractABI, signer);

        let addTxn = await eVoteContract.addParticipant("Dominos");
        addTxn.wait();

        console.log("Txn: " + addTxn.hash);

        addTxn = await eVoteContract.addParticipant("MOD");
        addTxn.wait();

        console.log("Txn: " + addTxn.hash);
      }
    }
    catch(error){
      console.error(error);
    }
  }

  castVote = async (participant_name) => {
    console.log("caste vote clicked! %s", participant_name);

    try{
      const {ethereum} = window;
      const {contractAddress, contractABI} = this.state;
      this.setState({isOwner: true});

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const eVoteContract = new ethers.Contract(contractAddress, contractABI, signer);

        let addTxn = await eVoteContract.castVote(participant_name);
        await addTxn.wait();

        console.log("Txn: " + addTxn.hash);

        let voteCount = await eVoteContract.getVoteCount(this.state.participants[0]);
        await voteCount.wait();
        console.log("Dominos: " + voteCount);

        voteCount = await eVoteContract.getVoteCount(this.state.participants[1]);
        await voteCount.wait();
        console.log("MOD: " + voteCount);
      }
    }
    catch(error){
      console.log(error);
    }
  }

  castVotePar1 = async() => {
    await this.castVote(this.state.participants[0]);
  }

  castVotePar2 = async() => {
    await this.castVote(this.state.participants[1]);
  }

  getVoteCount = async() => {
    console.log("counting votes");
    try{
      const {ethereum} = window;
      const {contractAddress, contractABI} = this.state;
      this.setState({isOwner: true});

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const eVoteContract = new ethers.Contract(contractAddress, contractABI, signer);

        let voteCount = await eVoteContract.getVoteCount(this.state.participants[0]);
        console.log("Dominos: " + voteCount.toNumber());

        this.setState({votePart1: voteCount.toNumber()});

        voteCount = await eVoteContract.getVoteCount(this.state.participants[1]);
        console.log("MOD: " + voteCount.toNumber());

        this.setState({votePart2: voteCount.toNumber()});
      }
    }
    catch(error){
      console.log(error);
    }
  }

  componentDidMount = () => {
    this.isWalletConnected();
    this.getVoteCount();
  }

  render(){
    return(
      <div>
        <header className="sans-serif">
          <div className="cover bg-left bg-center-l" style={{background: 'url(https://user-images.githubusercontent.com/8282374/145391841-3bfee59a-e8a9-478b-81e0-2ab7ef7d71b9.jpg)'}}>
            <div className="bg-black-40 pb5 pb6-m pb7-l">
              <Headers onClick={this.connectWallet} walletConnection={this.state.walletConnected} addParticipant={this.addParticipant} isOwner={this.state.isOwner}/>
              <div className='flex justify-center'>
                <div className=' w-25 pa3 mr2'>
                  <Participant participant={this.state.participants[0]} onButtonClick={this.castVotePar1}/>
                </div>
                <div className=' w-25 pa3 mr2"'>
                  < Participant participant={this.state.participants[1]} onButtonClick={this.castVotePar2} />
                </div>
              </div>
              {this.isAlreadyVoted}
            </div>
          </div> 
        </header>
        <div className=' w-25 pa3 mr2'>
          <p> {this.state.participants[0]} : {this.state.votePart1} </p>
          <p> {this.state.participants[1]} : {this.state.votePart2} </p>
        </div>
      </div>
    );
  }
}

export default App;
