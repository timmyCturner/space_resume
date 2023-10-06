import {
	Curve,
	Vector3
} from 'three';
import React, { useRef } from 'react'
/**
 * A bunch of parametric curves
 *
 * Formulas collected from various sources
 * http://mathworld.wolfram.com/HeartCurve.html
 * http://en.wikipedia.org/wiki/Viviani%27s_curve
 * http://www.mi.sanu.ac.rs/vismath/taylorapril2011/Taylor.pdf
 * https://prideout.net/blog/old/blog/index.html@p=44.html
 */

// GrannyKnot

export default class GrannyKnot extends Curve {

	getPoint( t, optionalTarget = new Vector3() ) {

		const point = optionalTarget;

		t *= Math.PI * 2;

		const x =  Math.cos( 2 * t );
		const y = (  Math.cos( 3 * t ) )/2// * Math.sin( 2 * t );
		const z = Math.sin( 3 * t )/2;

		return point.set( x, y, z ).multiplyScalar( 10 );

	}

}

// export default class GrannyKnot extends Curve {
//
// 	getPoint( t, optionalTarget = new Vector3() ) {
//
// 		const point = optionalTarget;
//
// 		t = 2 * Math.PI * t;
//
// 		const x = -32*t
// 		const y =  -8//0.5 * Math.sin( 4 * t ) ;
// 		const z = 2* Math.exp(-0.2 * t) * 2*Math.sin(12 * (t));
//
// 		return point.set( x, y, z ).multiplyScalar( 16 );
//
// 	}
//
// }
