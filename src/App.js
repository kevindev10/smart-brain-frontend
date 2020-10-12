import React,{Component} from 'react';
import './App.css';
import Navigation from './component/Navigation/Navigation';
import Logo from './component/Logo/Logo';
import ImageLinkForm from './component/ImageLinkForm/ImageLinkForm';
import Rank from './component/Rank/Rank';
import Particles from 'react-particles-js';
import FaceRecognition from './component/FaceRecognition/FaceRecognition';
import SignIn from './component/SignIn/SignIn';
import Register from './component/Register/Register';






const particlesOptions ={
        particles: {
          number:{
            value:1,
            density:{
              enable:true,
              value_area:300
            }
          }
        }
}

const initialState = {
  input:'',
    imageUrl:'',
    box:{},
    route:'signin',
    isSignedIn:false,
    user:{
      id:'',
      name:'',
      email:'',
      entries:0,
      joined:''
    }
}

class App extends Component {
  constructor(){
    super()
    this.state = initialState
  }

  loadUser = (data) => {
    this.setState({
        user:{
          id:data.id,
          name:data.name,
          email:data.email,
          entries:data.entries,
          joined:data.joined
        }
    })
  }

 
  calculateFaceLocation=(data)=>{
    const clarafaiFace = data.outputs[0].data.regions[0].region_info.bounding_box ;
    const image= document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
          leftCol:clarafaiFace.left_col*width,
          topRow:clarafaiFace.top_row*height ,
          rightCol:width - (clarafaiFace.right_col*width),
          bottomRow:height - (clarafaiFace.bottom_row*height),
    }
  }
  displayFaceBox=(box)=>{
    //console.log(box)
    this.setState({box:box});
  }

  onInputChange= (event) =>{
    this.setState({input:event.target.value});
  }
  onSubmitButton =() =>{
    this.setState({imageUrl:this.state.input});
      fetch('https://ancient-journey-55264.herokuapp.com/imageurl',{
                method:'post',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({
                  input:this.state.input
                }) 
            })
              .then(response => response.json())

        .then((response)=>{
          
          if(response){
            fetch('https://ancient-journey-55264.herokuapp.com/image',{
                method:'put',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({
                id:this.state.user.id
                }) 
            })
              .then(response => response.json())
              .then(count =>{
                this.setState(Object.assign(this.state.user,{entries:count}))
              })
              //.catch(console.log)
          }
          this.displayFaceBox(this.calculateFaceLocation(response))
        })
        .catch(err=> console.log(err,'Error Detected !!! Fix it '))
  }

  onRouteChange = (route) =>{
    if (route==='signout'){
      this.setState(initialState)
    }else if(route==='home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route:route});
  }
  render(){
    const{isSignedIn, route, box, imageUrl} = this.state
    return (
      <div className="App">
        <Particles
          className='particles' 
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        {
          route === 'home'
          ? <div>
              <Logo/>
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm 
                onInputChange={this.onInputChange}
                onSubmitButton={this.onSubmitButton}
              />
              <FaceRecognition box={box} imageUrl={imageUrl}/>
            </div>
          : (
              this.state.route === 'signin'
              ? <SignIn onRouteChange={this.onRouteChange} loadUser ={this.loadUser}/>
              : <Register onRouteChange = {this.onRouteChange} loadUser ={this.loadUser}/>
            )
            

        }
        
      </div>
    );
  }
  
}

export default App;
