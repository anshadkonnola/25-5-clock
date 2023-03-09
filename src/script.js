import React, { useRef }  from 'https://esm.sh/react@18.2.0';
import ReactDOM from 'https://esm.sh/react-dom@18.2.0';
import * as mathjs from "https://cdn.skypack.dev/mathjs@11.6.0";


var sound = new Audio("https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav");


class App extends React.Component {
  constructor(props){
    super(props);
    this.timeLabel = "Session";
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      minutes: 25,
      seconds: 0,
      running: false
    };
    this.changeLength = this.changeLength.bind(this);
    this.reset = this.reset.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.playPause = this.playPause.bind(this);
  }
  

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    clearInterval(this.myInterval);
  }
  
  startTimer() {
     this.myInterval = setInterval(() => {
      const minutes = this.state.minutes;
      const seconds = this.state.seconds;
      const running = this.state.running;
      if (!running) return;
      if (seconds > 0) {
        this.setState(({ seconds }) => ({
          seconds: seconds - 1
        }));
      }
      else if (seconds === 0) {
        if (minutes === 0) {
          sound.play();
          setTimeout(this.setState((prevState) => {
            let newState = {...prevState};
            if(this.timeLabel == "Session"){
               this.timeLabel = "Break";
               newState.minutes = prevState.breakLength;
               newState.seconds = 0;
            } else {
               this.timeLabel = "Session";
               newState.minutes = prevState.sessionLength;
               newState.seconds = 0;
            }

            return newState;
        }), 5000);
        } else {
          this.setState(({ minutes }) => ({
            minutes: minutes - 1,
            seconds: 59
          }));
        }
      }
    }, 1000);
  }

  playPause() {
    if(this.state.running){
        this.setState({ running: false });
        clearInterval(this.myInterval);  
    } else {
        this.setState({
          running: true
        });
        clearInterval(this.myInterval);  
        this.startTimer();
    }
  };
  
  
  changeLength(operation, breakOrSession){
    if((this.state.running) || (this.state.breakLength <= 1 && operation=="-" && breakOrSession == "break") || (this.state.breakLength >= 60 && operation=="+" && breakOrSession == "break") || (this.state.sessionLength <= 1 && operation=="-" && breakOrSession == "session") || (this.state.sessionLength >= 60 && operation=="+" && breakOrSession == "sesssion")) return;
    
    switch(breakOrSession) {
      case "break": this.setState((prevState) => {
        let newState = {...prevState};
        newState.breakLength = math.evaluate(prevState.breakLength + operation + "1");
        return newState;
      });break;
      case "session": this.setState((prevState) => {
        let newState = {...prevState};
        newState.sessionLength = math.evaluate(prevState.sessionLength + operation + "1");
        newState.minutes = newState.sessionLength;
        newState.seconds = 0;
        return newState;
      });break;
    }
  }
  
  reset(){
    this.timeLabel = "Session";
    this.setState({
       breakLength: 5,
       sessionLength: 25,
       minutes: 25,
       seconds: 0,
       running: false
    });
  }
  
  render() {

    document.addEventListener('keydown', (e) => {
                   if (e.keyCode === 32) {
                      this.playPause();
                   }});
    const minutes = this.state.minutes < 10 ? "0" + this.state.minutes : this.state.minutes;
    const seconds = this.state.seconds < 10 ? "0" + this.state.seconds : this.state.seconds;
    let labelColor = {"color": "white"};
    if(this.timeLabel == "Break" || (this.state.minutes < 1 && this.state.running)) labelColor = {"color": "red"};
    let controlButton = "fa fa-play fa-2x";
    if(this.state.running) controlButton = "fa fa-pause fa-2x";
    
    return (
      <div id="app">
        <div class="main-title">25 + 5 Clock</div>
        <div class="length-control">
           <div id="break-label">Break Length</div>
           <button class="btn-level" id="break-decrement" value="-" onClick={() => this.changeLength("-", "break")}>
             <i class="fa fa-arrow-down fa-2x"></i>
          </button>
           <div class="btn-level" id="break-length">{this.state.breakLength}</div>
           <button class="btn-level" id="break-increment" value="+" onClick={() => this.changeLength("+", "break")}>
             <i class="fa fa-arrow-up fa-2x"></i>
           </button>
         </div>
        <div class="length-control">
          <div id="session-label">Session Length</div>
          <button class="btn-level" id="session-decrement" value="-" onClick={() => this.changeLength("-", "session")}>
            <i class="fa fa-arrow-down fa-2x"></i>
          </button>
          <div class="btn-level" id="session-length">{this.state.sessionLength}</div>
          <button class="btn-level" id="session-increment" value="+" onClick={() => this.changeLength("+", "session")}>
            <i class="fa fa-arrow-up fa-2x"></i>
          </button>
        </div>
        <div class="timer">
          <div class="timer-wrapper">
            <div id="timer-label" style={labelColor}>{this.timeLabel}</div>
            <div id="time-left" style={labelColor}>{minutes}:{seconds}</div>
          </div>
        </div>
        <div class="timer-control">
          <button id="start_stop" onClick={this.playPause}>
            <i class={controlButton}></i>
            
          </button>
          <button id="reset" onClick={this.reset}>
            <i class="fa fa-refresh fa-2x"></i>
          </button>
        </div>
        <div class="author"> Designed and Coded by <br/>
          <a href="https://codepen.io/anshadkonnola/pen/yLERKqG" target="_blank">Anshad</a>
        </div>
    </div>
    );
  }
}


const root = ReactDOM.createRoot(document.getElementById('container'));
root.render(<App />);
