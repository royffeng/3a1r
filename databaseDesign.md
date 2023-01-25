## User

- UserID
- Username
- Name
- email
- password (encrypted)
- Profile Picture (references BLOB in Original Storage)

## Video

- VideoID
- duration
- Genre
- date_created
- description
- dislikes
- likes
- VideoRef (references BLOB in Original Storage)
- AudioRef (references BLOB in Original Storage)

## Playlist

- playlist ID
- Name
- date created
- playlist image cover url

## User owns Playlist

- User: UserID
- Playlist: PlaylistID

## Playlist contains videos

- Playlist: playlist ID
- Video: VideoID

## Videos Created By

- Video: VideoID
- Author: UserID

## Users Like Videos

- Video: VideoID
- Author: AuthorID

## Users Dislike Videos

- Video: VideoID
- Author: AuthorID

## Comments (weak entity) connects to Video

- Author: AuthorID from User
- Video: VideoID from Video
- Content: text
