const functions = require('firebase-functions');



const express = require('express');
const app = express();

//const FBAuth = require('./util/fbAuth');


const { getAllScreams,postOneScream,getScream,commentOnScream,likeScream,unlikeScream,deleteScream,getCities,getCountries,getLists,getTags,getKeypoints,countPosts,getSavedPosts,getSharedPosts} = require('./handlers/screams');
const {signup,login,uploadImage,getAuthenticatedUser,logout,getUser,followingCount,getPeople,getFriends} = require('./handlers/scream-users');


 //Scream routes
app.get('/screams',getAllScreams);
app.get('/saved/:userId',getSavedPosts);
app.get('/shared/:userId',getSharedPosts);
app.get('/cities',getCities);
app.get('/countries',getCountries);
app.get('/lists',getLists);
app.get('/tags',getTags);
app.post('/scream',postOneScream);
app.get('/scream/:screamId',getScream);
app.get('/keypoints/:city',getKeypoints);
app.get('/scream-user/:userId',getUser);
app.post('/scream/:screamId/comment',commentOnScream);
app.delete('/scream/:screamId',deleteScream);

app.post('/scream/:screamId/:userHandle/like',likeScream);
app.post('/scream/:screamId/unlike',unlikeScream);


//User routes
 app.post('/signupScreamer',signup);
 app.post('/login',login);
 app.post('/scream-user/image/:userId',uploadImage);
 app.get('/scream-user',getAuthenticatedUser);
 app.get('/userscream/:userId',countPosts);
 app.get('/followings/:userId',followingCount);
 app.post('/logout',logout);
 app.get('/people',getPeople);
 app.get('/friends/:userId',getFriends);

 exports.api = functions.https.onRequest(app);