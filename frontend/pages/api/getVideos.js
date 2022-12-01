// export default async function handler(req, res) {

//     const { data, error } = await supabase
//   .from('video')
//   .select(`
//     id,
//     title,
//     thumbnail,
//   `)

//   if (error === null){
//     res.status(500).json("Fail");
//   } else {
//     console.log(data)
//     res.status(200).json({ name: "John Doe" });
//   }
//   }
  