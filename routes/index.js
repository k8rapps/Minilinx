var express = require( "express" );
var router = express.Router();
const url = require( "url" );
var awsAdapter = require( "../helpers/awsAdapter" );
router.get( "/", function( req, res, next ) {
  res.render( "index", { title: "MiniLinx" } );
} );

router.get( "/details/:id", function( req, res, next ) {
  var webid = req.params.id;
  awsAdapter.getUrlData( webid ).on( "success", function( response ) {
    if ( response.data.Item ) {
      res.render( "details",
      {
        title: "MiniLinx",
        webid: response.data.Item.webid, url:
        response.data.Item.url
      } );
    } else {
      res.status( 404 ).render( "error", { error: "No Such URL" } );
    }
  } ).on( "error", function( response ) {
    res.status( 500 ).render( "error", { error: "Something Broke!" } );
  } );
} );

router.get( "/:id", function( req, res, next ) {
  var webid = req.params.id;
  awsAdapter.getUrlData( webid ).on( "success", function( response ) {
    if ( response.data.Item ) {
      res.redirect( response.data.Item.url );
    } else {
      res.status( 404 );
      res.render( "error", { error: "No Such URL" } );
    }
  } ).on( "error", function( response ) {
    res.status( 500 ).render( "error", { error: "Somthing Broke!" } );
  } );
} );

router.post( "/", function( req, res ) {
  awsAdapter.saveUrlData( req.body.url ).on( "success", function( response ) {
    res.redirect( "/details/" + response.request.params.Item.webid.S );
  } ).on( "error", function( response ) {
    res.status( 500 );
  } );
} );

router.post( "/inflate", function( req, res ) {
  console.log( req.body );
  var id = req.body.shortUrl.substr( req.body.shortUrl.lastIndexOf( "/" ) + 1 );
  res.redirect( "/details/" + id );
} );

module.exports = router;
