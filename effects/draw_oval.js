/**
 * draw_oval.js
 * this script draw oval and save to filename
 *
 * @author Korolev Igor <igor.a.korolev@gmail.com>
 */

// Deps

/*
const path = require('path');
const os = require('os');
const fs = require ( 'fs' );

 */
const gm = require ( 'gm' );


/**
 * Constructor
 *
 * @access public
 * @param {string}  filename
 * @param {string}  width
 * @param {string}  height
 * @param {string}  rw
 * @param {string}  rh
 * @param {string}  color
 * @param {string}  thickness 
 * @returns {void}
 */

const ex = module.exports = function ( filename, width, height, rw, rh, color, thickness ) {
  const me = this;
  me.width=width || 100;
  me.height=height || 50;
  me.color=color || 'red' ; // "#FF6C68"; // red
  me.rw=rw || 45;
  me.rh=rh || 20;
  me.thickness = thickness || 5;
  me.filename = filename ;
};


const cl = ex.prototype;


/**
 * draw ellipse, save image and return path to this image 
 *
 * @access public
 * @returns {boolean}
 */
cl.drawOval=function() {
    let me = this;
    let opacity=100;
    let pic = gm( me.width*2, me.height*2, '#FFACAA' ) 
      .out("-matte")
      .out("-operator", "Opacity", "Assign", "100%") ;

    pic.fill('none') ;
    pic.stroke(me.color, me.thickness*2);
    pic.drawEllipse(me.width, me.height, me.rw*2, me.rh*2, 0, 360) ;
    pic.resize(me.width, me.height);
    
    // save
    pic.write( me.filename, function (err) {
        if ( err ){
            throw err;
        } 
    });
    return( true );
}

