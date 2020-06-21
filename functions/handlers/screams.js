
const { db } = require('../util/admin');

const { admin } = require('../util/admin');

//let  userIdString = require('./scream-users');

var refusers = db.ref("users");

var ref = db.ref("screams");

var myModule = require('./scream-users');

var userIdString = myModule.userIdString;

var updateCount = true;



var userIdHelper = require('./scream-users');

 

exports.getAllScreams = (request,response) => {

    let screams = [];

    db.ref("posts").orderByChild('createdDate').on("value", function(snapshot) {
        var newPost = snapshot.val();
 
        snapshot.forEach(data => { 

            screams.push({
                screamId: data.key,
                likes: data.val().likes,
                imageUrl: data.val().imageUrl,
                title: data.val().title,
                totalCost: data.val().totalCost,
                totalTime: data.val().totalTime,
                country: data.val().country,
                authorName: data.val().authorName,
                averageRating: data.val().averageRating,
                ownerUid: data.val().ownerUid

            });
        });

        screams.reverse();

        return response.json(screams);   
  });

};

exports.getSavedPosts = (request,response) => {

    let screams = [];

    db.ref(`/saved/${request.params.userId}`).orderByChild('createdDate').on("value", function(snapshot) {
        var newPost = snapshot.val();
 
        snapshot.forEach(data => { 

            screams.push({
                screamId: data.key,
                likes: data.val().likes,
                imageUrl: data.val().imageUrl,
                title: data.val().title,
                country: data.val().country,
                ownerUid: data.val().ownerUid

            });
        });

        screams.reverse();

        return response.json(screams);   
  });

};


exports.getSharedPosts = (request,response) => {

    let screams = [];

    db.ref(`/shared/${request.params.userId}`).orderByChild('createdDate').on("value", function(snapshot) {
        var newPost = snapshot.val();
 
        snapshot.forEach(data => { 

            screams.push({
                screamId: data.key,
                likes: data.val().likes,
                imageUrl: data.val().imageUrl,
                title: data.val().title,
                country: data.val().country,
                ownerUid: data.val().ownerUid

            });
        });

        screams.reverse();

        return response.json(screams);   
  });

};

exports.countPosts = (request,response) => {

    let counter = 0;

    db.ref("posts").on("value", function(snapshot) {

        snapshot.forEach(data => { 

            if(request.params.userId === data.val().ownerUid) {

                counter = counter + 1;
            }


        });


        return response.json({count: counter}); 


    });


};


exports.getCities = (request,response) => {

    let cities =[];

    db.ref("all_cities").on("value", function(snapshot) {

        var newCity = snapshot.val();
 
        snapshot.forEach(data => { 

            cities.push({
                cityId: data.key,
                country: data.val().country,
                image: data.val().image,
                name: data.val().name,
                nickname: data.val().nickname
                
            });
        });


        return response.json(cities);



    });

};

exports.getCountries =(request,response) => {

    let countries =[];

    db.ref("all_countries").on("value", function(snapshot) {

        var newCountry = snapshot.val();
 
        snapshot.forEach(data => { 

            countries.push({
                countryId: data.key,
                continent: data.val().continent,
                image: data.val().image,
                name: data.val().name,
                nickname: data.val().nickname
                
            });
        });


        return response.json(countries);



    });
    
};

exports.getLists = (request,response) => {

    let lists =[];

    db.ref("lists").on("value", function(snapshot) {

        var newCountry = snapshot.val();
 
        snapshot.forEach(data => { 

            lists.push({
                listId: data.key,
                place: data.val().place,
                image: data.val().image,
                name: data.val().name,
                day: data.val().day,
                count: data.val().count
                
            });
        });


        return response.json(lists);



    });

};

exports.getKeypoints = (request,response) => {

    let keypoints = [];

    

    db.ref(`/keypoints`).on("value", function(snapshot) { 

        snapshot.forEach(data => { 

           

            if (request.params.city == data.key) {

                let ketdat = data.key;

            
        
            keypoints.push(data.val());


            }

            

        });

    return response.json(keypoints);

    });
};

exports.getTags = (request,response) => {

    let tags =[];

    

    db.ref("tags").on("value", function(snapshot) {

        var newTag = snapshot.val();
 
        snapshot.forEach(data => { 

            tags.push({
                tagId: data.key,
                name: data.val().name
            });
        });


        return response.json(tags);



    });

}

