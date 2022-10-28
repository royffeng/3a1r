import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { Avatar } from "@mantine/core";
import { Button } from "@mantine/core";

/* todo: 
  - recursive comments
  - how long ago
  - format likes, dislikes
*/
const COMMENTS = [
  {  
    content: "Estamos a 4.8 M de vistas para los 100 M vamos ONCE Y FANS DEL KPOP APOYEN ESTA JOYA , UN GRUPO COMO TWICE SE MERECE MUCHO MAS APOYO .",
    authorUsername: "jinniologist",
    likes: 168,
    dislikes: 10,
  },
  {  
    content: "Visual, Vocal, Choreo, literally everything in this is really amazing!!! TWICE gave us the another masterpiece.",
    authorUsername: "ONCE FOREVER!!",
    likes: 78,
    dislikes: 10,
  },
  {  
    content: "this album is absolutely amazing. Solidifies TWICE not only as a korean artist but as a fully grown global artist",
    authorUsername: "Byrnisonn",
    likes: 48,
    dislikes: 10,
  },
  {
    content: "TWICE has surpassed 1.4 MILLION points on Billboard Japan Hot 100! They are the first Korean act to reach this milestone",
    authorUsername: "Life of Mori",
    likes: 18,
    dislikes: 0,
  }
]

function Comment({props}) {
  let {content, authorUsername, likes, dislikes} = props;
  console.log(props);
  return (
    <div style={{display: "flex", flexDirection: "row"}}>
      <div>
        <Avatar style={{marginRight: '1rem'}} radius="xl" alt="no image here"/>
      </div>
      <div style={{display: "flex", flexDirection: "column"}}>
        <div style={{display: "flex", flexDirection: "row"}}>
          <p style={{marginBottom: 0, marginTop: 0}}>{authorUsername}</p>
        </div>
        <p>{content}</p>
        <div style={{display: "flex", flexDirection: "row", alignItems: 'center'}}>
          <Button variant="light" radius="xl"><AiFillLike size={14}/></Button>
          <p style= {{marginRight: "1rem"}}>{likes}</p>
          <Button variant="light" radius="xl"><AiFillDislike size={14}/> </Button>
          <p>{dislikes}</p>
        </div>
      </div>
    </div>
  )
}

export default function Comments() {
  return (
    <>
     {COMMENTS.map((comment) => (
        <Comment props={comment}/>
     ))}
    </>
  )
}