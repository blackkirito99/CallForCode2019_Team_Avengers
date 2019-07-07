import React, { Component } from 'react';
import Maps from './Maps';
import { relative } from 'path';

class MapWindow extends Component {

  render() {
    const center = { lng: 144.9628, lat: -37.8102 };

    let colors = ['#242f3e']
    Array.prototype.push.apply(colors, this.gradient('#ff0000','#ffff00',6));
    Array.prototype.push.apply(colors, this.gradient('#ffff00','#00ff00',6));
    let ratios = [];
    const min = 2;
    const max = 100;
    const step = (max- min) / 12;
    // api call
    fetch("https://api.example.com/items")
      .then(res => res.json())
      .then(
        (result) => {
            ratios.map((ratio) => {
                let color = this.mapColor(ratio, min, step);
                return {
                    suburb: 'XXX',
                    color: color
                };
            })
        //   this.setState({
        //     isLoaded: true,
        //     items: result.items
        //   });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
        //   this.setState({
        //     isLoaded: true,
        //     error
        //   });
        }
      )

    return (
      <div style = {{position: relative}}>
        <Maps name = "a"  colors = {colors}  ratio = {ratios} center = {center}>
        </Maps>
        <div style = {{position: 'fixed', bottom: '100px', right: '20px', zIndex: '10000'}}>
            <div style = {{width: '20px', height: '10px', backgroundColor: colors[0], position: 'relative'}}>
                <p style = {{position: "absolute", left: '-30px', top: '0px', margin: '0', color: 'white', lineHeight: '1em'}}>{max}</p>
            </div>
            <div style = {{width: '20px', height: '10px', backgroundColor: colors[1]}}>
            </div>
            <div style = {{width: '20px', height: '10px', backgroundColor: colors[2]}}>
            </div>
            <div style = {{width: '20px', height: '10px', backgroundColor: colors[3]}}>
            </div>
            <div style = {{width: '20px', height: '10px', backgroundColor: colors[4]}}>
            </div>
            <div style = {{width: '20px', height: '10px', backgroundColor: colors[5]}}>
            </div>
            <div style = {{width: '20px', height: '10px', backgroundColor: colors[6]}}>
            </div>
            <div style = {{width: '20px', height: '10px', backgroundColor: colors[7]}}>
            </div>
            <div style = {{width: '20px', height: '10px', backgroundColor: colors[8]}}>
            </div>
            <div style = {{width: '20px', height: '10px', backgroundColor: colors[9]}}>
            </div>
            <div style = {{width: '20px', height: '10px', backgroundColor: colors[10]}}>
            </div>
            <div style = {{width: '20px', height: '10px', backgroundColor: colors[11], position: 'relative'}}>
                <p style = {{position: "absolute", left: '-30px', top: '-6px', margin: '0', color: 'white', lineHeight: '1em'}}>{min}</p>
            </div>
        </div>

      </div>
    );
  }

  mapColor(value, min, step) {
    const count = (value - min)/step + 1
    if ((value - min) % step === 0) {
        return count;
    }
    return count + 1;
  }

  findMax() {
    return 0;
  }

  findMin() {
    return 100;
  }

  gradient (startColor,endColor,step) {
    var sColor = this.hexToRgb(startColor),
        eColor = this.hexToRgb(endColor);

    var rStep = (eColor[0] - sColor[0]) / step,
        gStep = (eColor[1] - sColor[1]) / step,
        bStep = (eColor[2] - sColor[2]) / step;

    var gradientColorArr = [];
    for(var i=0;i<step;i++){
        gradientColorArr.push(this.rgbToHex(parseInt(rStep*i+sColor[0]),parseInt(gStep*i+sColor[1]),parseInt(bStep*i+sColor[2])));
    }
    return gradientColorArr;
  }

  hexToRgb(hex) {
    var rgb = [];
    for(var i=1; i<7; i+=2){
      rgb.push(parseInt("0x" + hex.slice(i,i+2)));
    }
    return rgb;
  }

  rgbToHex(r, g, b) {
    var hex = ((r<<16) | (g<<8) | b).toString(16);
    return "#" + new Array(Math.abs(hex.length-7)).join("0") + hex;
  }
}

export default MapWindow;