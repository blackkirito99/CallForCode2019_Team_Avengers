/*!

=========================================================
* Material Dashboard React - v1.7.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import Map from "./Map";


class Maps extends Component {

  render() {
    return (
      <Map
        id="myMap"
        options={{
          center: this.props.center,
          zoom: 11,
          scrollwheel: false,
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
          styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{'visibility': 'off'}]
            },
            {
              featureType: 'transit',
              elementType: 'labels',
              stylers: [{'visibility': 'off'}]
            },
            {
              featureType: 'road',
              elementType: 'all',
              stylers: [{'visibility': 'off'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]
        }}
        onMapLoad={map => {
          map.data.loadGeoJson('https://data.gov.au/geoserver/vic-suburb-locality-boundaries-psma-administrative-boundaries/wfs?request=GetFeature&typeName=ckan_af33dd8c_0534_4e18_9245_fc64440f742e&outputFormat=json');
          // (feature) => {
            
          // })
          console.log(this.props)
          // const data = [];
          map.data.setStyle((feature) => {
          //   let name = feature.getProperty('vic_loca_2');
          //   // console.log(name);
          //   data.push(name);
          //   let total = Math.floor(Math.random() * Math.floor(20000));
          //   let colors = this.gradient('#ffffff','#ff9900',6);
          //   let color = '#000000'
          //   if (total > 1)
          //     color = colors[0]
          //   if (total > 4000)
          //     color = colors[1]
          //   if (total > 8000)
          //     color = colors[2]
          //   if (total > 12000)
          //     color = colors[3]
          //   if (total > 16000)
          //     color = colors[4]
          //   if (total > 20000)
          //     color = colors[5]
            return {
              fillColor: this.props.colors[Math.floor(Math.random() * Math.floor(12))],
              fillOpacity: 0.7,
              strokeWeight: 1
            }
          })
          // setTimeout(() => {
          //   this.download(data, 'suburbs', 'application/json');
          // }, 60000);
        }}
      ></Map>
    );
  }

  // download(data, filename, type) {
  //   var file = new Blob([data], {type: type});
  //   if (window.navigator.msSaveOrOpenBlob) // IE10+
  //       window.navigator.msSaveOrOpenBlob(file, filename);
  //   else { // Others
  //       var a = document.createElement("a"),
  //               url = URL.createObjectURL(file);
  //       a.href = url;
  //       a.download = filename;
  //       document.body.appendChild(a);
  //       a.click();
  //       setTimeout(function() {
  //           document.body.removeChild(a);
  //           window.URL.revokeObjectURL(url);  
  //       }, 0); 
  //   }
  //  }
}

export default Maps;