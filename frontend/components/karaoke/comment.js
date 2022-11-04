import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { Avatar } from "@mantine/core";
import { Button } from "@mantine/core";
import { rectifyFormat } from "../../utils/formatUTC";
import { Divider } from "@mantine/core";

/* todo: 
  - recursive comments
  - format likes, dislikes and likes, dislike onclick
*/
const COMMENTS = [
  {  
    content: "Estamos a 4.8 M de vistas para los 100 M vamos ONCE Y FANS DEL KPOP APOYEN ESTA JOYA , UN GRUPO COMO TWICE SE MERECE MUCHO MAS APOYO .",
    authorUsername: "jinniologist",
    date: "2022-10-23T01:07:44.920512+00:00", 
    likes: 168,
    dislikes: 10,
  },
  {  
    content: "Visual, Vocal, Choreo, literally everything in this is really amazing!!! TWICE gave us the another masterpiece.",
    authorUsername: "ONCE FOREVER!!",
    date: "2022-10-23T01:07:44.920512+00:00",
    likes: 78,
    dislikes: 10,
  },
  {  
    content: "this album is absolutely amazing. Solidifies TWICE not only as a korean artist but as a fully grown global artist",
    authorUsername: "Byrnisonn",
    date: "2022-10-23T01:07:44.920512+00:00",
    likes: 48,
    dislikes: 10,
  },
  {
    content: "TWICE has surpassed 1.4 MILLION points on Billboard Japan Hot 100! They are the first Korean act to reach this milestone",
    authorUsername: "Life of Mori",
    date: "2022-10-23T01:07:44.920512+00:00",
    likes: 18,
    dislikes: 0,
  }
]

function Comment({props}) {
  let {content, authorUsername, date, likes, dislikes} = props;
  return (
    <div style={{display: "flex", flexDirection: "row"}}>
      <div>
        <Avatar style={{marginRight: '1rem'}} radius="xl" alt="no image here"/>
      </div>
      <div style={{display: "flex", flexDirection: "column"}}>
        <div style={{display: "flex", flexDirection: "row", alignContent: "flex-start", marginBottom: '0.5rem'}}>
          <p style={{marginBottom: 0, marginTop: 0, marginRight: '0.5rem'}}>{authorUsername}</p>
          <p style={{fontSize: '0.9rem', marginTop: 0, marginBottom: 0, marginRight: '0.5rem'}} >{rectifyFormat(date)}</p>
        </div>
        <p style={{margin:0}}>{content}</p>
        <div style={{display: "flex", flexDirection: "row", alignItems: 'center'}}>
          <Button style={{marginRight: '0.25rem'}} color="gray" compact size="xs" variant="light" radius="xl"><AiFillLike size={12}/></Button>
          <p style= {{marginRight: "1rem"}}>{likes}</p>
          <Button style={{marginRight: '0.25rem'}} color="gray" compact size="xs" variant="light" radius="xl"><AiFillDislike size={12}/> </Button>
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
        <Comment key={comment.authorUsername} props={comment}/>
     ))}
    </>
  )
}