exports.postOneScream = (request,response) => { 

    

    var new_post_ref = ref.push()
    const newScream = { 

        body: request.body.body,
        //userHandle: request.body.userHandle,
       //userHandle:  request.user.handle,
       userHandle: userIdHelper.getUserHandle(),
       userImage: "",
        createdAt:  admin.database.ServerValue.TIMESTAMP,
        likeCount:0,
        commentCount:0


    };


    //TODO: Checking the auth ( EMPTY)


    new_post_ref.set(newScream,function(snapshot) { 

        response.json(newScream);

    });

    

 };

 //Fetch one scream
 exports.getScream = (request,response) => {
     let screamData = {};
     db.ref(`/posts/${request.params.screamId}`).on("value", function(snapshot) { 

        if(!snapshot.exists) {
            return response.status(404).json({error: 'Scream not found!'});
        }

        screamData = snapshot.val();
        screamData.screamId = snapshot.key;


        return db.ref("scream-comments").orderByChild("screamId").equalTo(request.params.screamId).on("value", function(snapshot2) { 

            screamData.comments = [];

            snapshot2.forEach(data => { 

                screamData.comments.push(data);
            });

            return response.json(screamData);

        });

     });
 };

 //Comment on a scream
 exports.commentOnScream = (request,response) => {

    if(request.body.body.trim() === '') return response.status(400).json({error : 'Must not be empty'});

 


    const newComment = { 
        body: request.body.body,
        createdAt: admin.database.ServerValue.TIMESTAMP,
        screamId: request.params.screamId,
        userHandle: userIdHelper.getUserHandle(),
        userImage: ""
    };

    db.ref(`/screams/${request.params.screamId}`).limitToFirst(1).once('value').then(function(snapshot){ 

        if(!snapshot.exists) {
            return response.status(404).json({ error: 'Scream not found'});
        }


        ref.child(request.params.screamId).child("commentCount").transaction(function (current_value) {
                   
            return (current_value || 0) + 1;

       });

        return db.ref("scream-comments").push().set(newComment,function(snapshot2) { 

            response.json(newComment);
    
        })
        .catch(err => {
            console.log(err);
            response.status(500).json({error: 'Something went wrong'});

        });
        

    })

 };

 exports.likeScream = (request,response) => { 


    let likeExisted = false;

    var new_like_ref = db.ref("scream-likes").push();


    const newLike ={ 

        screamId:request.params.screamId,
        userHandle: request.params.userHandle
        

    };



    db.ref("scream-likes").orderByChild("screamId").equalTo(request.params.screamId).on("value", function(snapshot) {

        //orderByChild("screamId").equalTo(request.params.screamId)

        var specificLike = snapshot.val();
        

        snapshot.forEach(function(childSnapshot){ 

        

      
        //  && specificLike.userHandle === request.params.userHandle

        

        if(childSnapshot.val().userHandle === request.params.userHandle) {

            updateCount = false;

            return response.status(404).json({error: `You ${request.params.userHandle} already liked post before as ${childSnapshot.val().userHandle} `});
        }

        else {
        
             

            //return response.json(newLike);
        }
        

    });

    if(updateCount) {

        

            new_like_ref.set(newLike,function(snapshot2) { 

        
                response.json(newLike);
        
            })
            .catch(err => {
                console.log(err);
                response.status(500).json({error: 'Something went wrong'});
        
            });


            ref.child(request.params.screamId).child("likeCount").transaction(function (current_value) {
                   
                return (current_value || 0) + 1
        
           });

           
    }
    
    

    });

    

    



 };


