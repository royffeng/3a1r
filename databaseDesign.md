## User
- UserID
- Name
- email
- password (encrypted)
- Profile Picture (references BLOB in Original Storage)

## Video
- VideoID
- date_created
- description
- dislikes
- likes
- VideoRef (references BLOB in Original Storage)
- AudioRef (references BLOB in Original Storage)

## Videos Created By
- Video: VideoID
- Author: UserID

## Users Like Videos
- Video: VideoID
- Author: AuthorID

## Comments (weak entity) connects to Video
- Author: AuthorID from User
- Video: VideoID from Video
- Content: text

