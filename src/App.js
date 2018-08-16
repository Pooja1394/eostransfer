import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Eos from "eosjs";
var scatter = {};
var publicKey = "EOS8ZeYmzAG4rrf5t1PLzPAVFp2t8c547ab1282Gaanxwjv3nXJvU";

class App extends Component {
  constructor() {
    super();
    this.state = {
      from: "",
      to: "",
      amount: "",
      errorMsg: "hello",
      errorV: "hidden",
      transfer: "block",
      create: "none"
    };
  }
  transferAmount = async () => {
    this.setState({
      create: "none",
      transfer: "block",
      errorV:"hidden",
    });
    if (scatter) {
      if(this.state.from && this.state.to){
        console.log("money transfer");
        console.log(
          "from = ",this.state.from,
          "\n to = ",this.state.to,
          "\n amount = ",this.state.amount
        );

        const network = {
          // protocol:'https', // Defaults to https
          protocol:'http',
          blockchain: "eos",
          host: "193.93.219.219",
          port: 8888,
          chainId:
            "038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca"
        };

        const eosOptions = {
          chainId:
            "038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca"
        };

        const eos =  scatter.eos(network, Eos, eosOptions,'https');
        console.log('eos = ', eos);
        //get identity
        // const requiredFields = {
        //   accounts: [
        //     {
        //       blockchain: "eos",
        //       host: "193.93.219.219",
        //       port: 8888,
        //       chainId:
        //         "038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca"
        //     }
        //   ]
        // };
        try {
          let amount1 = (this.state.amount === "" ? "0" : this.state.amount) + ".0000 EOS";
          let result = await eos.transfer(
            this.state.from,
            this.state.to,
            amount1,
            "transfer from "+this.state.from,
            { authorization: "pooja@active" }
          );
          console.log("result = ", result);
          if (result.broadcast) {
            this.setState({
              errorMsg: amount1 + " amount has been transfered!",
              errorV: "visible"
            });
          } else {
            alert("not transfer");
          }
        } catch (err) {
          console.log("err = ", err);
          switch (typeof err) {
            case "object":
              {
                console.log("object case!");
                if (err.code === 402) {
                  // alert('Reject transfer');
                  this.setState({
                    errorMsg: err.message,
                    errorV: "visible"
                  });
                } else if(err.code === 423){
                  this.setState({
                    errorMsg: "Please unlock your browser scatter!",
                    errorV: "visible"
                  });
                }else{
                  this.setState({
                    errorMsg: "chainId mismatch!",
                    errorV: "visible"
                  });
                }
              }
              break;
            case "string":
              {
                console.log("string case!");
                let err1 = JSON.parse(err);
                if (err1.code === 500) {
                  this.setState({
                    errorMsg: "account name is not valid!",
                    errorV: "visible"
                  });
                }
              }
              break;
          }
        }
      }
      else{
        this.setState({
          errorMsg:'please provide all parameters!',
          errorV:'visible'
        })
      }
    } else {
      console.log("please add scatter plugin on your browser!");
    }
  };
  componentWillMount() {
    //check scatter is available or not
    document.addEventListener("scatterLoaded", scatterExtension => {
      scatter = window.scatter;
      console.log("scatter ", scatter);
      if (scatter) {
        console.log("scatter is available!");
      } else {
        console.log("scatter is not available");
      }
    });
  }
  createAccount = async () => {
    this.setState({
      create: "block",
      transfer: "none",
      errorV:"hidden",
    });
    // try{
    //     let result = await eos.transaction(tr => {
    //     tr.newaccount({
    //       creator: 'pooja',
    //       name: '3july',
    //       owner: publicKey,
    //       active: publicKey
    //     })
    //     tr.buyrambytes({
    //       payer: 'pooja',
    //       receiver: '3july',
    //       bytes: 8192
    //     })

    //     tr.delegatebw({
    //       from: 'pooja',
    //       receiver: '3july',
    //       stake_net_quantity: '10.0000 SYS',
    //       stake_cpu_quantity: '10.0000 SYS',
    //       transfer: 0
    //     })
    //   });
    //   console.log('')
    // }catch(err){
    //   console.log("err = ", err);
    // }
    
    // console.log('result', result)
  };
  render() {
    return (
      <div className="App">
        <div className="container">
          <div style={{ display: this.state.transfer }}>
            <div className="heading">
              <p>Transfer Amount</p>
            </div>
            <div style={{ "visibility": this.state.errorV }} className="errDiv">
              {this.state.errorMsg}
            </div>
            <ul className="ul">
              <li className="leftli">From</li>
              <li className="rightli">
                <input
                  placeholder="Enter acounter name"
                  value={this.state.from}
                  onChange={e => {
                    this.setState({ from: e.target.value, errorV:'hidden' });
                  }}
                />
              </li>
            </ul>
            <ul className="ul">
              <li className="leftli">To</li>
              <li className="rightli">
                <input
                  placeholder="Enter acounter name"
                  value={this.state.to}
                  onChange={e => {
                    this.setState({ to: e.target.value, errorV:'hidden' });
                  }}
                />
              </li>
            </ul>
            <ul className="ul">
              <li className="leftli">Amount</li>
              <li className="rightli">
                <input
                  placeholder="Enter amount"
                  value={this.state.amount}
                  onChange={e => {
                    this.setState({ amount: e.target.value , errorV:'hidden'});
                  }}
                />
              </li>
            </ul>
            <button onClick={this.transferAmount}>transfer</button>
            <button onClick={this.createAccount}>create</button>
          </div>
          <div style={{ display: this.state.create }}>
            <div className="heading">
              <p>Create Account</p>
            </div>
            <div style={{ visibility: this.state.errorV }} className="errDiv">
              {this.state.errorMsg}
            </div>
            <ul className="ul">
              <li className="leftli">Account Name</li>
              <li className="rightli">
                <input
                  placeholder="Enter acounter name"
                  value={this.state.from}
                  onChange={e => {
                    this.setState({ from: e.target.value });
                  }}
                />
              </li>
            </ul>
            <ul className="ul">
              <li className="leftli">Owner P.Key</li>
              <li className="rightli">
                <input
                  placeholder="Enter acounter name"
                  value={this.state.to}
                  onChange={e => {
                    this.setState({ to: e.target.value });
                  }}
                />
              </li>
            </ul>
            <ul className="ul">
              <li className="leftli">Active P.Key</li>
              <li className="rightli">
                <input
                  placeholder="Enter amount"
                  value={this.state.amount}
                  onChange={e => {
                    this.setState({ amount: e.target.value });
                  }}
                />
              </li>
            </ul>
            <button onClick={this.transferAmount}>transfer</button>
            <button onClick={this.createAccount}>create</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
