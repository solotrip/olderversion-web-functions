let db = {

    screamusers: [

        {
            userId: 'O7ks3AP1u1YMP8tVz79q28jAyCZ2',
            email: 'user@someemail.com',
            handle: 'idontknowtheusername',
            createdAt: 1589319870252,
            imageUrl: 'https://firebasestorage.googleapis.com/v0/b/simplisco-5bc92.appspot.com/o/61359096732.jpg?alt=media'

        }
    ],


    screams: [

        {
            userHandle: 'user',
            body: 'this is the scream body',
            createdAt: '1589246396817',
            likeCount: 5,
            commentCount: 2

        }
    ],

    
    comments: [

        {
            userHandle: 'user',
            body: 'this is a comment body',
            screamId:'-M75Ss4P4_rYXs45SRWF',
            createdAt: '1589246396817'
           

        }
    ]
};

const userDetails = { 

    credentials: {
        
        userId: 'O7ks3AP1u1YMP8tVz79q28jAyCZ2',
        email: 'user@someemail.com',
        handle: 'idontknowtheusername',
        createdAt: 1589319870252,
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/simplisco-5bc92.appspot.com/o/61359096732.jpg?alt=media'

    },
    likes: [
        {
            userHandle: 'user',
            screamId:'-M75Ss4P4_rYXs45SRWF'
        },
        {
            userHandle: 'user',
            screamId:'-M75T-_xVRm-8p8xjFX2'
        }

    ]
};