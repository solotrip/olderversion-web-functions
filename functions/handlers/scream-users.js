

const { db } = require('../util/admin');

const { admin } = require('../util/admin');

const config = require('../util/config');

const firebase = require('firebase');

firebase.initializeApp(config);

var refusers = db.ref("users");

let userIdString;

let userHandleString;

let booli = false;

let initialImageUrl; 

const { validateSignupData, validateLoginData} = require('../util/validators');

exports.signup = (request,response) => { 


    

    var new_user_ref = refusers.push();

    

    const NewUser = { 

        email:request.body.email,
        password:request.body.password,
        confirmPassword:request.body.confirmPassword,
        handle:request.body.handle,
        fullName: request.body.fullName


    };

    
    const { valid,errors} = validateSignupData(NewUser);

    if(!valid) return response.status(400).json(errors);

    const noImg = 'contacts-512.png'

 
    booli = true

    // TODO: Validate data
    let token;
    let userId;
    let fcmToken;

    let usernameHolder;
    let profileImageUrl;
    /*
    db.ref(`/scream-users/${NewUser.handle}`).on("value",function(snapshot) { 
        
        if(snapshot.exists){ 
            return response.status(400).json({ handle: 'this username is already taken.'});
        } else { 

            return firebase.auth().createUserWithEmailAndPassword(NewUser.email,NewUser.password);
        }

    });


    */
   
    
    firebase.auth().createUserWithEmailAndPassword(NewUser.email,NewUser.password)
    .then(data => { 

        userId = data.user.uid;
        userIdString = userId;
        userHandleString = NewUser.handle;
        
        return data.user.getIdToken();

    })
    .then(data =>{ 
        token = data;

        profileImageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`

        //return response.status(201).json({ data });
        const userCredentials = { 
            email: NewUser.email,
            id: userId,
            name: NewUser.fullName,
            likesCount: '0',
            fcmToken: token,
            photoUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
            profileImageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
            username: NewUser.handle,
            notificationTokens: {
                [token]: 1
            }
        };

       refusers.child(userId).set(userCredentials);
        //refx.set(userCredentials);

       



       // return db.ref(`/scream-users/${NewUser.handle}`).set(userCredentials);
    }).then(() => { 

        

        return response.status(201).json({ 
            token: {token},
            uid: {userIdString},
            username: {userHandleString},
            imageUrl: {profileImageUrl}

         });
       
        



        
    })
    .catch(err => { 
        console.error(err);
        if(err.code == 'auth/email-already-in-use') {
            return response.status(400).json({ email: 'Email is already in use'})
        } else { 

            return response.status(500).json({ error: err.code});
        }
        
        
    });

};

//log user in
exports.login = (request,response) => { 
    const user = { 
        email: request.body.email,
        password: request.body.password
    };

    const { valid,errors} = validateLoginData(user);

    if(!valid) return response.status(400).json(errors);

    
    booli = true;

    let profileImageUrl;


    firebase.auth().signInWithEmailAndPassword(user.email,user.password)
    .then(data => { 
        
        userIdString = data.user.uid;

        

         

        return data.user.getIdToken();
    })
    .then(token => { 
        return response.json({token: {token},
                              uid: {userIdString},
                              
        });
    })
    .catch(err => { 
        console.error(err);
        if(err.code === 'auth/wrong-password') { 
            return response.status(403).json({ general: 'Wrong credentials, please try again'});
        } else return response.status(500).json({error: err.code});
    });
};

//log user out
exports.logout = (request,response) => {

    firebase.auth().signOut()
    .then(data => {
        return response.json({ message: 'Succesfully logged user out'});
    })
    .catch(err => {
        console.error(err);
        return response.status(500).json({error: err.code});
    });
};


//Get own user details
exports.getAuthenticatedUser = (request,response) => { 
    let userData = {};

    let userIdString2 = 'tRrWXoAEKYbxItpjEE7vOT7QISu2';

    if (booli === true) { 

        userIdString2 = userIdString;

    };

    //if(userIdString === "undefined") userIdString = 'tRrWXoAEKYbxItpjEE7vOT7QISu2'

    //firebase.auth().onAuthStateChanged()

    refusers.child(userIdString2).on("value", function(snapshot) { 

        if(snapshot.exists){
            var userspec = snapshot.val();
            userData.credentials = userspec;
            userData.likes = [];
            //userHandle ı alttaki commandle çekiyoruz.*****************************
            

            userIdString = userIdString2;

            //Likes için ayrı bir ref.child yaz ve her snapshot için snapshot.forEach 
            //diyip userData.likes arrayine ekle.

        };

        return response.json(userData);
    });
    /*
    .catch(err => { 
        console.error(err);
        return response.status(500).json({error : err.code });
    });

    */

};

exports.followingCount = (request,response) => {

    let counter = 0;

    db.ref(`/user-following/${request.params.userId}`).on("value", function(snapshot) {

        snapshot.forEach(data => { 

           

             counter = counter + 1;
            


        });


        return response.json({count: counter}); 


    });


};


exports.getPeople = (request,response) => {
    let people = [];

    db.ref(`users`).orderByChild('createdDate').on("value", function(snapshot) {
        var newPost = snapshot.val();
 
        snapshot.forEach(data => { 

            people.push({

                userId: data.key,
                email: data.val().email,
                fcmToken: data.val().fcmToken,
                id: data.val().id,
                likesCount: data.val().likesCount,
                name: data.val().name,
                photoUrl: data.val().photoUrl,
                profileImageUrl: data.val().profileImageUrl,
                username: data.val().username

            });
        });

        people.reverse();

        return response.json(people);   
  });


}

exports.getFriends = (request,response) => {

    let uidList = [];
    let people = [];



    db.ref(`/user-following/${request.params.userId}`).on("value", function(snapshot) {

        snapshot.forEach(data => { 

           

             uidList.push(data.key)
            


        });


        


    });





    
    db.ref(`users`).orderByChild('createdDate').on("value", function(snapshot) {
        var newPost = snapshot.val();
 
        snapshot.forEach(data => { 

            if(uidList.includes(data.key)) {
            people.push({

                userId: data.key,
                email: data.val().email,
                fcmToken: data.val().fcmToken,
                id: data.val().id,
                likesCount: data.val().likesCount,
                name: data.val().name,
                photoUrl: data.val().photoUrl,
                profileImageUrl: data.val().profileImageUrl,
                username: data.val().username

            });
        };
        });

        people.reverse();

        return response.json(people);   
  });


}







//Get specific user 
exports.getUser = (request,response) => {

    let userData = {};

    

    db.ref(`/users/${request.params.userId}`).on("value", function(snapshot) { 

        

            

        if(snapshot.exists){
            var userspec = snapshot.val();
            userData.credentials = userspec;
            
            
        };

        return response.json({ username: userData.credentials.username,
                               photoUrl: userData.credentials.photoUrl                
        });

    

    });
};

//upload a profile image for user
exports.uploadImage = (request,response) => { 

    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new BusBoy({ headers:request.headers});
    let imageFileName;
    let imageToBeUploaded = {};

    

    busboy.on('file',(fieldname,file,filename,encoding,mimetype) => { 

        if(mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
            return response.status(400).json({error : 'Wrong file type submitted'});
        }
        //png part of image.png
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        //317471347123.png
        imageFileName = `${Math.round(Math.random()*100000000000)}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(),imageFileName);
        imageToBeUploaded = {filepath,mimetype};
        file.pipe(fs.createWriteStream(filepath));

    });

    busboy.on('finish',() => { 
        admin.storage().bucket().upload(imageToBeUploaded.filepath,{ 

            resumable: false,
            metadata:{
                metadata:{
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`

            initialImageUrl = imageUrl;
            //Adding the imageUrl to the server
            return refusers.child(`${request.params.userId}`).update({
                 
                    photoUrl: imageUrl,
                    profileImageUrl: imageUrl
                   
            });
        })
        .then(() => { 
            return response.json({message: `${initialImageUrl}`});
        })
        .catch(err => { 
             console.error(err);
             return response.status(500).json({error: err.code});
        });
    });
    busboy.end(request.rawBody);

};

exports.userIdString = userIdString;

//Globalizing the user id(Accessing on other classes)
exports.getUserId = function(){
    return userIdString;
};

exports.getUserHandle = function() {

    return userHandleString;
};