exports.unlikeScream = (request,response) =>{ 


    //db.ref("scream-likes").child()
    let newsnapshot = [];

    //db.ref("scream-likes").orderByChild("screamId").equalTo(request.params.screamId).on("value", function(snapshot) {
    

    db.ref("scream-likes").orderByChild("screamId").equalTo(request.params.screamId).limitToLast(1).once('value').then(function(snapshot) {

        var specificLike = snapshot.val();

        let snapshotsArray = [];

        


        snapshot.forEach(function(childSnapshot){

            

        if(specificLike.userHandle === userIdHelper.getUserHandle()) {

            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();

            //if(childSnapshot.val().screamId === request.params.screamId && childSnapshot.val().userHandle === userIdHelper.getUserHandle()) {

                snapshotsArray.push(childSnapshot.val());

                

                
            
                


            




            //db.ref("scream-likes").orderByKey().equalTo()
           
            db.ref("scream-likes").child(childSnapshot.key).remove();

            ref.child(request.params.screamId).child("likeCount").transaction(function (current_value) {
                   
                return (current_value  - 1)||0

           });

           
           //response.json(childSnapshot.val());


        } else {

            return response.status(404).json({error: 'You did not like that post!'});

        };

        //response.json(snapshotsArray);
        //snapshotsArray = snapshotsArray.filter(item => item.exists);
        



    });

    

    response.json(snapshotsArray);



    //response.json({message: `${snapshotsArray.key} removed.`});

    /*
    const iterator = snapshotsArray.keys();

    for (const key of iterator) {
        console.log(key);
        
      }
      */


   

    //response.json(newsnapshot);

});


};


//Delete a scream

exports.deleteScream = (request,response) => {

    let userHandleHolder;


    db.ref(`/screams/${request.params.screamId}`).limitToLast(1).once('value').then(function(snapshot){

        snapshot.forEach(data => { 

            userHandleHolder = data.val().userHandle;

        

        if(!snapshot.exists) {
            return response.status(404).json({ error: 'Scream not found'});
        }

        if(snapshot.val().userHandle !== userIdHelper.getUserHandle()) {

            return response.status(403).json({error: ` ${snapshot.val().userHandle}  is not equal to ${userIdHelper.getUserHandle()}`});
        } else {


            db.ref("screams").child(request.params.screamId).remove();

        }


        response.json({ message: `Scream deleted successfully`});
        //db.ref(`/screams/${request.params.screamId}`).delete();

        //snapshot.key idi.

        

        });

    });

};




 //Like a scream
 /*
 exports.likeScream = (request,response) => {

    const likeDocument = db.ref("scream-likes").orderByChild("userHandle").equalTo(userIdHelper.getUserHandle()).orderByChild("screamId").equalTo(request.params.screamId).limitToFirst(1);

    const screamDocument = db.ref(`/screams/${request.params.screamId}`);

    let screamData;

    screamDocument.on("value", function(snapshot) {

        if(snapshot.exists) {

            screamData = snapshot.val();
            screamData.screamId = snapshot.key;
            likeDocument.on("value", function(snapshotLikeDoc) {
                
                if (snapshotLikeDoc === null) {
                    screamData.likeCount++;
                    
                    db.ref("scream-likes").push().set({
                        screamId: request.params.screamId,
                        userHandle: userIdHelper.getUserHandle()

                    });

                    return screamDocument.update({
                        likeCount:screamData.likeCount
                    });
                    
                } else {

                     //return likeDocument;
                     return response.status(400).json({ error :'Scream already liked'});
                }
                
            });


        } else { 
            return response.status(404).json({error : 'Scream not found'});
        }


    });
 };

 exports.unlikeScream = (request,response) => { 

    const likeDocument = db.ref("scream-likes").orderByChild("userHandle").equalTo(userIdHelper.getUserHandle()).orderByChild("screamId").equalTo(request.params.screamId).limitToFirst(1);

    const screamDocument = db.ref(`/screams/${request.params.screamId}`);

    let screamData;

    screamDocument.on("value", function(snapshot) {

        if(snapshot.exists) {

            screamData = snapshot.val();
            screamData.screamId = snapshot.key;
            likeDocument.on("value", function(snapshotLikeDoc) {
                
                if (snapshotLikeDoc === null) {

                    //return likeDocument;
                    return response.status(400).json({ error :'Scream not liked'});

                    
                    
                } else {

                    screamData.likeCount--;
                    

                    db.ref("scream-likes").orderByKey().equalTo(snapshot.key).limitToFirst(1).remove();

                    return screamDocument.update({
                        likeCount:screamData.likeCount
                    }); 
                     
                }
                
            });


        } else { 
            return response.status(404).json({error : 'Scream not found'});
        }


    });


 };

 */